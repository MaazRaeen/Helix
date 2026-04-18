const fs = require('fs');
const path = require('path');

/**
 * Logistic Regression Trainer for Helix Governance Hub
 * Trains on loan_data_1.csv and outputs coefficients for the decision engine.
 */

const DATA_PATH = path.join(__dirname, '../../loan_data_1.csv');
const OUTPUT_PATH = path.join(__dirname, '../data/model_metadata.json');

function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

function parseCSV(content) {
    const lines = content.trim().split('\n');
    const headers = lines[0].split(',');
    
    return lines.slice(1).map(line => {
        const values = line.split(',');
        const obj = {};
        headers.forEach((header, i) => {
            obj[header.trim()] = values[i]?.trim();
        });
        return obj;
    });
}

function preprocess(data) {
    const featureMatrix = [];
    const labels = [];

    data.forEach(row => {
        if (!row.Loan_Status) return; // Skip invalid rows

        const features = [
            1, // Bias term
            row.Gender === 'Female' ? 1 : 0,
            row.Married === 'Yes' ? 1 : 0,
            parseInt(row.Dependents) || 0,
            row.Education === 'Graduate' ? 1 : 0,
            row.Self_Employed === 'Yes' ? 1 : 0,
            parseFloat(row.ApplicantIncome) || 0,
            parseFloat(row.CoapplicantIncome) || 0,
            parseFloat(row.LoanAmount) || 0,
            parseFloat(row.Loan_Amount_Term) || 360,
            parseFloat(row.Credit_History) || 0,
            row.Property_Area === 'Urban' ? 2 : row.Property_Area === 'Semiurban' ? 1 : 0
        ];

        featureMatrix.push(features);
        labels.push(row.Loan_Status === 'Y' ? 1 : 0);
    });

    return { featureMatrix, labels };
}

function normalize(matrix) {
    const numFeatures = matrix[0].length;
    const means = new Array(numFeatures).fill(0);
    const stds = new Array(numFeatures).fill(0);

    for (let j = 1; j < numFeatures; j++) { // Skip bias
        let sum = 0;
        for (let i = 0; i < matrix.length; i++) sum += matrix[i][j];
        means[j] = sum / matrix.length;

        let varianceSum = 0;
        for (let i = 0; i < matrix.length; i++) varianceSum += Math.pow(matrix[i][j] - means[j], 2);
        stds[j] = Math.sqrt(varianceSum / matrix.length) || 1;

        for (let i = 0; i < matrix.length; i++) {
            matrix[i][j] = (matrix[i][j] - means[j]) / stds[j];
        }
    }

    return { means, stds };
}

function train(X, y, iterations = 1000, lr = 0.1) {
    const m = X.length;
    const n = X[0].length;
    let weights = new Array(n).fill(0);

    for (let iter = 0; iter < iterations; iter++) {
        const gradients = new Array(n).fill(0);
        
        for (let i = 0; i < m; i++) {
            let z = 0;
            for (let j = 0; j < n; j++) z += X[i][j] * weights[j];
            
            const prediction = sigmoid(z);
            const error = prediction - y[i];

            for (let j = 0; j < n; j++) {
                gradients[j] += error * X[i][j];
            }
        }

        for (let j = 0; j < n; j++) {
            weights[j] -= (lr * gradients[j]) / m;
        }

        if (iter % 200 === 0) {
            console.log(`Iteration ${iter} complete...`);
        }
    }

    return weights;
}

async function run() {
    console.log("Starting model training on loan_data_1.csv...");
    
    if (!fs.existsSync(DATA_PATH)) {
        console.error(`Error: Dataset not found at ${DATA_PATH}`);
        return;
    }

    const content = fs.readFileSync(DATA_PATH, 'utf-8');
    const rawData = parseCSV(content);
    console.log(`Parsed ${rawData.length} rows.`);

    const { featureMatrix, labels } = preprocess(rawData);
    const { means, stds } = normalize(featureMatrix);
    const weights = train(featureMatrix, labels);

    const metadata = {
        model_type: "Logistic Regression",
        trained_at: new Date().toISOString(),
        features: [
            "Bias", "Gender", "Married", "Dependents", "Education", 
            "Self_Employed", "ApplicantIncome", "CoapplicantIncome", 
            "LoanAmount", "Loan_Amount_Term", "Credit_History", "Property_Area"
        ],
        weights,
        means,
        stds
    };

    if (!fs.existsSync(path.dirname(OUTPUT_PATH))) {
        fs.mkdirSync(path.dirname(OUTPUT_PATH), { recursive: true });
    }

    fs.writeFileSync(OUTPUT_PATH, JSON.stringify(metadata, null, 2));
    console.log(`Model successfully trained and saved to ${OUTPUT_PATH}`);
}

run().catch(console.error);

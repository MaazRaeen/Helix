const fs = require('fs');
const path = require('path');

/**
 * Data-Driven Decision Engine (trained on loan_data_1.csv)
 * 
 * IMPORTANT: The training data uses:
 * - ApplicantIncome: raw rupees (range ~1000-80000)
 * - CoapplicantIncome: raw rupees
 * - LoanAmount: in THOUSANDS (e.g. 128 = ₹128,000)
 * - Credit_History: binary 0/1
 * - Loan_Amount_Term: months (e.g. 360)
 */

let modelMeta = null;
try {
    const metaPath = path.join(__dirname, '../data/model_metadata.json');
    if (fs.existsSync(metaPath)) {
        modelMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
        console.log('[ML] Model weights loaded successfully. Features:', modelMeta.features.length);
    }
} catch (error) {
    console.error("Failed to load ML weights:", error);
}

function sigmoid(z) {
    // Clamp to prevent overflow
    const clamped = Math.max(-500, Math.min(500, z));
    return 1 / (1 + Math.exp(-clamped));
}

function calculateResult(data) {
    if (!modelMeta) {
        return { error: "ML Model unavailable", decision: "ERR" };
    }

    const { weights, means, stds, features } = modelMeta;
    
    // Parse input values
    const applicantIncome = parseFloat(data.income) || 0;
    const coapplicantIncome = parseFloat(data.coapplicant_income) || 0;
    const loanAmountRaw = parseFloat(data.loan_amount) || 0;
    const loanTerm = parseFloat(data.loan_term) || 360;
    const creditScore = parseFloat(data.credit_score) || 0;

    // Convert loan_amount: user enters raw (e.g. 250000), CSV was in thousands (e.g. 128)
    const loanAmountInK = loanAmountRaw >= 1000 ? loanAmountRaw / 1000 : loanAmountRaw;

    // Credit_History is binary 0/1 in training data
    // If user enters 0 or 1 directly, use as-is; if entering a score like 720, map >=650 → 1
    const creditHistory = creditScore <= 1 ? creditScore : (creditScore >= 650 ? 1 : 0);

    // Feature Mapping (must match training order exactly)
    const mappedFeatures = [
        1,                                             // [0] Bias
        data.gender === 'Female' ? 1 : 0,              // [1] Gender (Female=1)
        data.married === 'Yes' ? 1 : 0,                // [2] Married
        parseInt(data.dependents) || 0,                 // [3] Dependents
        data.education === 'Graduate' ? 1 : 0,          // [4] Education
        data.self_employed === 'Yes' ? 1 : 0,           // [5] Self_Employed
        applicantIncome,                                // [6] ApplicantIncome
        coapplicantIncome,                              // [7] CoapplicantIncome
        loanAmountInK,                                  // [8] LoanAmount (in thousands)
        loanTerm,                                       // [9] Loan_Amount_Term
        creditHistory,                                  // [10] Credit_History (binary)
        data.property_area === 'Urban' ? 2 : data.property_area === 'Semiurban' ? 1 : 0  // [11] Property_Area
    ];

    let score = weights[0]; // Start with Bias
    const contributions = [];

    // Calculate weighted contributions
    for (let i = 1; i < mappedFeatures.length; i++) {
        const rawValue = mappedFeatures[i];
        const std = stds[i] || 1;
        const normalizedValue = (rawValue - means[i]) / std;

        // Clamp the normalized value to prevent extreme outliers from dominating
        const clampedNorm = Math.max(-3, Math.min(3, normalizedValue));
        const contribution = weights[i] * clampedNorm;
        
        score += contribution;
        
        contributions.push({
            feature: features[i],
            value: rawValue,
            contribution: parseFloat(contribution.toFixed(4)),
            impact: contribution > 0 ? 'positive' : 'negative'
        });
    }

    const probability = sigmoid(score);
    const THRESHOLD = 0.5;
    const decision = probability >= THRESHOLD ? 'APPROVE' : 'REJECT';

    // Sort contributions by absolute impact for top drivers
    const topFactors = [...contributions]
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
        .slice(0, 5);

    console.log(`[ML] Score: ${score.toFixed(4)}, P(approve): ${(probability * 100).toFixed(1)}%, Decision: ${decision}`);

    return {
        score: parseFloat(score.toFixed(4)),
        probability,
        decision,
        contributions,
        topFactors,
        isBorderline: probability >= 0.40 && probability <= 0.60
    };
}

/**
 * Calculate minimal changes required to flip REJECT → APPROVE
 */
function calculateCounterfactuals(data, currentResult) {
    if (currentResult.decision === 'APPROVE' || !modelMeta) return [];

    const { weights, means, stds, features } = modelMeta;
    const suggestions = [];
    const scoreGap = 0 - currentResult.score; // Need score > 0 for prob > 0.5

    // Only suggest changes for features that make sense
    const adjustableFeatures = {
        6: { name: 'Applicant Income', field: 'income', unit: '₹' },
        7: { name: 'Coapplicant Income', field: 'coapplicant_income', unit: '₹' },
        10: { name: 'Credit History', field: 'credit_score', unit: '' }
    };

    for (const [idx, info] of Object.entries(adjustableFeatures)) {
        const i = parseInt(idx);
        const weight = weights[i];
        if (Math.abs(weight) < 0.01) continue;

        if (i === 10 && parseFloat(data.credit_score) < 1) {
            // Can improve credit history from 0 to 1
            suggestions.push({
                feature: info.name,
                currentValue: 0,
                requiredValue: 1,
                changeNeeded: 1,
                description: `Establish a positive credit history (this is the strongest factor)`
            });
        } else if (weight > 0) {
            const deltaRequired = (scoreGap * (stds[i] || 1)) / weight;
            const currentVal = parseFloat(data[info.field]) || 0;
            const newValue = currentVal + deltaRequired;
            if (newValue > 0) {
                suggestions.push({
                    feature: info.name,
                    currentValue: Math.round(currentVal),
                    requiredValue: Math.round(newValue),
                    changeNeeded: Math.round(deltaRequired),
                    description: `Increase ${info.name} by ~${info.unit}${Math.abs(Math.round(deltaRequired)).toLocaleString()}`
                });
            }
        }
    }

    return suggestions.sort((a, b) => Math.abs(a.changeNeeded) - Math.abs(b.changeNeeded)).slice(0, 3);
}

module.exports = {
    calculateResult,
    calculateCounterfactuals
};

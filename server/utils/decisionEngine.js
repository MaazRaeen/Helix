const fs = require('fs');
const path = require('path');

/**
 * Data-Driven Decision Engine (trained on loan_data_1.csv)
 */

let modelMeta = null;
try {
    const metaPath = path.join(__dirname, '../data/model_metadata.json');
    if (fs.existsSync(metaPath)) {
        modelMeta = JSON.parse(fs.readFileSync(metaPath, 'utf8'));
    }
} catch (error) {
    console.error("Failed to load ML weights:", error);
}

function sigmoid(z) {
    return 1 / (1 + Math.exp(-z));
}

function calculateResult(data) {
    if (!modelMeta) {
        // Fallback to legacy logic if training fails
        return { error: "ML Model unavailable", decision: "ERR" };
    }

    const { weights, means, stds, features } = modelMeta;
    
    // Feature Mapping
    const mappedFeatures = [
        1, // Bias
        data.gender === 'Female' ? 1 : 0,
        data.married === 'Yes' ? 1 : 0,
        parseInt(data.dependents) || 0,
        data.education === 'Graduate' ? 1 : 0,
        data.self_employed === 'Yes' ? 1 : 0,
        parseFloat(data.income) || 0,
        parseFloat(data.coapplicant_income) || 0,
        parseFloat(data.loan_amount) / 1000 || 0, // App uses raw curreny, model might want K (check CSV)
        parseFloat(data.loan_term) || 360,
        data.credit_score >= 650 ? 1 : 0, // Simplified credit mapping
        data.property_area === 'Urban' ? 2 : data.property_area === 'Semiurban' ? 1 : 0
    ];

    let score = weights[0]; // Start with Bias
    const contributions = [];

    // Skip Bias for contributions
    for (let i = 1; i < mappedFeatures.length; i++) {
        const rawValue = mappedFeatures[i];
        const normalizedValue = (rawValue - means[i]) / (stds[i] || 1);
        const contribution = weights[i] * normalizedValue;
        
        score += contribution;
        
        contributions.push({
            feature: features[i],
            value: rawValue,
            contribution,
            impact: contribution > 0 ? 'positive' : 'negative'
        });
    }

    const probability = sigmoid(score);
    const THRESHOLD = 0.5; // Traditional logistic threshold
    const decision = probability >= THRESHOLD ? 'APPROVE' : 'REJECT';

    // Sort contributions for top drivers
    const topFactors = [...contributions]
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
        .slice(0, 3);

    return {
        score,
        probability,
        decision,
        contributions,
        topFactors,
        isBorderline: probability >= 0.45 && probability <= 0.55
    };
}

/**
 * Minimal change required to flip REJECT -> APPROVE
 * Simplified for multi-feature model.
 */
function calculateCounterfactuals(data, currentResult) {
    if (currentResult.decision === 'APPROVE' || !modelMeta) return null;

    const { weights, means, stds, features } = modelMeta;
    const suggestions = [];
    const scoreGap = 0 - currentResult.score; // Sigmoid(0) = 0.5 threshold

    // Suggest 2 easiest changes
    for (let i = 1; i < features.length; i++) {
        const weight = weights[i];
        if (Math.abs(weight) < 0.1) continue; // Skip weak predictors

        const rawValue = (i === 1) ? (data.gender === 'Female' ? 1 : 0) : 
                         (i === 2) ? (data.married === 'Yes' ? 1 : 0) :
                         (i === 4) ? (data.education === 'Graduate' ? 1 : 0) :
                         (i === 10) ? (data.credit_score >= 650 ? 1 : 0) :
                         parseFloat(data[features[i].toLowerCase()]) || 0;

        // Roughly estimate delta: weight * (delta / std) = scoreGap => delta = scoreGap * std / weight
        const deltaRequired = (scoreGap * stds[i]) / weight;
        
        // Only suggest for continuous features that are feasible
        if (["ApplicantIncome", "LoanAmount"].includes(features[i])) {
            const newValue = rawValue + deltaRequired;
            if (newValue < 0) continue;

            suggestions.push({
                feature: features[i].replace('_', ' '),
                currentValue: Math.round(rawValue),
                requiredValue: Math.round(newValue),
                changeNeeded: Math.round(deltaRequired),
                description: deltaRequired > 0 ? `Increase ${features[i]} by ~${Math.round(deltaRequired)}` : `Decrease ${features[i]} by ~${Math.round(Math.abs(deltaRequired))}`
            });
        }
    }

    return suggestions.sort((a, b) => Math.abs(a.changeNeeded) - Math.abs(b.changeNeeded)).slice(0, 2);
}

module.exports = {
    calculateResult,
    calculateCounterfactuals
};

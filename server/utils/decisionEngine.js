/**
 * Deterministic Decision Engine for Loan Simulation
 * 
 * Formula:
 * score = 0.003 * income + 0.02 * credit_score + 0.01 * employment_length - 0.025 * existing_debt + 0.002 * bank_balance
 * probability = 1 / (1 + exp(-score))
 */

const COEFFICIENTS = {
    income: 0.003,
    credit_score: 0.02,
    employment_length: 0.01,
    existing_debt: -0.025,
    bank_balance: 0.002
};

const THRESHOLD = 0.6; // Probability threshold for Approval
const TARGET_LOGIT = -Math.log(1 / THRESHOLD - 1); // Score required for probability >= 0.6

function calculateResult(data) {
    let score = 0;
    const contributions = [];

    for (const [feature, coef] of Object.entries(COEFFICIENTS)) {
        const value = data[feature] || 0;
        const contribution = value * coef;
        score += contribution;
        contributions.push({
            feature,
            value,
            contribution,
            impact: contribution > 0 ? 'positive' : 'negative'
        });
    }

    const probability = 1 / (1 + Math.exp(-score));
    const decision = probability >= THRESHOLD ? 'APPROVE' : 'REJECT';

    // Sort contributions by absolute value to find top drivers
    const topFactors = [...contributions]
        .sort((a, b) => Math.abs(b.contribution) - Math.abs(a.contribution))
        .slice(0, 3);

    return {
        score,
        probability,
        decision,
        contributions,
        topFactors,
        isBorderline: probability >= 0.55 && probability <= 0.65
    };
}

/**
 * Minimal change required to flip REJECT -> APPROVE
 */
function calculateCounterfactuals(data, currentResult) {
    if (currentResult.decision === 'APPROVE') return null;

    const suggestions = [];
    const currentScore = currentResult.score;
    const scoreGap = TARGET_LOGIT - currentScore;

    if (scoreGap <= 0) return null;

    // For each feature, calculate how much it would need to change alone to flip the decision
    for (const [feature, coef] of Object.entries(COEFFICIENTS)) {
        if (coef === 0) continue;

        // Change needed: delta * coef = scoreGap => delta = scoreGap / coef
        const deltaRequired = scoreGap / coef;
        const newValue = (data[feature] || 0) + deltaRequired;

        // Only suggest realistic changes (e.g., you can't have negative debt or 1000 credit score)
        // If coef is negative (like debt), deltaRequired will be negative (reducing debt)
        if (feature === 'credit_score' && newValue > 850) continue;
        if (feature === 'existing_debt' && newValue < 0) {
            // If debt reduction alone isn't enough even at 0, skip
            continue;
        }

        suggestions.push({
            feature,
            currentValue: data[feature] || 0,
            requiredValue: Math.round(newValue * 100) / 100,
            changeNeeded: Math.round(deltaRequired * 100) / 100,
            description: coef > 0 
                ? `Increase ${feature.replace('_', ' ')} by ${Math.abs(Math.round(deltaRequired))}`
                : `Reduce ${feature.replace('_', ' ')} by ${Math.abs(Math.round(deltaRequired))}`
        });
    }

    // Sort by "perceived difficulty" or just absolute change? 
    // Here we'll just return top 2 most impactful suggested changes
    return suggestions.sort((a, b) => Math.abs(a.changeNeeded) - Math.abs(b.changeNeeded)).slice(0, 2);
}

module.exports = {
    calculateResult,
    calculateCounterfactuals
};

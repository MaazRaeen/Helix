const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATION_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3-flash-preview" });

/**
 * Generate a natural language explanation for the initial decision.
 */
async function generateInitialExplanation(data, result) {
    const prompt = `
    You are an AI decision transparency assistant for a bank. 
    A loan application was processed by a deterministic algorithm.
    
    Application Details:
    - Income: ${data.income}
    - Credit Score: ${data.credit_score}
    - Employment Length: ${data.employment_length} months
    - Existing Debt: ${data.existing_debt}
    - Bank Balance: ${data.bank_balance}
    
    Algorithm Result:
    - Decision: ${result.decision}
    - Probability: ${(result.probability * 100).toFixed(2)}%
    - Key Factors: ${result.topFactors.map(f => `${f.feature} (${f.impact})`).join(', ')}
    
    Task:
    Provide a concise, professional, and transparent 2-3 sentence explanation for the user. 
    Explain why the decision was made based on the key factors. 
    If rejected, be empathetic but clear about high-impact negative factors.
    `;

    try {
        const genResult = await model.generateContent(prompt);
        return genResult.response.text().trim();
    } catch (error) {
        console.error("Gemini Error:", error);
        return "Internal AI explanation service is temporarily unavailable. The decision was primarily influenced by your credit score and debt-to-income ratio.";
    }
}

/**
 * Generate an explanation for the "Delta" (Before vs After).
 */
async function generateDeltaExplanation(before, after) {
    const prompt = `
    Analyze the change in a loan decision after the user contested the initial results.
    
    Initial State:
    - Decision: ${before.decision}
    - Probability: ${(before.probability * 100).toFixed(2)}%
    
    Updated State:
    - Decision: ${after.decision}
    - Probability: ${(after.probability * 100).toFixed(2)}%
    
    Changes made by user:
    ${JSON.stringify(after.changes, null, 2)}
    
    Task:
    Explain how the user's contestation and new evidence changed the outcome. 
    Highlight which updated factor had the most significant positive impact on the probability shift.
    Keep it to 2 sentences.
    `;

    try {
        const genResult = await model.generateContent(prompt);
        return genResult.response.text().trim();
    } catch (error) {
        return "The updated information significantly adjusted the risk profile, leading to a more favorable outcome.";
    }
}

/**
 * Generate natural language counterfactual suggestions.
 */
async function generateCounterfactualSuggestions(suggestions) {
    if (!suggestions || suggestions.length === 0) return null;

    const prompt = `
    The user's loan application was rejected. Here are the mathematical minimal changes required to flip the decision:
    ${JSON.stringify(suggestions, null, 2)}
    
    Task:
    Convert these technical requirements into actionable, encouraging advice for the user.
    Example: "If you can reduce your existing debt by $8000, your application would Likely be approved."
    Provide 1-2 bullet points.
    `;

    try {
        const genResult = await model.generateContent(prompt);
        return genResult.response.text().trim();
    } catch (error) {
        return "Consider improving your credit score or reducing existing debt to increase approval chances.";
    }
}

module.exports = {
    generateInitialExplanation,
    generateDeltaExplanation,
    generateCounterfactualSuggestions
};

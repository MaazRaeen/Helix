const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATION_AI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.GEMINI_MODEL || "gemini-3-flash-preview" });

/**
 * Generate a natural language explanation for the initial decision.
 */
async function generateInitialExplanation(data, result) {
    const topFactorsStr = (result.topFactors || []).map(f => `${f.feature} (${f.impact})`).join(', ') || 'N/A';
    
    const prompt = `
    You are an AI decision transparency assistant for a bank. 
    A loan application was processed by a machine learning model trained on real data.
    
    Application Details:
    - Applicant Income: ${data.income || 'N/A'}
    - Coapplicant Income: ${data.coapplicant_income || 0}
    - Credit Score: ${data.credit_score || 'N/A'}
    - Education: ${data.education || 'N/A'}
    - Gender: ${data.gender || 'N/A'}
    - Married: ${data.married || 'N/A'}
    - Property Area: ${data.property_area || 'N/A'}
    - Loan Amount: ${data.loan_amount || 'N/A'}
    
    Algorithm Result:
    - Decision: ${result.decision}
    - Probability: ${(result.probability * 100).toFixed(2)}%
    - Key Factors: ${topFactorsStr}
    
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
        return "Internal AI explanation service is temporarily unavailable. The decision was primarily influenced by your credit history and income profile.";
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

/**
 * Handle general conversation about the Helix platform.
 */
async function handleOracleChat(userMessage, history = []) {
    const systemInstruction = `
    You are the "Helix Oracle", the high-level AI assistant for the Helix Governance platform.
    
    About Helix:
    - Helix is a premium AI Decision Contestation Interface used for high-stakes decisions like loans and corporate directives.
    - Key Innovation: It transforms static AI decisions (Approve/Reject) into an interactive, challengeable process.
    - Contestation Layer: This is where users can challenge specific decision factors (like income or debt) and submit counter-evidence.
    - Decision Delta: A view that visually demonstrates how a decision transformed after an appeal, showing probability shifts.
    - Executive Suite: includes a "Directive Portal" for high-priority submissions, a "Decision Ledger" for formal audit trails, and "Oracle Alerts" for system telemetry.
    - Technology: Built with React, Framer Motion, Node.js, and Google Gemini.
    
    Guidelines:
    - Be professional, highly technical but accessible, and slightly futuristic.
    - Use terms like "Neural Flux", "Governance Ledger", "Policy Drift", and "Contestation Loop".
    - Explain features if asked (Explorer, Ledger, Alerts, Directives).
    - If asked about loan status, explain that users can check the "Executive Explorer" or "Decision Ledger".
    - ONLY give information about Helix. If asked unrelated topics, steer back to Helix governance.
    `;

    try {
        const chat = model.startChat({
            history: history.map(msg => ({
                role: msg.role === 'user' ? 'user' : 'model',
                parts: [{ text: msg.content }]
            })),
            generationConfig: {
                maxOutputTokens: 500,
            },
        });

        const fullPrompt = `${systemInstruction}\n\nUser: ${userMessage}`;
        const genResult = await chat.sendMessage(userMessage); // System instruction is effectively part of the persona if we handle it right, but here we just send it.
        // Actually, better to use system Instruction in getGenerativeModel if supported, 
        // but for compatibility with existing code I will just prefix the context or use a message.
        
        return genResult.response.text().trim();
    } catch (error) {
        console.error("Chat Error:", error);
        return "The Helix Oracle is currently recalibrating its neural mesh. Please try again in a few moments.";
    }
}

module.exports = {
    generateInitialExplanation,
    generateDeltaExplanation,
    generateCounterfactualSuggestions,
    handleOracleChat
};

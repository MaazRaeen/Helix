const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    income: { type: Number, required: true },
    coapplicant_income: { type: Number, default: 0 },
    credit_score: { type: Number, required: true },
    loan_amount: { type: Number, required: true },
    loan_term: { type: Number, required: true },
    
    // ML Specific Features
    gender: { type: String, default: 'Male' },
    married: { type: String, default: 'No' },
    dependents: { type: String, default: '0' },
    education: { type: String, default: 'Graduate' },
    self_employed: { type: String, default: 'No' },
    property_area: { type: String, default: 'Semiurban' },
    existing_debt: { type: Number, default: 0 },

    // Legacy / Simulation Fields (Optional)
    employment_length: { type: Number, default: 24 },
    bank_balance: { type: Number, default: 15000 },
    
    initial_result: {
        decision: String,
        probability: Number,
        score: Number,
        explanation: String,
        topFactors: Array
    },
    
    updated_state: {
        name: String,
        income: Number,
        coapplicant_income: Number,
        credit_score: Number,
        loan_amount: Number,
        loan_term: Number,
        gender: String,
        married: String,
        dependents: String,
        education: String,
        self_employed: String,
        property_area: String,
        existing_debt: Number,
        decision: String,
        probability: Number,
        explanation: String,
        isContested: { type: Boolean, default: false }
    },

    counterfactuals: {
        suggestions: Array,
        ai_advice: String
    },

    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Case', CaseSchema);

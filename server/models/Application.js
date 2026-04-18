const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
    name: { type: String, required: true },
    income: { type: Number, required: true },
    credit_score: { type: Number, required: true },
    employment_length: { type: Number, required: true },
    existing_debt: { type: Number, required: true },
    bank_balance: { type: Number, required: true },
    
    initial_result: {
        decision: String,
        probability: Number,
        score: Number,
        explanation: String,
        topFactors: Array
    },
    
    updated_state: {
        income: Number,
        credit_score: Number,
        employment_length: Number,
        existing_debt: Number,
        bank_balance: Number,
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

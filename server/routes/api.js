console.log('[DEBUG] Initializing Helix API Router...');
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Case = require('../models/Application');
const { calculateResult, calculateCounterfactuals } = require('../utils/decisionEngine');
const { 
    generateInitialExplanation, 
    generateDeltaExplanation, 
    generateCounterfactualSuggestions,
    handleOracleChat
} = require('../utils/geminiService');

router.get('/ping', (req, res) => res.json({ status: 'online', context: 'Helix API RESTORED', timestamp: new Date() }));

/**
 * GET /api/cases - Fetch demo cases
 */
router.get('/cases', async (req, res) => {
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        return res.json(global.mockCases || []);
    }
    try {
        const cases = await Case.find().sort({ createdAt: -1 });
        res.json(cases);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * GET /api/case/:id - Singular alias for frontend compatibility
 */
router.get('/case/:id', async (req, res) => {
    console.log(`[GET] Fetching case detail: ${req.params.id}`);
    
    let item;
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        item = (global.mockCases || []).find(c => c._id === req.params.id);
    } else {
        try {
            item = await Case.findById(req.params.id);
        } catch (error) {
            console.error(`[ERROR] Failed to fetch case ${req.params.id}:`, error.message);
            return res.status(404).json({ error: 'Format error or Case missing' });
        }
    }

    if (!item) {
        console.warn(`[WARN] Case detail not found: ${req.params.id}`);
        return res.status(404).json({ error: 'Case not found' });
    }

    // Flatten for UI compatibility
    const currentView = item.updated_state || {};
    const responseData = {
        ...item.toObject ? item.toObject() : item,
        decision: currentView.decision || 'PENDING',
        probability: currentView.probability || 0,
        confidence: Math.round((currentView.probability || 0) * 100),
        explanation: currentView.explanation || "No explanation available.",
        topFactors: item.initial_result?.topFactors || []
    };

    res.json(responseData);
});

/**
 * GET /api/cases/:id - Fetch a single case (Plural version)
 */
router.get('/cases/:id', async (req, res) => {
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        const item = (global.mockCases || []).find(c => c._id === req.params.id);
        return item ? res.json(item) : res.status(404).json({ error: 'Case not found' });
    }
    try {
        const item = await Case.findById(req.params.id);
        res.json(item);
    } catch (error) {
        res.status(404).json({ error: 'Case not found' });
    }
});

/**
 * POST /api/predict - Create a new case or evaluate data
 */
router.post('/predict', async (req, res) => {
    try {
        const data = req.body;
        const result = calculateResult(data);
        
        // Generate AI explanation
        const explanation = await generateInitialExplanation(data, result);
        result.explanation = explanation;

        // Calculate counterfactuals if rejected
        let counterfactuals = null;
        if (result.decision === 'REJECT') {
            const suggestions = calculateCounterfactuals(data, result);
            const ai_advice = await generateCounterfactualSuggestions(suggestions);
            counterfactuals = { suggestions, ai_advice };
        }

        if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
            const newCase = {
                _id: Date.now().toString(),
                ...data,
                initial_result: result,
                updated_state: { ...data, ...result, isContested: false },
                counterfactuals,
                createdAt: new Date()
            };
            global.mockCases.unshift(newCase);
            return res.json(newCase);
        }

        const newCase = new Case({
            ...data,
            initial_result: result,
            updated_state: { ...data, ...result, isContested: false },
            counterfactuals
        });

        await newCase.save();
        res.json(newCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/re-evaluate/:id - Update values and re-calculate
 */
router.post('/re-evaluate/:id', async (req, res) => {
    const { updatedData } = req.body;

    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        const caseIndex = (global.mockCases || []).findIndex(c => c._id === req.params.id);
        if (caseIndex === -1) return res.status(404).json({ error: 'Case not found' });

        const existingCase = global.mockCases[caseIndex];
        const newResult = calculateResult(updatedData);
        
        const changes = {};
        for (const key in updatedData) {
            if (updatedData[key] !== existingCase[key]) {
                changes[key] = { from: existingCase[key], to: updatedData[key] };
            }
        }

        const deltaExplanation = await generateDeltaExplanation(existingCase.initial_result, { ...newResult, changes });

        let counterfactuals = null;
        if (newResult.decision === 'REJECT') {
            const suggestions = calculateCounterfactuals(updatedData, newResult);
            const ai_advice = await generateCounterfactualSuggestions(suggestions);
            counterfactuals = { suggestions, ai_advice };
        }

        global.mockCases[caseIndex].updated_state = {
            ...updatedData,
            ...newResult,
            explanation: deltaExplanation,
            isContested: true
        };
        global.mockCases[caseIndex].counterfactuals = counterfactuals;

        return res.json(global.mockCases[caseIndex]);
    }

    try {
        const existingCase = await Case.findById(req.params.id);
        if (!existingCase) return res.status(404).json({ error: 'Case not found' });

        const newResult = calculateResult(updatedData);
        
        const changes = {};
        for (const key in updatedData) {
            if (updatedData[key] !== existingCase[key]) {
                changes[key] = { from: existingCase[key], to: updatedData[key] };
            }
        }

        const deltaExplanation = await generateDeltaExplanation(existingCase.initial_result, { ...newResult, changes });

        let counterfactuals = null;
        if (newResult.decision === 'REJECT') {
            const suggestions = calculateCounterfactuals(updatedData, newResult);
            const ai_advice = await generateCounterfactualSuggestions(suggestions);
            counterfactuals = { suggestions, ai_advice };
        }

        existingCase.updated_state = {
            ...updatedData,
            ...newResult,
            explanation: deltaExplanation,
            isContested: true
        };
        existingCase.counterfactuals = counterfactuals;

        await existingCase.save();
        res.json(existingCase);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

/**
 * POST /api/chat - General Oracle Chat
 */
router.post('/chat', async (req, res) => {
    console.log(`[POST] Oracle Chat Request: ${req.body.message?.substring(0, 50)}...`);
    try {
        const { message, history } = req.body;
        if (!message) return res.status(400).json({ error: 'Empty message' });
        
        const response = await handleOracleChat(message, history || []);
        res.json({ response });
    } catch (error) {
        console.error('[ERROR] Oracle Chat Failure:', error.message);
        res.status(500).json({ error: 'Neural link degraded' });
    }
});
/**
 * DELETE /api/cases/:id - Delete a case
 */
router.delete('/cases/:id', async (req, res) => {
    console.log(`[DELETE] Removing case: ${req.params.id}`);
    if (!mongoose.connection.readyState || mongoose.connection.readyState !== 1) {
        const idx = (global.mockCases || []).findIndex(c => c._id === req.params.id);
        if (idx === -1) return res.status(404).json({ error: 'Case not found' });
        global.mockCases.splice(idx, 1);
        return res.json({ success: true, message: 'Case removed from Mock DB' });
    }
    try {
        const result = await Case.findByIdAndDelete(req.params.id);
        if (!result) return res.status(404).json({ error: 'Case not found' });
        res.json({ success: true, message: 'Case permanently removed' });
    } catch (error) {
        console.error(`[ERROR] Delete failed for ${req.params.id}:`, error.message);
        res.status(500).json({ error: 'Delete operation failed' });
    }
});

module.exports = router;

require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const apiRoutes = require('./routes/api');
const Case = require('./models/Application');
const { calculateResult } = require('./utils/decisionEngine');

const app = express();
app.use(cors());
app.use(express.json());

// Health Check
app.get('/api-health', (req, res) => res.json({ status: 'active', timestamp: new Date() }));

// Routes
app.use('/api', apiRoutes);

// Database Connection & Seeding
const PORT = process.env.PORT || 5000;
const MONGODB_URI = process.env.MONGODB_URI;

let isUsingMock = false;

mongoose.connect(MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');
        await seedDemoData();
        app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
    })
    .catch(err => {
        console.error('MongoDB connection error, falling back to Mock DB:', err.message);
        isUsingMock = true;
        // In-memory mock storage
        global.mockCases = [];
        seedMockData();
        app.listen(PORT, () => console.log(`Server running with MOCK DB on port ${PORT}`));
    });

async function seedMockData() {
    const demoData = [
        {
            _id: "650000000000000000000001",
            name: "Rahul Sharma (Rejected -> Approved)",
            income: 45000,
            coapplicant_income: 1500,
            credit_score: 620,
            loan_amount: 128000,
            loan_term: 360,
            gender: 'Male',
            married: 'Yes',
            dependents: '1',
            education: 'Graduate',
            self_employed: 'No',
            property_area: 'Rural',
            existing_debt: 20000,
            createdAt: new Date()
        },
        {
            _id: "650000000000000000000002",
            name: "Priya Patel (Rejected -> Remains Rejected)",
            income: 30000,
            coapplicant_income: 0,
            credit_score: 550,
            loan_amount: 66000,
            loan_term: 360,
            gender: 'Female',
            married: 'No',
            dependents: '0',
            education: 'Not Graduate',
            self_employed: 'No',
            property_area: 'Urban',
            existing_debt: 40000,
            createdAt: new Date()
        },
        {
            _id: "650000000000000000000003",
            name: "Amit Das (Borderline Case)",
            income: 55000,
            coapplicant_income: 2358,
            credit_score: 640,
            loan_amount: 120000,
            loan_term: 360,
            gender: 'Male',
            married: 'Yes',
            dependents: '2',
            education: 'Graduate',
            self_employed: 'No',
            property_area: 'Semiurban',
            existing_debt: 15000,
            createdAt: new Date()
        }
    ];
    
    global.mockCases = demoData.map(d => {
        const result = calculateResult(d);
        return {
            ...d,
            initial_result: { ...result, explanation: "Automated assessment." },
            updated_state: { ...d, ...result, isContested: false }
        };
    });
}

async function seedDemoData() {
    const existing = await Case.countDocuments();
    if (existing > 0) return;

    console.log('Seeding demo data...');
    
    const demoCases = [
        {
            name: "Rahul Sharma (Rejected -> Approved)",
            income: 45000,
            coapplicant_income: 1500,
            credit_score: 620,
            loan_amount: 128000,
            loan_term: 360,
            gender: 'Male',
            married: 'Yes',
            dependents: '1',
            education: 'Graduate',
            self_employed: 'No',
            property_area: 'Rural',
            existing_debt: 20000
        },
        {
            name: "Priya Patel (Rejected -> Remains Rejected)",
            income: 30000,
            coapplicant_income: 0,
            credit_score: 550,
            loan_amount: 66000,
            loan_term: 360,
            gender: 'Female',
            married: 'No',
            dependents: '0',
            education: 'Not Graduate',
            self_employed: 'No',
            property_area: 'Urban',
            existing_debt: 40000
        },
        {
            name: "Amit Das (Borderline Case)",
            income: 55000,
            coapplicant_income: 2358,
            credit_score: 640,
            loan_amount: 120000,
            loan_term: 360,
            gender: 'Male',
            married: 'Yes',
            dependents: '2',
            education: 'Graduate',
            self_employed: 'No',
            property_area: 'Semiurban',
            existing_debt: 15000
        }
    ];

    for (const data of demoCases) {
        const result = calculateResult(data);
        const newCase = new Case({
            ...data,
            initial_result: {
                ...result,
                explanation: "Initial automated assessment based on real-time neural weight analysis."
            },
            updated_state: {
                ...data,
                ...result,
                explanation: "Initial state repository entry.",
                isContested: false
            }
        });
        await newCase.save();
    }
}

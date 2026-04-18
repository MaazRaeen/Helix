import React, { createContext, useContext, useState } from 'react';

const ApplicationContext = createContext();

export const ApplicationProvider = ({ children }) => {
    const [currentApplicationId, setCurrentApplicationId] = useState(null);
    const [latestResult, setLatestResult] = useState(null);

    const resetFlow = () => {
        setCurrentApplicationId(null);
        setLatestResult(null);
    };

    return (
        <ApplicationContext.Provider value={{ 
            currentApplicationId, 
            setCurrentApplicationId,
            latestResult,
            setLatestResult,
            resetFlow
        }}>
            {children}
        </ApplicationContext.Provider>
    );
};

export const useApplication = () => {
    const context = useContext(ApplicationContext);
    if (!context) {
        throw new Error('useApplication must be used within an ApplicationProvider');
    }
    return context;
};

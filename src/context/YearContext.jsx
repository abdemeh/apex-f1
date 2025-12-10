import { createContext, useContext, useState } from 'react';

const YearContext = createContext();

export const YearProvider = ({ children }) => {
    const currentYear = new Date().getFullYear();
    const [selectedYear, setSelectedYear] = useState(currentYear.toString());

    return (
        <YearContext.Provider value={{ selectedYear, setSelectedYear }}>
            {children}
        </YearContext.Provider>
    );
};

export const useYear = () => {
    const context = useContext(YearContext);
    if (!context) {
        throw new Error('useYear must be used within a YearProvider');
    }
    return context;
};

export default YearContext;

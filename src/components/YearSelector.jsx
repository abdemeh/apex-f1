import { useYear } from '../context/YearContext';
import { getAvailableSeasons } from '../services/f1Api';
import { useState } from 'react';

const YearSelector = () => {
    const { selectedYear, setSelectedYear } = useYear();
    const [isOpen, setIsOpen] = useState(false);
    const seasons = getAvailableSeasons();

    const handleYearChange = (year) => {
        setSelectedYear(year);
        setIsOpen(false);
    };

    return (
        <div className="year-selector">
            <button
                className="year-button"
                onClick={() => setIsOpen(!isOpen)}
            >
                <span className="year-text">{selectedYear}</span>
                <span className="year-arrow">{isOpen ? '▲' : '▼'}</span>
            </button>

            {isOpen && (
                <div className="year-dropdown">
                    <div className="year-dropdown-header">Select Season</div>
                    <div className="year-dropdown-list">
                        {seasons.map((year) => (
                            <div
                                key={year}
                                className={`year-option ${year === selectedYear ? 'active' : ''}`}
                                onClick={() => handleYearChange(year)}
                            >
                                {year}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default YearSelector;

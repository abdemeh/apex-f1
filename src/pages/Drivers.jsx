import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';
import { getDriverStandings } from '../services/f1Api';
import DriverCard from '../components/DriverCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Drivers = () => {
    const { t } = useTranslation();
    const { selectedYear } = useYear();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDrivers = async () => {
            try {
                setLoading(true);
                const data = await getDriverStandings(selectedYear);
                setStandings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDrivers();
    }, [selectedYear]);

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <p className="text-red" style={{ fontSize: '1.2rem' }}>
                            {t('common.error')}
                        </p>
                        <button className="btn" onClick={() => window.location.reload()}>
                            {t('common.retry')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">{t('drivers.title')} {selectedYear}</h1>
                    <p className="page-subtitle">{t('drivers.subtitle')}</p>
                </div>

                <div className="grid grid-3">
                    {standings.map((standing, index) => (
                        <div
                            key={standing.Driver.driverId}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <DriverCard
                                driver={standing.Driver}
                                standings={standing}
                            />
                        </div>
                    ))}
                </div>

                {standings.length === 0 && (
                    <div className="loading-container">
                        <p className="text-muted">{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Drivers;

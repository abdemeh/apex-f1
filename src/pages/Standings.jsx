import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';
import { getDriverStandings, getConstructorStandings } from '../services/f1Api';
import LoadingSpinner from '../components/LoadingSpinner';

const Standings = () => {
    const { t } = useTranslation();
    const { selectedYear } = useYear();
    const [activeTab, setActiveTab] = useState('drivers');
    const [driverStandings, setDriverStandings] = useState([]);
    const [constructorStandings, setConstructorStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchStandings = async () => {
            try {
                setLoading(true);
                const [drivers, constructors] = await Promise.all([
                    getDriverStandings(selectedYear),
                    getConstructorStandings(selectedYear)
                ]);
                setDriverStandings(drivers);
                setConstructorStandings(constructors);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchStandings();
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
                    <h1 className="page-title">{t('standings.title')} {selectedYear}</h1>
                    <p className="page-subtitle">{t('standings.subtitle')}</p>
                </div>

                {/* Tabs */}
                <div className="tabs">
                    <button
                        className={`tab ${activeTab === 'drivers' ? 'active' : ''}`}
                        onClick={() => setActiveTab('drivers')}
                    >
                        {t('standings.driverStandings')}
                    </button>
                    <button
                        className={`tab ${activeTab === 'constructors' ? 'active' : ''}`}
                        onClick={() => setActiveTab('constructors')}
                    >
                        {t('standings.constructorStandings')}
                    </button>
                </div>

                {/* Driver Standings Table */}
                {activeTab === 'drivers' && (
                    <div className="table-container fade-in">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('standings.position')}</th>
                                    <th>{t('standings.driver')}</th>
                                    <th>{t('standings.constructor')}</th>
                                    <th>{t('standings.points')}</th>
                                    <th>{t('standings.wins')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {driverStandings.map((standing) => (
                                    <tr key={standing.Driver.driverId}>
                                        <td>
                                            <div className={`position-badge ${standing.position === '1' ? 'p1' :
                                                standing.position === '2' ? 'p2' :
                                                    standing.position === '3' ? 'p3' : ''
                                                }`}>
                                                {standing.position}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '700' }}>
                                            {standing.Driver.givenName} {standing.Driver.familyName}
                                        </td>
                                        <td style={{ color: 'var(--text-secondary)' }}>
                                            {standing.Constructors[0]?.name || 'N/A'}
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: '900',
                                                fontSize: '1.1rem',
                                                color: 'var(--f1-red)'
                                            }}>
                                                {standing.points}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '700' }}>
                                            {standing.wins}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Constructor Standings Table */}
                {activeTab === 'constructors' && (
                    <div className="table-container fade-in">
                        <table>
                            <thead>
                                <tr>
                                    <th>{t('standings.position')}</th>
                                    <th>{t('standings.constructor')}</th>
                                    <th>{t('standings.points')}</th>
                                    <th>{t('standings.wins')}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {constructorStandings.map((standing) => (
                                    <tr key={standing.Constructor.constructorId}>
                                        <td>
                                            <div className={`position-badge ${standing.position === '1' ? 'p1' :
                                                standing.position === '2' ? 'p2' :
                                                    standing.position === '3' ? 'p3' : ''
                                                }`}>
                                                {standing.position}
                                            </div>
                                        </td>
                                        <td style={{ fontWeight: '700' }}>
                                            {standing.Constructor.name}
                                        </td>
                                        <td>
                                            <span style={{
                                                fontWeight: '900',
                                                fontSize: '1.1rem',
                                                color: 'var(--f1-red)'
                                            }}>
                                                {standing.points}
                                            </span>
                                        </td>
                                        <td style={{ fontWeight: '700' }}>
                                            {standing.wins}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Standings;

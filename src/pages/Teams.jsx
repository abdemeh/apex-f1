import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';
import { getConstructorStandings } from '../services/f1Api';
import TeamCard from '../components/TeamCard';
import LoadingSpinner from '../components/LoadingSpinner';

const Teams = () => {
    const { t } = useTranslation();
    const { selectedYear } = useYear();
    const [standings, setStandings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeams = async () => {
            try {
                setLoading(true);
                const data = await getConstructorStandings(selectedYear);
                setStandings(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeams();
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
                    <h1 className="page-title">{t('teams.title')} {selectedYear}</h1>
                    <p className="page-subtitle">{t('teams.subtitle')}</p>
                </div>

                <div className="grid grid-3">
                    {standings.map((standing, index) => (
                        <div
                            key={standing.Constructor.constructorId}
                            style={{ animationDelay: `${index * 0.05}s` }}
                        >
                            <TeamCard
                                constructor={standing.Constructor}
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

export default Teams;

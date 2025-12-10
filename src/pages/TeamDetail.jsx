import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';
import { getConstructorDetails } from '../services/f1Api';
import LoadingSpinner from '../components/LoadingSpinner';

const TeamDetail = () => {
    const { teamId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { selectedYear } = useYear();
    const [teamData, setTeamData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchTeamDetails = async () => {
            try {
                setLoading(true);
                const data = await getConstructorDetails(teamId, selectedYear);
                setTeamData(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchTeamDetails();
    }, [teamId, selectedYear]);

    if (loading) return <LoadingSpinner />;

    if (error || !teamData) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <p className="text-red" style={{ fontSize: '1.2rem' }}>
                            {t('common.error')}
                        </p>
                        <button className="btn" onClick={() => navigate('/teams')}>
                            {t('common.back')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { constructor, standings, drivers } = teamData;

    // Team colors
    const teamColors = {
        'red_bull': '#0600EF',
        'ferrari': '#DC0000',
        'mercedes': '#00D2BE',
        'mclaren': '#FF8700',
        'aston_martin': '#006F62',
        'alpine': '#0090FF',
        'williams': '#005AFF',
        'rb': '#2B4562',
        'kick': '#00E701',
        'haas': '#FFFFFF'
    };

    const teamColor = teamColors[constructor.constructorId] || 'var(--f1-red)';

    return (
        <div className="page">
            <div className="container">
                <button
                    className="btn btn-outline mb-4"
                    onClick={() => navigate('/teams')}
                    style={{ marginBottom: '2rem' }}
                >
                    ← {t('common.back')}
                </button>

                <div className="fade-in">
                    {/* Header */}
                    <div style={{
                        background: 'var(--bg-card)',
                        padding: '3rem 2rem',
                        borderRadius: '12px',
                        border: '1px solid var(--border-color)',
                        marginBottom: '2rem',
                        position: 'relative',
                        overflow: 'hidden'
                    }}>
                        <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '5px',
                            background: teamColor,
                            boxShadow: `0 0 20px ${teamColor}`
                        }} />

                        <div style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'flex-start',
                            flexWrap: 'wrap',
                            gap: '2rem'
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: '3rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    <span style={{ color: teamColor }}>
                                        {constructor.name}
                                    </span>
                                </h1>
                                <p style={{
                                    fontSize: '1.5rem',
                                    color: 'var(--text-secondary)',
                                    marginBottom: '1rem'
                                }}>
                                    {constructor.nationality}
                                </p>
                            </div>

                            {standings && (
                                <div className={`position-badge ${standings.position === '1' ? 'p1' :
                                    standings.position === '2' ? 'p2' :
                                        standings.position === '3' ? 'p3' : ''
                                    }`} style={{
                                        width: '80px',
                                        height: '80px',
                                        fontSize: '2rem'
                                    }}>
                                    {standings.position}
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Stats and Drivers Grid */}
                    <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
                        {/* Team Stats */}
                        {standings && (
                            <div style={{
                                background: 'var(--bg-card)',
                                padding: '2rem',
                                borderRadius: '12px',
                                border: '1px solid var(--border-color)'
                            }}>
                                <h3 style={{
                                    fontSize: '1.5rem',
                                    marginBottom: '1.5rem',
                                    color: teamColor
                                }}>
                                    {selectedYear} Season Stats
                                </h3>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('teams.points')}</span>
                                        <span style={{
                                            fontWeight: '900',
                                            fontSize: '1.5rem',
                                            color: teamColor
                                        }}>
                                            {standings.points}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('teams.wins')}</span>
                                        <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                            {standings.wins}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0'
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('standings.position')}</span>
                                        <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                            P{standings.position}
                                        </span>
                                    </div>
                                </div>

                                {constructor.url && (
                                    <a
                                        href={constructor.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn"
                                        style={{ marginTop: '1.5rem', width: '100%' }}
                                    >
                                        Wikipedia →
                                    </a>
                                )}
                            </div>
                        )}

                        {/* Team Drivers */}
                        <div style={{
                            background: 'var(--bg-card)',
                            padding: '2rem',
                            borderRadius: '12px',
                            border: '1px solid var(--border-color)'
                        }}>
                            <h3 style={{
                                fontSize: '1.5rem',
                                marginBottom: '1.5rem',
                                color: teamColor
                            }}>
                                {t('teams.drivers')}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {drivers && drivers.length > 0 ? (
                                    drivers.map((driver) => (
                                        <div
                                            key={driver.driverId}
                                            onClick={() => navigate(`/drivers/${driver.driverId}`)}
                                            style={{
                                                padding: '1rem',
                                                background: 'var(--bg-dark)',
                                                borderRadius: '8px',
                                                border: `1px solid ${teamColor}`,
                                                cursor: 'pointer',
                                                transition: 'all 0.3s ease'
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = 'var(--bg-card-hover)';
                                                e.currentTarget.style.boxShadow = `0 0 15px ${teamColor}`;
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = 'var(--bg-dark)';
                                                e.currentTarget.style.boxShadow = 'none';
                                            }}
                                        >
                                            <div style={{ fontWeight: '700', fontSize: '1.1rem', marginBottom: '0.25rem' }}>
                                                {driver.givenName} {driver.familyName}
                                            </div>
                                            <div style={{
                                                color: 'var(--text-secondary)',
                                                fontSize: '0.9rem',
                                                display: 'flex',
                                                justifyContent: 'space-between'
                                            }}>
                                                <span>#{driver.permanentNumber || 'N/A'}</span>
                                                <span>{driver.code || 'N/A'}</span>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <p style={{ color: 'var(--text-muted)' }}>{t('common.noData')}</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TeamDetail;

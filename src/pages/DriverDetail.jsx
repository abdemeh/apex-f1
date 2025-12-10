import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';
import { getDriverDetails, getDriverImageFromOpenF1 } from '../services/f1Api';
import LoadingSpinner from '../components/LoadingSpinner';

const DriverDetail = () => {
    const { driverId } = useParams();
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { selectedYear } = useYear();
    const [driverData, setDriverData] = useState(null);
    const [driverImageUrl, setDriverImageUrl] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchDriverDetails = async () => {
            try {
                setLoading(true);
                const data = await getDriverDetails(driverId, selectedYear);
                setDriverData(data);

                // Load driver image
                if (data?.driver) {
                    const imageUrl = await getDriverImageFromOpenF1(data.driver.code, data.driver.permanentNumber);
                    setDriverImageUrl(imageUrl);
                }
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchDriverDetails();
    }, [driverId, selectedYear]);

    if (loading) return <LoadingSpinner />;

    if (error || !driverData) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <p className="text-red" style={{ fontSize: '1.2rem' }}>
                            {t('common.error')}
                        </p>
                        <button className="btn" onClick={() => navigate('/drivers')}>
                            {t('common.back')}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    const { driver, standings } = driverData;

    // Get team color
    const getTeamColor = (teamName) => {
        const teamColors = {
            'Red Bull': '#0600EF',
            'Ferrari': '#DC0000',
            'Mercedes': '#00D2BE',
            'McLaren': '#FF8700',
            'Aston Martin': '#006F62',
            'Alpine': '#0090FF',
            'Williams': '#005AFF',
            'RB': '#2B4562',
            'Kick Sauber': '#00E701',
            'Haas': '#FFFFFF'
        };

        for (const [key, color] of Object.entries(teamColors)) {
            if (teamName?.includes(key)) return color;
        }
        return '#E10600';
    };

    const teamColor = standings ? getTeamColor(standings.Constructors[0]?.name) : '#E10600';

    // Get country code from nationality for flag SVG
    const getCountryCode = (nationality) => {
        const countryCodes = {
            'British': 'gb', 'Dutch': 'nl', 'Spanish': 'es', 'Monegasque': 'mc',
            'Mexican': 'mx', 'Australian': 'au', 'Canadian': 'ca', 'German': 'de',
            'French': 'fr', 'Japanese': 'jp', 'Danish': 'dk', 'Thai': 'th',
            'Chinese': 'cn', 'Finnish': 'fi', 'American': 'us', 'New Zealander': 'nz',
            'Italian': 'it', 'Brazilian': 'br', 'Argentine': 'ar', 'Austrian': 'at',
            'Belgian': 'be', 'Swiss': 'ch', 'Swedish': 'se', 'Polish': 'pl',
            'Russian': 'ru', 'Indian': 'in', 'Venezuelan': 've', 'Colombian': 'co'
        };
        return countryCodes[nationality] || 'xx';
    };

    const countryCode = getCountryCode(driver.nationality);

    return (
        <div className="page">
            <div className="container">
                <button
                    className="btn btn-outline mb-4"
                    onClick={() => navigate('/drivers')}
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

                        {/* Driver image on right */}
                        <div style={{
                            position: 'absolute',
                            right: '0',
                            bottom: 0,
                            width: '300px',
                            height: '100%',
                            zIndex: 2,
                            display: 'flex',
                            alignItems: 'flex-end'
                        }}>
                            <img
                                src={driverImageUrl}
                                alt={`${driver.givenName} ${driver.familyName}`}
                                style={{
                                    width: '100%',
                                    height: 'auto',
                                    maxHeight: '100%',
                                    objectFit: 'contain',
                                    objectPosition: 'bottom',
                                    filter: 'drop-shadow(0 10px 40px rgba(0, 0, 0, 0.5))'
                                }}
                                onError={(e) => {
                                    e.target.src = `https://via.placeholder.com/200x200/1A1A1A/E10600?text=${driver.code || 'F1'}`;
                                }}
                            />
                        </div>

                        {/* Large driver number behind image */}
                        <div style={{
                            position: 'absolute',
                            right: '2rem',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            fontSize: '15rem',
                            fontWeight: '900',
                            color: 'transparent',
                            WebkitTextStroke: `4px ${teamColor}`,
                            lineHeight: 1,
                            opacity: 0.2,
                            zIndex: 1
                        }}>
                            {driver.permanentNumber || '0'}
                        </div>

                        <div style={{
                            display: 'flex',
                            flexDirection: 'column',
                            justifyContent: 'center',
                            position: 'relative',
                            zIndex: 3
                        }}>
                            <div>
                                <h1 style={{
                                    fontSize: '3rem',
                                    marginBottom: '0.5rem'
                                }}>
                                    {driver.givenName} <span style={{ color: teamColor }}>{driver.familyName}</span>
                                </h1>
                                {standings && (
                                    <div style={{
                                        fontSize: '1.5rem',
                                        color: 'var(--text-secondary)',
                                        marginBottom: '1rem',
                                        fontWeight: '600'
                                    }}>
                                        {t(`details.${standings.position === '1' ? '1st' :
                                            standings.position === '2' ? '2nd' :
                                                standings.position === '3' ? '3rd' :
                                                    standings.position + 'th'}`)} {t('details.inChampionship')}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Stats Grid */}
                    <div className="grid grid-2" style={{ marginBottom: '2rem' }}>
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
                                {t('details.driverInformation')}
                            </h3>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid var(--border-color)',
                                    alignItems: 'center'
                                }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{t('drivers.nationality')}</span>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                        <img
                                            src={`https://flagcdn.com/w40/${countryCode}.png`}
                                            srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
                                            alt={driver.nationality}
                                            style={{
                                                width: '24px',
                                                height: '18px',
                                                objectFit: 'cover',
                                                borderRadius: '2px'
                                            }}
                                        />
                                        <span style={{ fontWeight: '700' }}>{driver.nationality}</span>
                                    </div>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{t('details.dateOfBirth')}</span>
                                    <span style={{ fontWeight: '700' }}>{driver.dateOfBirth || 'N/A'}</span>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    padding: '0.75rem 0',
                                    borderBottom: '1px solid var(--border-color)'
                                }}>
                                    <span style={{ color: 'var(--text-muted)' }}>{t('details.code')}</span>
                                    <span style={{ fontWeight: '700' }}>{driver.code || 'N/A'}</span>
                                </div>

                                {driver.url && (
                                    <a
                                        href={driver.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="btn"
                                        style={{ marginTop: '1rem' }}
                                    >
                                        {t('details.wikipedia')} →
                                    </a>
                                )}
                            </div>
                        </div>

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
                                    color: 'var(--f1-red)'
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
                                        <span style={{ color: 'var(--text-muted)' }}>{t('drivers.team')}</span>
                                        <span style={{ fontWeight: '700' }}>
                                            {standings.Constructors[0]?.name || 'N/A'}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0',
                                        borderBottom: '1px solid var(--border-color)'
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('drivers.points')}</span>
                                        <span style={{
                                            fontWeight: '900',
                                            fontSize: '1.5rem',
                                            color: 'var(--f1-red)'
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
                                        <span style={{ color: 'var(--text-muted)' }}>{t('drivers.wins')}</span>
                                        <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                            {standings.wins}
                                        </span>
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        padding: '0.75rem 0'
                                    }}>
                                        <span style={{ color: 'var(--text-muted)' }}>{t('drivers.position')}</span>
                                        <span style={{ fontWeight: '700', fontSize: '1.2rem' }}>
                                            P{standings.position}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverDetail;

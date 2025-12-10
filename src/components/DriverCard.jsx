import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useState, useEffect } from 'react';
import { getDriverImageFromOpenF1 } from '../services/f1Api';

const DriverCard = ({ driver, standings }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const [driverImageUrl, setDriverImageUrl] = useState(`https://via.placeholder.com/200x200/1A1A1A/E10600?text=${driver.code || 'F1'}`);

    useEffect(() => {
        const loadDriverImage = async () => {
            const imageUrl = await getDriverImageFromOpenF1(driver.code, driver.permanentNumber);
            setDriverImageUrl(imageUrl);
        };
        loadDriverImage();
    }, [driver.code, driver.permanentNumber]);

    const handleClick = () => {
        navigate(`/drivers/${driver.driverId}`);
    };

    // Get country code from nationality for flag SVG
    const getCountryCode = (nationality) => {
        const countryCodes = {
            'British': 'gb', 'Dutch': 'nl', 'Spanish': 'es', 'Monegasque': 'mc',
            'Mexican': 'mx', 'Australian': 'au', 'Canadian': 'ca', 'German': 'de',
            'French': 'fr', 'Japanese': 'jp', 'Danish': 'dk', 'Thai': 'th',
            'Chinese': 'cn', 'Finnish': 'fi', 'American': 'us', 'New Zealander': 'nz',
            'Italian': 'it', 'Brazilian': 'br', 'Argentine': 'ar', 'Austrian': 'at',
            'Belgian': 'be', 'Swiss': 'ch', 'Swedish': 'se', 'Polish': 'pl',
            'Russian': 'ru', 'Indian': 'in', 'Venezuelan': 've', 'Colombian': 'co',
            'South African': 'za', 'Malaysian': 'my', 'Indonesian': 'id',
            'Portuguese': 'pt', 'Irish': 'ie', 'Czech': 'cz', 'Hungarian': 'hu'
        };
        return countryCodes[nationality] || 'xx';
    };

    const countryCode = getCountryCode(driver.nationality);

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

        const teamName2 = standings?.Constructors[0]?.name || '';
        for (const [key, color] of Object.entries(teamColors)) {
            if (teamName2.includes(key)) return color;
        }
        return '#E10600';
    };

    const teamColor = standings ? getTeamColor(standings.Constructors[0]?.name) : '#E10600';

    return (
        <div
            className="card fade-in"
            onClick={handleClick}
            style={{
                padding: '0',
                position: 'relative',
                overflow: 'hidden',
                minHeight: '280px',
                background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
                border: '1px solid rgba(255, 255, 255, 0.1)',
                display: 'flex',
                flexDirection: 'column',
                transition: 'all 0.3s ease'
            }}
            onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-5px)';
                e.currentTarget.style.boxShadow = `0 10px 30px ${teamColor}40`;
            }}
            onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '';
            }}
        >
            {/* Team color accent bar */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '4px',
                background: teamColor,
                boxShadow: `0 0 20px ${teamColor}`
            }} />

            {/* Position badge - top left */}
            {standings && (
                <div style={{
                    position: 'absolute',
                    top: '1rem',
                    left: '1rem',
                    zIndex: 10
                }}>
                    <div className={`position-badge ${standings.position === '1' ? 'p1' :
                        standings.position === '2' ? 'p2' :
                            standings.position === '3' ? 'p3' : ''
                        }`} style={{
                            width: '40px',
                            height: '40px',
                            fontSize: '1.2rem',
                            fontWeight: '900'
                        }}>
                        {standings.position}
                    </div>
                </div>
            )}

            {/* Main content area with driver number and image */}
            <div style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'flex-end',
                justifyContent: 'center',
                padding: '3rem 1rem 0 1rem',
                overflow: 'hidden'
            }}>
                {/* Large driver number (outlined) */}
                <div style={{
                    position: 'absolute',
                    fontSize: '10rem',
                    fontWeight: '900',
                    color: 'transparent',
                    WebkitTextStroke: `2px ${teamColor}`,
                    opacity: 0.3,
                    lineHeight: 1,
                    userSelect: 'none',
                    zIndex: 1,
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)'
                }}>
                    {driver.permanentNumber || '0'}
                </div>

                {/* Driver image */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    height: '200px',
                    display: 'flex',
                    alignItems: 'flex-end',
                    justifyContent: 'center'
                }}>
                    <img
                        src={driverImageUrl}
                        alt={`${driver.givenName} ${driver.familyName}`}
                        style={{
                            maxWidth: '100%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 10px 20px rgba(0, 0, 0, 0.5))',
                            objectPosition: 'bottom'
                        }}
                        onError={(e) => {
                            // Fallback to placeholder if image fails to load
                            e.target.src = `https://via.placeholder.com/200x200/1A1A1A/E10600?text=${driver.code || driver.familyName.substring(0, 3).toUpperCase()}`;
                        }}
                    />
                </div>
            </div>

            {/* Bottom info section */}
            <div style={{
                padding: '1rem',
                background: 'rgba(0, 0, 0, 0.3)',
                borderTop: '1px solid rgba(255, 255, 255, 0.1)'
            }}>
                {/* Driver name */}
                <h3 style={{
                    fontSize: '1.1rem',
                    marginBottom: '0.5rem',
                    color: 'var(--text-primary)',
                    fontWeight: '700',
                    lineHeight: '1.2'
                }}>
                    {driver.givenName}<br />
                    <span style={{ color: teamColor, fontSize: '1.3rem' }}>{driver.familyName}</span>
                </h3>

                {/* Info row */}
                <div style={{
                    display: 'flex',
                    gap: '0.5rem',
                    alignItems: 'center',
                    flexWrap: 'wrap',
                    fontSize: '0.75rem'
                }}>
                    {standings && (
                        <div style={{
                            padding: '0.3rem 0.6rem',
                            background: teamColor,
                            borderRadius: '12px',
                            fontWeight: '700',
                            color: '#000',
                            whiteSpace: 'nowrap'
                        }}>
                            {standings.points} PTS
                        </div>
                    )}
                    {standings && (
                        <div style={{
                            padding: '0.3rem 0.6rem',
                            background: 'rgba(255, 255, 255, 0.1)',
                            borderRadius: '12px',
                            fontWeight: '600',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            maxWidth: '100px'
                        }}>
                            {standings.Constructors[0]?.name || 'N/A'}
                        </div>
                    )}
                    <div style={{
                        width: '28px',
                        height: '20px',
                        background: 'rgba(255, 255, 255, 0.1)',
                        borderRadius: '4px',
                        overflow: 'hidden',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <img
                            src={`https://flagcdn.com/w40/${countryCode}.png`}
                            srcSet={`https://flagcdn.com/w80/${countryCode}.png 2x`}
                            alt={driver.nationality}
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover'
                            }}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default DriverCard;

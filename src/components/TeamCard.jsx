import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { getTeamLogoUrl } from '../services/f1Api';

const TeamCard = ({ constructor, standings }) => {
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleClick = () => {
        navigate(`/teams/${constructor.constructorId}`);
    };

    // Team colors mapping (based on 2024 teams)
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
    const teamLogoUrl = getTeamLogoUrl(constructor.constructorId);

    // Get country code from nationality for flag SVG
    const getCountryCode = (nationality) => {
        const countryCodes = {
            'British': 'gb',
            'Austrian': 'at',
            'Italian': 'it',
            'German': 'de',
            'French': 'fr',
            'Swiss': 'ch',
            'American': 'us',
            'Indian': 'in',
            'Japanese': 'jp',
            'Malaysian': 'my',
            'Spanish': 'es',
            'Dutch': 'nl',
            'Swedish': 'se',
            'Irish': 'ie',
            'Australian': 'au',
            'New Zealand': 'nz',
            'South African': 'za'
        };
        return countryCodes[nationality] || 'xx';
    };

    const countryCode = getCountryCode(constructor.nationality);

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

            {/* Main content area with team logo */}
            <div style={{
                position: 'relative',
                flex: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1rem 1rem 1rem'
            }}>
                {/* Large team logo as background */}
                <div style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    opacity: 0.15,
                    zIndex: 1
                }}>
                    <img
                        src={teamLogoUrl}
                        alt={constructor.name}
                        style={{
                            maxWidth: '80%',
                            maxHeight: '80%',
                            objectFit: 'contain',
                            filter: `drop-shadow(0 0 40px ${teamColor})`
                        }}
                        onError={(e) => {
                            e.target.style.display = 'none';
                        }}
                    />
                </div>

                {/* Team logo in center */}
                <div style={{
                    position: 'relative',
                    zIndex: 2,
                    width: '100%',
                    height: '180px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={teamLogoUrl}
                        alt={constructor.name}
                        style={{
                            maxWidth: '70%',
                            maxHeight: '100%',
                            objectFit: 'contain',
                            filter: `drop-shadow(0 10px 30px ${teamColor})`
                        }}
                        onError={(e) => {
                            e.target.src = `https://via.placeholder.com/200x100/${teamColor.replace('#', '')}/ffffff?text=${constructor.name}`;
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
                {/* Team name */}
                <h3 style={{
                    fontSize: '1.3rem',
                    marginBottom: '0.5rem',
                    color: teamColor,
                    fontWeight: '700',
                    lineHeight: '1.2',
                    textTransform: 'uppercase',
                    letterSpacing: '0.5px'
                }}>
                    {constructor.name}
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
                        <>
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
                            <div style={{
                                padding: '0.3rem 0.6rem',
                                background: 'rgba(255, 255, 255, 0.1)',
                                borderRadius: '12px',
                                fontWeight: '600',
                                whiteSpace: 'nowrap'
                            }}>
                                {standings.wins} Wins
                            </div>
                        </>
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
                            alt={constructor.nationality}
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

export default TeamCard;

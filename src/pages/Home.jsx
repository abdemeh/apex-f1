import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';

const Home = () => {
    const navigate = useNavigate();
    const { t } = useTranslation();
    const { selectedYear } = useYear();

    const cards = [
        {
            title: t('nav.drivers'),
            description: t('home.exploreDrivers'),
            path: '/drivers',
            gradient: 'linear-gradient(135deg, #E10600 0%, #B00500 100%)'
        },
        {
            title: t('nav.teams'),
            description: t('home.exploreTeams'),
            path: '/teams',
            gradient: 'linear-gradient(135deg, #E10600 0%, #B00500 100%)'
        },
        {
            title: t('nav.standings'),
            description: t('home.viewStandings'),
            path: '/standings',
            gradient: 'linear-gradient(135deg, #E10600 0%, #B00500 100%)'
        },
        {
            title: t('nav.circuits'),
            description: t('home.discoverCircuits'),
            path: '/circuits',
            gradient: 'linear-gradient(135deg, #E10600 0%, #B00500 100%)'
        }
    ];

    return (
        <div className="page">
            <div className="container">
                {/* Hero Section */}
                <div className="page-header" style={{ marginBottom: '4rem' }}>
                    <h1 style={{
                        fontSize: '4rem',
                        marginBottom: '1rem',
                        color: 'var(--text-primary)'
                    }}>
                        {t('home.title')}
                    </h1>
                    <p className="page-subtitle" style={{ fontSize: '1.5rem' }}>
                        {t('home.subtitle')}
                    </p>
                    <p style={{
                        color: 'var(--text-muted)',
                        fontSize: '1.1rem',
                        marginTop: '1rem',
                        fontWeight: '400'
                    }}>
                        {t('home.welcome')}
                    </p>
                </div>

                {/* Feature Cards Grid */}
                <div className="grid grid-2" style={{ gap: '2rem' }}>
                    {cards.map((card, index) => (
                        <div
                            key={card.path}
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <div
                                className="card fade-in"
                                onClick={() => navigate(card.path)}
                                style={{
                                    minHeight: '280px',
                                    padding: '0',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    position: 'relative',
                                    overflow: 'hidden',
                                    background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
                                    border: '1px solid rgba(255, 255, 255, 0.1)',
                                    transition: 'all 0.3s ease'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-5px)';
                                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(225, 6, 0, 0.2)';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = 'translateY(0)';
                                    e.currentTarget.style.boxShadow = '';
                                }}
                            >
                                {/* Gradient accent bar */}
                                <div style={{
                                    position: 'absolute',
                                    top: 0,
                                    left: 0,
                                    right: 0,
                                    height: '4px',
                                    background: card.gradient,
                                    boxShadow: `0 0 20px ${card.gradient}`
                                }} />

                                {/* Gradient background overlay */}
                                <div style={{
                                    position: 'absolute',
                                    bottom: 0,
                                    left: 0,
                                    right: 0,
                                    height: '50%',
                                    background: `linear-gradient(to top, ${card.gradient.match(/#[A-F0-9]{6}/i)?.[0]}15, transparent)`,
                                    pointerEvents: 'none'
                                }} />

                                <div style={{
                                    padding: '2rem',
                                    flex: 1,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'space-between',
                                    position: 'relative',
                                    zIndex: 1
                                }}>
                                    <div>
                                        {/* Icon/Number */}
                                        <div style={{
                                            fontSize: '4rem',
                                            fontWeight: '900',
                                            color: 'transparent',
                                            WebkitTextStroke: '2px rgba(255, 255, 255, 0.1)',
                                            marginBottom: '1rem',
                                            lineHeight: 1
                                        }}>
                                            {index + 1}
                                        </div>

                                        <h2 style={{
                                            fontSize: '1.5rem',
                                            marginBottom: '0.75rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '700',
                                            textTransform: 'uppercase',
                                            letterSpacing: '0.5px'
                                        }}>
                                            {card.title}
                                        </h2>

                                        <p style={{
                                            color: 'var(--text-secondary)',
                                            fontSize: '1rem',
                                            lineHeight: '1.6'
                                        }}>
                                            {card.description}
                                        </p>
                                    </div>

                                    {/* Arrow indicator */}
                                    <div style={{
                                        marginTop: '1.5rem',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem',
                                        color: 'var(--f1-red)',
                                        fontWeight: '700',
                                        fontSize: '0.9rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '1px'
                                    }}>
                                        <span>Explore</span>
                                        <span style={{ fontSize: '1.2rem' }}>→</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Stats Section */}
                <div style={{
                    marginTop: '4rem',
                    padding: '3rem 2rem',
                    background: 'var(--bg-card)',
                    borderRadius: '12px',
                    border: '1px solid var(--border-color)',
                    textAlign: 'center'
                }}>
                    <h2 style={{
                        fontSize: '2.5rem',
                        marginBottom: '1rem',
                        color: 'var(--f1-red)'
                    }}>
                        {selectedYear} SEASON
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)',
                        fontSize: '1.2rem',
                        maxWidth: '800px',
                        margin: '0 auto'
                    }}>
                        Experience the thrill of Formula 1 with real-time standings, driver stats, team information, and circuit details. Stay updated with the fastest motorsport on the planet.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Home;

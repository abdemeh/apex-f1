import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useYear } from '../context/YearContext';
import { getCircuits } from '../services/f1Api';
import LoadingSpinner from '../components/LoadingSpinner';

const Circuits = () => {
    const { t } = useTranslation();
    const { selectedYear } = useYear();
    const [circuits, setCircuits] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCircuits = async () => {
            try {
                setLoading(true);
                const data = await getCircuits(selectedYear);
                setCircuits(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchCircuits();
    }, [selectedYear]);

    // Get country code for flag
    const getCountryCode = (country) => {
        const countryCodes = {
            'Australia': 'au', 'Austria': 'at', 'Azerbaijan': 'az', 'Bahrain': 'bh',
            'Belgium': 'be', 'Brazil': 'br', 'Canada': 'ca', 'China': 'cn',
            'France': 'fr', 'Germany': 'de', 'Hungary': 'hu', 'Italy': 'it',
            'Japan': 'jp', 'Mexico': 'mx', 'Monaco': 'mc', 'Netherlands': 'nl',
            'Portugal': 'pt', 'Qatar': 'qa', 'Russia': 'ru', 'Saudi Arabia': 'sa',
            'Singapore': 'sg', 'Spain': 'es', 'UAE': 'ae', 'UK': 'gb',
            'USA': 'us', 'United States': 'us', 'Malaysia': 'my', 'Turkey': 'tr',
            'United Kingdom': 'gb', 'Korea': 'kr', 'India': 'in', 'Abu Dhabi': 'ae'
        };
        return countryCodes[country] || 'xx';
    };

    // Map circuit IDs to GitHub repo circuit names
    const getCircuitMapUrl = (circuitId) => {
        const circuitMap = {
            'albert_park': 'australia',
            'americas': 'americas',
            'bahrain': 'bahrain',
            'BAK': 'azerbaijan',
            'barcelona': 'catalunya',
            'brands_hatch': 'brands-hatch',
            'hungaroring': 'hungaroring',
            'imola': 'imola',
            'indianapolis': 'indianapolis',
            'interlagos': 'interlagos',
            'istanbul': 'istanbul',
            'marina_bay': 'singapore',
            'monaco': 'monaco',
            'monza': 'monza',
            'red_bull_ring': 'red-bull-ring',
            'rodriguez': 'mexico',
            'sepang': 'sepang',
            'shanghai': 'shanghai',
            'silverstone': 'silverstone',
            'spa': 'spa',
            'suzuka': 'suzuka',
            'villeneuve': 'villeneuve',
            'yas_marina': 'yas-marina',
            'zandvoort': 'zandvoort',
            'jeddah': 'jeddah',
            'miami': 'miami',
            'vegas': 'vegas',
            'losail': 'losail'
        };

        const mapName = circuitMap[circuitId] || circuitId;
        return `https://raw.githubusercontent.com/bacinger/f1-circuits/master/circuits/${mapName}.svg`;
    };

    if (loading) return <LoadingSpinner />;

    if (error) {
        return (
            <div className="page">
                <div className="container">
                    <div className="loading-container">
                        <p className="text-red" style={{ fontSize: '1.2rem' }}>
                            {t('common.error')}
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="page">
            <div className="container">
                <div className="page-header">
                    <h1 className="page-title">{t('circuits.title')} {selectedYear}</h1>
                    <p className="page-subtitle">{t('circuits.subtitle')}</p>
                </div>

                <div className="grid grid-3">
                    {circuits.map((circuit, index) => {
                        const countryCode = getCountryCode(circuit.Location.country);
                        const circuitMapUrl = getCircuitMapUrl(circuit.circuitId);

                        return (
                            <div
                                key={circuit.circuitId}
                                style={{ animationDelay: `${index * 0.05}s` }}
                            >
                                <div
                                    className="card fade-in"
                                    style={{
                                        padding: '0',
                                        position: 'relative',
                                        overflow: 'hidden',
                                        minHeight: '280px',
                                        background: 'linear-gradient(135deg, rgba(20, 20, 20, 0.95) 0%, rgba(30, 30, 30, 0.95) 100%)',
                                        border: '1px solid rgba(255, 255, 255, 0.1)',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        transition: 'all 0.3s ease',
                                        cursor: circuit.url ? 'pointer' : 'default'
                                    }}
                                    onClick={() => circuit.url && window.open(circuit.url, '_blank')}
                                    onMouseEnter={(e) => {
                                        if (circuit.url) {
                                            e.currentTarget.style.transform = 'translateY(-5px)';
                                            e.currentTarget.style.boxShadow = '0 10px 30px rgba(225, 6, 0, 0.2)';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.transform = 'translateY(0)';
                                        e.currentTarget.style.boxShadow = '';
                                    }}
                                >
                                    {/* F1 Red accent bar */}
                                    <div style={{
                                        position: 'absolute',
                                        top: 0,
                                        left: 0,
                                        right: 0,
                                        height: '4px',
                                        background: 'linear-gradient(135deg, #E10600 0%, #B00500 100%)',
                                        boxShadow: '0 0 20px #E10600'
                                    }} />

                                    {/* Main content area with circuit map */}
                                    <div style={{
                                        position: 'relative',
                                        flex: 1,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        padding: '3rem 1rem 1rem 1rem'
                                    }}>
                                        {/* Circuit map SVG */}
                                        <div style={{
                                            position: 'relative',
                                            zIndex: 2,
                                            width: '100%',
                                            height: '140px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img
                                                src={circuitMapUrl}
                                                alt={circuit.circuitName}
                                                style={{
                                                    maxWidth: '90%',
                                                    maxHeight: '100%',
                                                    objectFit: 'contain',
                                                    filter: 'brightness(0) saturate(100%) invert(12%) sepia(97%) saturate(7471%) hue-rotate(359deg) brightness(95%) contrast(118%) drop-shadow(0 0 10px #E10600) drop-shadow(0 0 20px #E10600)',
                                                    opacity: 0.9
                                                }}
                                                onError={(e) => {
                                                    // Fallback to a simple path icon if SVG fails to load
                                                    e.target.style.display = 'none';
                                                    e.target.parentElement.innerHTML = `
                                                        <svg width="120" height="120" viewBox="0 0 100 100" style="filter: drop-shadow(0 0 10px #E10600)">
                                                            <path d="M 20 50 Q 30 20, 50 30 T 80 50 Q 70 80, 50 70 T 20 50" 
                                                                  stroke="#E10600" 
                                                                  stroke-width="3" 
                                                                  fill="none" 
                                                                  stroke-linecap="round"/>
                                                        </svg>
                                                    `;
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
                                        {/* Circuit name */}
                                        <h3 style={{
                                            fontSize: '1.1rem',
                                            marginBottom: '0.5rem',
                                            color: 'var(--text-primary)',
                                            fontWeight: '700',
                                            lineHeight: '1.2',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis',
                                            display: '-webkit-box',
                                            WebkitLineClamp: 2,
                                            WebkitBoxOrient: 'vertical'
                                        }}>
                                            {circuit.circuitName}
                                        </h3>

                                        {/* Info row */}
                                        <div style={{
                                            display: 'flex',
                                            gap: '0.5rem',
                                            alignItems: 'center',
                                            flexWrap: 'wrap',
                                            fontSize: '0.75rem'
                                        }}>
                                            <div style={{
                                                padding: '0.3rem 0.6rem',
                                                background: 'rgba(225, 6, 0, 0.2)',
                                                borderRadius: '12px',
                                                fontWeight: '600',
                                                whiteSpace: 'nowrap',
                                                overflow: 'hidden',
                                                textOverflow: 'ellipsis',
                                                maxWidth: '120px',
                                                border: '1px solid rgba(225, 6, 0, 0.3)'
                                            }}>
                                                {circuit.Location.locality}
                                            </div>
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
                                                    alt={circuit.Location.country}
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
                            </div>
                        );
                    })}
                </div>

                {circuits.length === 0 && (
                    <div className="loading-container">
                        <p className="text-muted">{t('common.noData')}</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Circuits;

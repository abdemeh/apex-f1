import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import YearSelector from './YearSelector';
import f1Logo from '../assets/f1.png';

const Navbar = () => {
    const { t, i18n } = useTranslation();
    const location = useLocation();
    const [menuOpen, setMenuOpen] = useState(false);
    const [langDropdownOpen, setLangDropdownOpen] = useState(false);

    const languages = [
        { code: 'en', name: 'EN', dir: 'ltr' },
        { code: 'fr', name: 'FR', dir: 'ltr' },
        { code: 'ar', name: 'AR', dir: 'rtl' }
    ];

    const currentLang = languages.find(lang => lang.code === i18n.language) || languages[0];

    const changeLanguage = (langCode) => {
        const selectedLang = languages.find(lang => lang.code === langCode);
        i18n.changeLanguage(langCode);
        document.documentElement.setAttribute('dir', selectedLang.dir);
        setLangDropdownOpen(false);
    };

    useEffect(() => {
        document.documentElement.setAttribute('dir', currentLang.dir);
    }, [currentLang]);

    const navLinks = [
        { path: '/', label: t('nav.home') },
        { path: '/drivers', label: t('nav.drivers') },
        { path: '/teams', label: t('nav.teams') },
        { path: '/standings', label: t('nav.standings') },
        { path: '/circuits', label: t('nav.circuits') }
    ];

    return (
        <nav className="navbar">
            <div className="navbar-content">
                <Link to="/" className="navbar-brand">
                    <img src={f1Logo} alt="F1 Logo" className="navbar-logo" />
                    <span className="navbar-title">APEX F1</span>
                </Link>

                <button
                    className="menu-toggle"
                    onClick={() => setMenuOpen(!menuOpen)}
                    aria-label="Toggle menu"
                >
                    ☰
                </button>

                <ul className={`navbar-menu ${menuOpen ? 'active' : ''}`}>
                    {navLinks.map((link) => (
                        <li key={link.path}>
                            <Link
                                to={link.path}
                                className={`navbar-link ${location.pathname === link.path ? 'active' : ''}`}
                                onClick={() => setMenuOpen(false)}
                            >
                                {link.label}
                            </Link>
                        </li>
                    ))}

                    <li style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                        <YearSelector />

                        <div className="language-switcher" style={{ position: 'relative' }}>
                            <button
                                className="language-button"
                                onClick={() => setLangDropdownOpen(!langDropdownOpen)}
                            >
                                {currentLang.name}
                            </button>

                            {langDropdownOpen && (
                                <div className="language-dropdown">
                                    {languages.map((lang) => (
                                        <button
                                            key={lang.code}
                                            onClick={() => changeLanguage(lang.code)}
                                            className={currentLang.code === lang.code ? 'active' : ''}
                                        >
                                            {lang.name}
                                        </button>
                                    ))}
                                </div>
                            )}
                        </div>
                    </li>
                </ul>
            </div>
        </nav>
    );
};

export default Navbar;

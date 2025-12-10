import { useTranslation } from 'react-i18next';

const LoadingSpinner = ({ text }) => {
    const { t } = useTranslation();

    return (
        <div className="loading-container">
            <div className="spinner"></div>
            <p className="loading-text">{text || t('common.loading')}...</p>
        </div>
    );
};

export default LoadingSpinner;

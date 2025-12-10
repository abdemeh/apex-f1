import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const DEFAULT_SEASON = '2024';

const f1Api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Cache for driver images from OpenF1 API
let driverImagesCache = null;
let fetchPromise = null;

// Fetch driver images from OpenF1 API
const fetchDriverImages = async () => {
    // If already cached, return immediately
    if (driverImagesCache) {
        return driverImagesCache;
    }

    // If already fetching, return the same promise
    if (fetchPromise) {
        return fetchPromise;
    }

    fetchPromise = (async () => {
        try {
            const response = await axios.get('https://api.openf1.org/v1/drivers?session_key=latest');
            const drivers = response.data;

            // Create a map of driver codes to headshot URLs
            const imageMap = {};
            drivers.forEach(driver => {
                if (driver.driver_number && driver.headshot_url) {
                    // Remove the .transform/1col/image.png part as per user's instruction
                    const cleanUrl = driver.headshot_url.replace(/\.transform\/.*$/, '');
                    imageMap[driver.name_acronym] = cleanUrl;
                    imageMap[driver.driver_number.toString()] = cleanUrl;
                }
            });

            driverImagesCache = imageMap;
            return imageMap;
        } catch (error) {
            console.error('Error fetching driver images from OpenF1:', error);
            return {};
        } finally {
            fetchPromise = null;
        }
    })();

    return fetchPromise;
};

// Helper function to get driver image URL
export const getDriverImageUrl = (driver) => {
    // Return a placeholder initially - the actual image will be loaded via React component
    return `https://via.placeholder.com/200x200/1A1A1A/E10600?text=${driver.code || driver.familyName.substring(0, 3).toUpperCase()}`;
};

// New function to get driver image from OpenF1 API
export const getDriverImageFromOpenF1 = async (driverCode, driverNumber) => {
    const imageMap = await fetchDriverImages();

    // Try to find by code first, then by number
    const imageUrl = imageMap[driverCode] || imageMap[driverNumber?.toString()];

    if (imageUrl) {
        return imageUrl;
    }

    // For drivers not in OpenF1, use F1's official fallback image
    return 'https://media.formula1.com/d_driver_fallback_image.png/content/dam/fom-website/drivers/';
};

// Helper function to get team logo/car URL
export const getTeamLogoUrl = (constructorId, year = '2024') => {
    // Map constructor IDs to their URL-friendly names
    const teamNames = {
        'red_bull': 'red-bull-racing',
        'ferrari': 'ferrari',
        'mercedes': 'mercedes',
        'mclaren': 'mclaren',
        'aston_martin': 'aston-martin',
        'alpine': 'alpine',
        'williams': 'williams',
        'rb': 'rb',
        'kick': 'kick-sauber',
        'sauber': 'kick-sauber',
        'haas': 'haas-f1-team',
        'alfa': 'alfa-romeo-f1-team-stake',
        'alphatauri': 'alphatauri',
        'toro_rosso': 'scuderia-toro-rosso',
        'racing_point': 'racing-point',
        'renault': 'renault',
        'lotus_f1': 'lotus-f1',
        'force_india': 'force-india'
    };

    const teamName = teamNames[constructorId];

    if (teamName) {
        // Use dynamic year-based URL
        return `https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/${year}/${teamName}.png`;
    }

    // Fallback to generic team car image
    return 'https://media.formula1.com/d_team_car_fallback_image.png/content/dam/fom-website/teams/';
};

// Get available seasons (1950 to current year)
export const getAvailableSeasons = () => {
    const currentYear = new Date().getFullYear();
    const seasons = [];
    for (let year = currentYear; year >= 1950; year--) {
        seasons.push(year.toString());
    }
    return seasons;
};

// Get drivers for a specific season
export const getDrivers = async (year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}/drivers.json`);
        return response.data.MRData.DriverTable.Drivers;
    } catch (error) {
        console.error('Error fetching drivers:', error);
        throw error;
    }
};

// Get driver details and standings
export const getDriverDetails = async (driverId, year = DEFAULT_SEASON) => {
    try {
        const [driverResponse, standingsResponse] = await Promise.all([
            f1Api.get(`/${year}/drivers/${driverId}.json`),
            f1Api.get(`/${year}/drivers/${driverId}/driverStandings.json`)
        ]);

        const driver = driverResponse.data.MRData.DriverTable.Drivers[0];
        const standings = standingsResponse.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings[0];

        return { driver, standings };
    } catch (error) {
        console.error('Error fetching driver details:', error);
        throw error;
    }
};

// Get constructors for a specific season
export const getConstructors = async (year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}/constructors.json`);
        return response.data.MRData.ConstructorTable.Constructors;
    } catch (error) {
        console.error('Error fetching constructors:', error);
        throw error;
    }
};

// Get constructor details and standings
export const getConstructorDetails = async (constructorId, year = DEFAULT_SEASON) => {
    try {
        const [constructorResponse, standingsResponse, driversResponse] = await Promise.all([
            f1Api.get(`/${year}/constructors/${constructorId}.json`),
            f1Api.get(`/${year}/constructors/${constructorId}/constructorStandings.json`),
            f1Api.get(`/${year}/constructors/${constructorId}/drivers.json`)
        ]);

        const constructor = constructorResponse.data.MRData.ConstructorTable.Constructors[0];
        const standings = standingsResponse.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings[0];
        const drivers = driversResponse.data.MRData.DriverTable.Drivers;

        return { constructor, standings, drivers };
    } catch (error) {
        console.error('Error fetching constructor details:', error);
        throw error;
    }
};

// Get driver standings
export const getDriverStandings = async (year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}/driverStandings.json`);
        return response.data.MRData.StandingsTable.StandingsLists[0]?.DriverStandings || [];
    } catch (error) {
        console.error('Error fetching driver standings:', error);
        throw error;
    }
};

// Get constructor standings
export const getConstructorStandings = async (year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}/constructorStandings.json`);
        return response.data.MRData.StandingsTable.StandingsLists[0]?.ConstructorStandings || [];
    } catch (error) {
        console.error('Error fetching constructor standings:', error);
        throw error;
    }
};

// Get all circuits
export const getCircuits = async (year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}/circuits.json`);
        return response.data.MRData.CircuitTable.Circuits;
    } catch (error) {
        console.error('Error fetching circuits:', error);
        throw error;
    }
};

// Get circuit details
export const getCircuitDetails = async (circuitId, year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}/circuits/${circuitId}.json`);
        return response.data.MRData.CircuitTable.Circuits[0];
    } catch (error) {
        console.error('Error fetching circuit details:', error);
        throw error;
    }
};

// Get race schedule
export const getRaceSchedule = async (year = DEFAULT_SEASON) => {
    try {
        const response = await f1Api.get(`/${year}.json`);
        return response.data.MRData.RaceTable.Races;
    } catch (error) {
        console.error('Error fetching race schedule:', error);
        throw error;
    }
};

export default {
    getDrivers,
    getDriverDetails,
    getConstructors,
    getConstructorDetails,
    getDriverStandings,
    getConstructorStandings,
    getCircuits,
    getCircuitDetails,
    getRaceSchedule,
    getAvailableSeasons,
    getDriverImageUrl,
    getTeamLogoUrl,
};

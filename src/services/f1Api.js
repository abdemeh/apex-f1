import axios from 'axios';

const BASE_URL = 'https://api.jolpi.ca/ergast/f1';
const DEFAULT_SEASON = '2024';

const f1Api = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Helper function to get driver image URL
export const getDriverImageUrl = (driver) => {
    // Use Wikipedia/Wikimedia for driver images
    const fullName = `${driver.givenName}_${driver.familyName}`.replace(/ /g, '_');
    // Return a placeholder that can be replaced with actual image logic
    return `https://via.placeholder.com/150x150/1A1A1A/E10600?text=${driver.code || driver.familyName.substring(0, 3).toUpperCase()}`;
};

// Helper function to get team logo URL
export const getTeamLogoUrl = (constructorId) => {
    // Map of team IDs to logo URLs (using placeholder for now)
    const teamLogos = {
        'red_bull': 'https://via.placeholder.com/100x100/0600EF/FFFFFF?text=RB',
        'ferrari': 'https://via.placeholder.com/100x100/DC0000/FFFFFF?text=Ferrari',
        'mercedes': 'https://via.placeholder.com/100x100/00D2BE/000000?text=Merc',
        'mclaren': 'https://via.placeholder.com/100x100/FF8700/FFFFFF?text=McLaren',
        'aston_martin': 'https://via.placeholder.com/100x100/006F62/FFFFFF?text=Aston',
        'alpine': 'https://via.placeholder.com/100x100/0090FF/FFFFFF?text=Alpine',
        'williams': 'https://via.placeholder.com/100x100/005AFF/FFFFFF?text=Williams',
        'rb': 'https://via.placeholder.com/100x100/2B4562/FFFFFF?text=RB',
        'kick': 'https://via.placeholder.com/100x100/00E701/000000?text=Kick',
        'haas': 'https://via.placeholder.com/100x100/FFFFFF/000000?text=Haas'
    };
    return teamLogos[constructorId] || 'https://via.placeholder.com/100x100/E10600/FFFFFF?text=F1';
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

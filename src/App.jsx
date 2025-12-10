import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './i18n';
import { YearProvider } from './context/YearContext';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Drivers from './pages/Drivers';
import DriverDetail from './pages/DriverDetail';
import Teams from './pages/Teams';
import TeamDetail from './pages/TeamDetail';
import Standings from './pages/Standings';
import Circuits from './pages/Circuits';

function App() {
  return (
    <Router>
      <YearProvider>
        <div className="app">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/drivers" element={<Drivers />} />
            <Route path="/drivers/:driverId" element={<DriverDetail />} />
            <Route path="/teams" element={<Teams />} />
            <Route path="/teams/:teamId" element={<TeamDetail />} />
            <Route path="/standings" element={<Standings />} />
            <Route path="/circuits" element={<Circuits />} />
          </Routes>
        </div>
      </YearProvider>
    </Router>
  );
}

export default App;

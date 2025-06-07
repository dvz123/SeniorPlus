import './App.css';
import Header from './components/Header';
import Hero from './components/Hero';
import AgingStats from './components/AgingStats';
import Features from './components/Features';
import TechStack from './components/TechStack';
import Partnerships from './components/Partnerships';
import TargetAudience from './components/TargetAudience';
import Pricing from './components/Pricing';
import CTA from './components/CTA';
import Footer from './components/Footer';

function App() {
  return (
    <div className="App">
        <Header />
        <Hero />
        <TechStack />
        <TargetAudience />
        <Features />
        <Pricing />
        <AgingStats />
        <Partnerships />
        <CTA />
        <Footer />
    </div>
  );
}

export default App;

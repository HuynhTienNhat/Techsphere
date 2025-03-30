import HomeHeader from './Header.jsx';
import './Home.css';
import HomeHero from './Hero.jsx';
import Introduction from './Introduction.jsx';
import SalesBanner from './SaleBanner.jsx';
export default function HomePage() {
    return (
        <>
            <HomeHeader />
            <HomeHero />
            <Introduction />
            <SalesBanner />
        </>
    )
}

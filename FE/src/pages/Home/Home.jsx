import HomeHeader from './Header.jsx';
import './Home.css';
import HomeHero from './Hero.jsx';
import Introduction from './Introduction.jsx';
import SalesBanner from './SaleBanner.jsx';
import HomeProducts from './Products.jsx';
import HomeJudgement from './Judgement.jsx';
import HomeFooter from './Footer.jsx';

export default function HomePage() {
    return (
        <>
            <HomeHeader />
            <HomeHero />
            <Introduction />
            <SalesBanner />
            <HomeProducts />
            <HomeJudgement />
            <HomeFooter />
        </>
    )
}

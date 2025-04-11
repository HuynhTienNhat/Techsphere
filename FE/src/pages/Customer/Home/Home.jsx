import './Home.css';
import HomeHero from './Hero.jsx';
import Introduction from './Introduction.jsx';
import SalesBanner from './SaleBanner.jsx';
import HomeProducts from './Products.jsx';
import HomeJudgement from './Judgement.jsx';

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <Introduction />
            <SalesBanner />
            <HomeProducts />
            <HomeJudgement />
        </>
    )
}

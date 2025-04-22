import './Home.css';
import HomeHero from './Hero.jsx';
import SalesBanner from './SaleBanner.jsx';
import HomeProducts from './Products.jsx';
import HomeJudgement from './Judgement.jsx';

export default function HomePage() {
    return (
        <>
            <HomeHero />
            <SalesBanner />
            <HomeProducts />
            <HomeJudgement />
        </>
    )
}

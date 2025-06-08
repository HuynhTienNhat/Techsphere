import './Home.css';
import HomeHero from './Hero.jsx';
import SalesBanner from './SaleBanner.jsx';
import HomeProducts from './Products.jsx';
import HomeJudgement from './Judgement.jsx';
import NewestProducts from './NewestProducts.jsx';
export default function HomePage() {
    return (
        <>
            <HomeHero />
            <NewestProducts />
            <SalesBanner />
            <HomeProducts />
            <HomeJudgement />
        </>
    )
}

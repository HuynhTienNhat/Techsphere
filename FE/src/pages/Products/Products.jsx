import ProductFiler from './BrandShow.jsx';
import ProductDisplay from './Display.jsx';
import GeneralInformation from './Information.jsx';

export default function Products() {
    function handleSelectedBtn(brand){
        console.log(brand);
    }

    return(
        <>
            <ProductFiler onSelectBrand={handleSelectedBtn}/>
            <ProductDisplay/>
            <GeneralInformation/>
        </>
    )
}
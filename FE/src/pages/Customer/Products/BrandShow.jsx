import React from 'react';
import {fetchBrands} from './../../../services/api';

export default function ProductFilter({ onSelectBrand }) {
    const [selectedBtn, setSelectedBtn] = React.useState("All");
    const [brands, setBrands] = React.useState([]);
    const [isLoading, setIsLoading] = React.useState(false);
  
    React.useEffect(() => {
      const loadBrands = async () => {
        setIsLoading(true);
        try {
            const data = await fetchBrands();
            setBrands(data);
        } catch (error) {
          console.error("Error fetching brands:", error);
          alert("Không thể tải danh sách hãng!");
        } finally {
          setIsLoading(false);
        }
      };
  
      loadBrands();
    }, []);
  
    const handleSelectedBtn = (brand) => {
      setSelectedBtn(brand);
      if (onSelectBrand) {
        onSelectBrand(brand);
      }
    };
  
    const btnElements = brands.map((brand) => (
      <button
        key={brand.id}
        className={`flex gap-2 p-2 border border-gray-300 rounded cursor-pointer items-center ${
          selectedBtn === brand.name ? "border-violet-500" : "bg-white"
        }`}
        onClick={() => handleSelectedBtn(brand.name)}
      >
        <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 object-contain" /> {brand.name}
      </button>
    ));

    return (
        <div className="product-filter mt-10 px-30 flex gap-3">
            <button
                className={`flex p-2 border border-gray-300 rounded cursor-pointer ${
                selectedBtn === "All" ? "border-violet-500" : "bg-white"
                }`}
                onClick={() => handleSelectedBtn("All")}
            >
                All
            </button>
    
          {isLoading ? <span>Đang tải...</span> : btnElements}
        </div>
    )
}
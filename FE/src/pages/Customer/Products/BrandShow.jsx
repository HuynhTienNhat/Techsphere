import React from 'react';
import {fetchBrands} from '../../../services/api';
import { toast } from 'react-toastify';

export default function ProductFilter({ onSelectBrand, keyword, disabled }) {
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
        toast.error("Không thể tải danh sách hãng!");
      } finally {
        setIsLoading(false);
      }
    };

    loadBrands();
  }, []);
  
  // Reset về All khi có keyword
  React.useEffect(() => {
    if (keyword) {
      setSelectedBtn("All");
      if (onSelectBrand) {
        onSelectBrand("All");
      }
    }
  }, [keyword, onSelectBrand]);

  const handleSelectedBtn = (brand) => {
    // Chỉ cho phép thay đổi khi không bị disable
    if (!disabled) {
      setSelectedBtn(brand);
      if (onSelectBrand) {
        onSelectBrand(brand);
      }
    }
  };

  const btnElements = brands.map((brand) => (
    <button
      key={brand.id}
      className={`flex gap-2 p-2 border border-gray-300 rounded items-center ${
        selectedBtn === brand.name ? "border-violet-500" : "bg-white"
      } ${
        disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
      }`}
      onClick={() => handleSelectedBtn(brand.name)}
      disabled={disabled}
    >
      <img src={brand.logoUrl} alt={brand.name} className="w-6 h-6 object-contain" /> {brand.name}
    </button>
  ));

  return (
      <div className="product-filter mt-10 px-30 flex gap-3">
          <button
              className={`flex p-2 border border-gray-300 rounded ${
              selectedBtn === "All" ? "border-violet-500" : "bg-white"
              } ${
                disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer hover:bg-gray-50"
              }`}
              onClick={() => handleSelectedBtn("All")}
              disabled={disabled}
          >
              All
          </button>
  
        {isLoading ? <span>Đang tải...</span> : btnElements}
      </div>
  )
}
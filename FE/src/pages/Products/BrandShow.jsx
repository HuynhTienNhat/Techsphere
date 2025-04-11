import {models} from './../../assets/data/Models.js';
import React from 'react';

export default function ProductFilter({ onSelectBrand }) {
    const [selectedBtn, setSelectedBtn] = React.useState("All")

    const [brands, setBrands] = React.useState([])
    const [isLoading, setIsLoading] = React.useState(false)

    React.useEffect(() => {
        const fetchBrands = async () => {
            try {
                const res = await fetch("http://localhost:8080/api/brands", {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    }
                })

                if(!res.ok){
                    throw new Error("Failed to fetch brands!")
                }

                const data = await res.json()
                setBrands(data)
                setIsLoading(false)
            } catch (error) {
                console.error("Error fetching brands:", error);
                setIsLoading(false);
                alert("Không thể tải danh sách hãng!");
            }
        }

        fetchBrands()
    },[])

    const handleSelectedBtn = async (brand) => {
        setSelectedBtn(brand)
        try {
            const url = brand === "All" ? "http://localhost:8080/api/products" : `http://localhost:8080/api/products/brand/${brand}`
            const res = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                }
            })
            if(!res.ok){
                throw new Error("Failed to fetch products!")
            }
            const products = await res.json()

            if (onSelectBrand) {
                onSelectBrand(brand, products)
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            alert(`Không thể tải sản phẩm cho hãng ${brand}!`);
        }
    }

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
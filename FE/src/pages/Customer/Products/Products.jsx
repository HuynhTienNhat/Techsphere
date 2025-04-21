import React, { useState, useEffect } from "react";
import ProductFilter from "./BrandShow";
import ProductDisplay from "./Display";
import GeneralInformation from "./Information";
import { useLocation } from "react-router-dom";

export default function Products() {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    
    // Lấy cả keyword và brand từ query parameters
    const keyword = searchParams.get("keyword") || "";
    const brandFromUrl = searchParams.get("brand") || "All";
    
    // Sử dụng brand từ URL làm giá trị khởi tạo cho selectedBrand
    const [selectedBrand, setSelectedBrand] = useState(brandFromUrl);
    
    // Cập nhật selectedBrand khi URL thay đổi
    useEffect(() => {
        if (brandFromUrl && !keyword) { // Chỉ áp dụng khi không có keyword
            setSelectedBrand(brandFromUrl);
        }
    }, [brandFromUrl, keyword, location.search]);

    const handleSelectedBtn = (brand) => {
        setSelectedBrand(brand);
    };

    return (
        <div className="products-page">
            <ProductFilter 
                onSelectBrand={handleSelectedBtn} 
                keyword={keyword}
                disabled={!!keyword}
                initialBrand={brandFromUrl} // Truyền brand ban đầu vào filter
            />
            <ProductDisplay selectedBrand={selectedBrand} keyword={keyword} />
            <GeneralInformation />
        </div>
    );
}
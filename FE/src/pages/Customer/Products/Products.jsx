import React, { useState } from "react";
import ProductFilter from "./BrandShow";
import ProductDisplay from "./Display";
import GeneralInformation from "./Information";
import { useLocation } from "react-router-dom";

export default function Products() {
    const [selectedBrand, setSelectedBrand] = useState("All");
    const location = useLocation();

    // Lấy keyword từ query parameter
    const searchParams = new URLSearchParams(location.search);
    const keyword = searchParams.get("keyword") || "";

    const handleSelectedBtn = (brand) => {
        setSelectedBrand(brand);
    };

    return (
        <div className="products-page">
        <ProductFilter onSelectBrand={handleSelectedBtn} />
        <ProductDisplay selectedBrand={selectedBrand} keyword={keyword} />
        <GeneralInformation />
        </div>
    );
}
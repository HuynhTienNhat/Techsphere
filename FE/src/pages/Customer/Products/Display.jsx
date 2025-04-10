import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function ProductDisplay({ selectedBrand, keyword }) {
    const [products, setProducts] = useState([]);
    const [sortOrder, setSortOrder] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchProducts();
    }, [sortOrder, selectedBrand, keyword]);

    const fetchProducts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            let url;
            if (keyword) {
                // Tìm kiếm theo từ khóa
                url = `http://localhost:8080/api/products/search?keyword=${encodeURIComponent(keyword)}`;
            } else {
                // Lọc theo hãng hoặc lấy tất cả
                url = selectedBrand === "All" || !selectedBrand
                ? "http://localhost:8080/api/products"
                : `http://localhost:8080/api/products/brand/${selectedBrand}`;
            }

            if (sortOrder && !keyword) {
                url += `${url.includes("?") ? "&" : "?"}sortBy=${sortOrder}`;
            }

            const response = await fetch(url, {
                method: "GET",
                headers: {
                "Content-Type": "application/json",
                },
            });

            if (!response.ok) {
                throw new Error("Không thể tải danh sách sản phẩm!");
            }

            const data = await response.json();
            setProducts(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    const handleClick = (slug) => {
        navigate(`/products/${slug}`);
    };

    const productElements = products.map((product) => (
        <div
        key={product.productId}
        onClick={() => handleClick(product.slug)}
        className="transition-transform transform hover:-translate-y-2 hover:shadow-lg p-4 flex flex-col justify-between rounded-md shadow-md bg-white border-[0.5px] border-gray-100 cursor-pointer"
        >
        <img
            src={product.mainImageUrl || "https://via.placeholder.com/150"}
            alt={product.name}
            className="w-full h-48 object-contain rounded-md"
            loading="lazy"
        />
        <div className="mt-2 flex flex-col flex-grow">
            <h2 className="text-lg font-semibold truncate">{product.name}</h2>
            <p className="text-sm text-gray-600">{product.model}</p>
            <p className="text-red-500 font-bold mt-1">
            {product.basePrice.toLocaleString("vi-VN")} đ
            </p>
            {product.oldPrice && (
            <p className="text-gray-500 line-through text-sm">
                {product.oldPrice.toLocaleString("vi-VN")} đ
            </p>
            )}
        </div>
        </div>
    ));

    return (
        <div
            className="product-display mt-10 py-5 mx-6 md:mx-10 lg:mx-20 rounded-lg bg-gray-50"
            style={{ boxShadow: "0px 8px 20px rgba(0,0,0,0.1)" }}
            >
            <div className="mb-4 px-6 md:px-10 border-b border-gray-200 pb-4 flex justify-between items-center">
                <h3 className="text-lg font-semibold">
                {keyword ? `Kết quả tìm kiếm cho "${keyword}"` : "Danh sách sản phẩm"}
                </h3>
                <div>
                <label className="mr-2 text-sm font-medium">Sắp xếp theo: </label>
                <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="border p-2 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-violet-500"
                    disabled={keyword} // Vô hiệu hóa sắp xếp khi tìm kiếm
                >
                    <option value="">Mặc định</option>
                    <option value="asc">Giá thấp → cao</option>
                    <option value="desc">Giá cao → thấp</option>
                </select>
                </div>
            </div>

            <div className="px-6 md:px-10">
                {isLoading ? 
                (
                    <div className="text-center py-10">
                        <p className="text-gray-500">Đang tải sản phẩm...</p>
                    </div>
                ) : error ? 
                (
                    <div className="text-center py-10">
                        <p className="text-red-500">{error}</p>
                    </div>
                ) : products.length > 0 ? 
                (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                        {productElements}
                    </div>
                ) : 
                (
                    <div className="text-center py-10">
                        <p className="text-gray-500">
                            {keyword ? "Không tìm thấy sản phẩm nào" : "Hiện chưa có sản phẩm nào"}
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
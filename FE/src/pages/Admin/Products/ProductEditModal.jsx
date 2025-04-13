import React, { useState, useEffect } from "react";
import BasicTab from './ProductTabs/BasicTab.jsx';
import VariantsTab from './ProductTabs/VariantsTab.jsx';
import SpecsTab from './ProductTabs/SpecsTab.jsx';
import ImagesTab from './ProductTabs/ImagesTab.jsx';

export default function ProductEditModal({ product, brands, onSave, onClose }) {
    const [activeTab, setActiveTab] = useState("basic");
    const [formData, setFormData] = useState({
        productId: product.productId,
        name: product.name || "",
        model: product.model || "",
        slug: product.slug || "",
        basePrice: product.basePrice ? Number(product.basePrice) : "", 
        oldPrice: product.oldPrice ? Number(product.oldPrice) : "",
        brandName: product.brandName || "",
        variants: Array.isArray(product.variants) ? product.variants : [],
        specs: [], 
        images: [], 
        reviews: Array.isArray(product.reviews) ? product.reviews : [],
        mainImageUrl: product.mainImageUrl || "",
        isOutOfStock: product.isOutOfStock || false,
    });
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;
        let updatedValue = value;

        if (name === "basePrice" || name === "oldPrice") {
            updatedValue = value === "" ? "" : Number(value);
        }

        setFormData((prevData) => ({ ...prevData, [name]: updatedValue }));
        setErrors({ ...errors, [name]: "" });
    };

    const handleVariantsChange = (variants) => {
        setFormData((prevData) => ({ ...prevData, variants }));
    };

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name) newErrors.name = "Tên sản phẩm không được để trống";
        if (!formData.model) newErrors.model = "Model không được để trống";
        if (!formData.slug) newErrors.slug = "Slug không được để trống";
        else if (!/^[a-z0-9-]+$/.test(formData.slug))
            newErrors.slug = "Slug chỉ chứa chữ thường, số, dấu gạch ngang";
        if (!formData.basePrice || formData.basePrice < 500000)
            newErrors.basePrice = "Giá cơ bản phải từ 500,000 trở lên";
        if (formData.oldPrice && formData.oldPrice < 500000)
            newErrors.oldPrice = "Giá cũ phải từ 500,000 trở lên";
        if (!formData.brandName) newErrors.brandName = "Hãy chọn hãng";
        if (formData.variants.length === 0)
            newErrors.variants = "Cần ít nhất một biến thể";
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSave = async () => {
        if (!validateForm()) return;
        try {
            console.log("Sending data to server:", formData);
            const response = await fetch(
                `http://localhost:8080/api/products/${formData.productId}`, // Sửa id thành productId
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        ...formData,
                        basePrice: formData.basePrice ? Number(formData.basePrice) : null, // Chuyển sang Number
                        oldPrice: formData.oldPrice ? Number(formData.oldPrice) : null,
                    }),
                }
            );

            if (!response.ok) {
                const errorData = await response.json();
                console.error("Error response from server:", errorData);
                throw new Error(errorData.message || "Không thể lưu sản phẩm!");
            }

            const data = await response.json();
            console.log("Product updated successfully:", data);
            alert("Đã lưu sản phẩm thành công!");
            onSave(); // Đóng modal và cập nhật danh sách
        } catch (error) {
            console.error("Error saving product:", error);
            alert(error.message || "Không thể lưu sản phẩm!");
        }
    };

    // Log khi formData thay đổi để debug
    useEffect(() => {
        console.log("Form data updated:", formData);
    }, [formData]);

    return (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-10 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg w-full max-w-2xl p-6">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Edit Product</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 cursor-pointer">
                        ✕
                    </button>
                </div>

                {/* Tabs */}
                <div className="flex border-b mb-4">
                    {["basic", "variants", "specs", "images"].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 capitalize cursor-pointer hover:text-violet-500 ${
                                activeTab === tab
                                    ? "border-b-2 border-violet-500 text-violet-500"
                                    : "text-black"
                            }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Tab Content */}
                {activeTab === "basic" && (
                    <BasicTab
                        formData={formData}
                        brands={brands}
                        errors={errors}
                        onChange={handleChange}
                    />
                )}
                {activeTab === "variants" && (
                    <VariantsTab
                        variants={formData.variants}
                        onChange={handleVariantsChange}
                        errors={errors}
                    />
                )}
                {activeTab === "specs" && <SpecsTab specs={product.specs} />}
                {activeTab === "images" && <ImagesTab images={product.images} />}

                {/* Buttons */}
                {activeTab === "basic" && (
                    <div className="flex justify-end gap-2 mt-4">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100 cursor-pointer"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600 cursor-pointer"
                        >
                            Save
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
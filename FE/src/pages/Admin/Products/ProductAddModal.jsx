import React, { useState } from "react";
import BasicTab from "./ProductTabs/BasicTab";
import VariantsTab from "./ProductTabs/VariantsTab";
import SpecsTab from "./ProductTabs/SpecsTab";
import ImagesTab from "./ProductTabs/ImagesTab";

export default function ProductAddModal({ brands, onSave, onClose }) {
  const [activeTab, setActiveTab] = useState("basic");
  const [formData, setFormData] = useState({
    name: "",
    model: "",
    slug: "",
    basePrice: "",
    oldPrice: "",
    brandName: "",
    variants: [],
    screen: "",
    ram: "",
    frontCamera: "",
    rearCamera: "",
    pin: "",
    imageFiles: [],
    displayOrders: [],
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: "" });
  };

  const handleVariantsChange = (variants) => {
    setFormData({ ...formData, variants });
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newDisplayOrders = files.map((_, index) =>
      formData.imageFiles.length + index
    );
    setFormData({
      ...formData,
      imageFiles: [...formData.imageFiles, ...files],
      displayOrders: [...formData.displayOrders, ...newDisplayOrders],
    });
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
    if (!formData.screen || isNaN(formData.screen) || formData.screen <= 0)
      newErrors.screen = "Màn hình phải là số lớn hơn 0";
    if (!formData.ram || isNaN(formData.ram) || formData.ram <= 0)
      newErrors.ram = "RAM phải là số lớn hơn 0";
    if (!formData.frontCamera || isNaN(formData.frontCamera))
      newErrors.frontCamera = "Camera trước phải là số";
    if (!formData.rearCamera)
      newErrors.rearCamera = "Camera sau không được để trống";
    if (!formData.pin || isNaN(formData.pin) || formData.pin < 1000)
      newErrors.pin = "Pin phải là số từ 1000 trở lên";
    if (formData.imageFiles.length === 0)
      newErrors.imageFiles = "Cần ít nhất một ảnh";
    if (formData.imageFiles.length !== formData.displayOrders.length)
      newErrors.imageFiles = "Số ảnh và display orders phải khớp";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("model", formData.model);
    formDataToSend.append("slug", formData.slug);
    formDataToSend.append("basePrice", formData.basePrice);
    if (formData.oldPrice)
      formDataToSend.append("oldPrice", formData.oldPrice);
    formDataToSend.append("brandName", formData.brandName);
    formDataToSend.append("screen", formData.screen);
    formDataToSend.append("ram", formData.ram);
    formDataToSend.append("frontCamera", formData.frontCamera);
    formDataToSend.append("rearCamera", formData.rearCamera);
    formDataToSend.append("pin", formData.pin);
    formDataToSend.append("variants", JSON.stringify(formData.variants));
    formData.imageFiles.forEach((file) =>
      formDataToSend.append("imageFiles", file)
    );
    formData.displayOrders.forEach((order) =>
      formDataToSend.append("displayOrders", order)
    );

    try {
      const response = await fetch("http://localhost:8080/api/products", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: formDataToSend,
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Không thể thêm sản phẩm!");
      }else{
        alert("Thêm sản phẩm thành công");
      }

      onSave();
      onClose();
    } catch (error) {
      console.error("Error adding product:", error);
      alert(error.message);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg w-full max-w-2xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add Product</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-700">
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b mb-4">
          {["basic", "variants", "specs", "images"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 capitalize ${
                activeTab === tab
                  ? "border-b-2 border-violet-500 text-violet-500"
                  : "text-gray-500"
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
        {activeTab === "specs" && (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium">Screen</label>
              <input
                type="number"
                name="screen"
                value={formData.screen}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.screen && (
                <p className="text-red-500 text-sm">{errors.screen}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">RAM</label>
              <input
                type="number"
                name="ram"
                value={formData.ram}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.ram && <p className="text-red-500 text-sm">{errors.ram}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium">Front Camera</label>
              <input
                type="number"
                name="frontCamera"
                value={formData.frontCamera}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.frontCamera && (
                <p className="text-red-500 text-sm">{errors.frontCamera}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Rear Camera</label>
              <input
                type="text"
                name="rearCamera"
                value={formData.rearCamera}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.rearCamera && (
                <p className="text-red-500 text-sm">{errors.rearCamera}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium">Pin</label>
              <input
                type="number"
                name="pin"
                value={formData.pin}
                onChange={handleChange}
                className="w-full border p-2 rounded"
              />
              {errors.pin && <p className="text-red-500 text-sm">{errors.pin}</p>}
            </div>
          </div>
        )}
        {activeTab === "images" && (
            <div className="space-y-4">
                <div className="relative flex justify-center">
                    <input
                        type="file"
                        multiple
                        onChange={handleImageChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        id="file-upload"
                    />
                    <label
                        htmlFor="file-upload"
                        className="inline-block px-4 py-2 bg-violet-500 text-white rounded text-center cursor-pointer"
                    >
                        Chọn ảnh
                    </label>
                </div>
                <div className="max-h-64 overflow-y-auto grid grid-cols-2 gap-4 p-2 border rounded">
                {formData.imageFiles.length > 0 ? (
                    formData.imageFiles.map((file, index) => (
                    <div key={index} className="p-2 border rounded">
                        <img
                        src={URL.createObjectURL(file)}
                        alt="Preview"
                        className="w-full h-24 object-contain"
                        />
                        <p className="text-sm text-center">Order: {formData.displayOrders[index]}</p>
                    </div>
                    ))
                ) : (
                    <p className="text-gray-500 col-span-2 text-center">Chưa có hình ảnh nào.</p>
                )}
                </div>
                {errors.imageFiles && (
                <p className="text-red-500 text-sm">{errors.imageFiles}</p>
                )}
            </div>
        )}

        {/* Buttons */}
        {activeTab === "basic" && (
          <div className="flex justify-end gap-2 mt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 border rounded text-gray-600 hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="px-4 py-2 bg-violet-500 text-white rounded hover:bg-violet-600"
            >
              Save
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
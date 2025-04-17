import React from 'react'
import { useState } from 'react';

export default function AddressModal({ initialData, onSave, onClose }) {
    const [formData, setFormData] = useState(
        initialData || {
            name: "",
            fullName: "",
            phone: "",
            address: ""
        }
    );
    const [addressType, setAddressType] = useState(initialData?.name === "Văn phòng" ? "Văn Phòng" : "Nhà Riêng");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        const updatedFormData = { ...formData, name: addressType };
        console.log("Form submitted:", updatedFormData); 
        onSave(updatedFormData);
    };

    return (
        <div className="fixed inset-0 flex items-center justify-center z-50">
            {/* Semi-transparent overlay */}
            <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
            
            {/* Modal Dialog */}
            <div className="bg-white w-full max-w-md rounded-md shadow-lg z-10">
                <div className="p-4 border-b border-gray-200">
                    <h2 className="text-lg font-medium">
                        {initialData ? "Chỉnh sửa địa chỉ" : "Địa chỉ mới"}
                    </h2>
                </div>
                
                <form onSubmit={handleSubmit} className="p-4">
                    <div className="mb-4">
                        <label className="block text-sm mb-1">
                            Họ và tên
                        </label>
                        <input
                            type="text"
                            name="fullName"
                            value={formData.fullName}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Họ và tên người nhận"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm mb-1">
                            Số điện thoại
                        </label>
                        <input
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            className="w-full p-2 border rounded"
                            placeholder="Số điện thoại"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm mb-1">
                            Địa chỉ
                        </label>
                        <textarea
                            name="address"
                            value={formData.address}
                            onChange={handleChange}
                            className="w-full p-2 border rounded h-24"
                            placeholder="Địa chỉ"
                            required
                        />
                    </div>
                    
                    <div className="mb-4">
                        <label className="block text-sm mb-2">
                            Loại địa chỉ:
                        </label>
                        <div className="flex space-x-4">
                            <button
                                type="button"
                                className={`px-4 py-2 border rounded ${addressType === "Nhà Riêng" ? "border-violet-500" : "border-gray-300"}`}
                                onClick={() => setAddressType("Nhà Riêng")}
                            >
                                Nhà Riêng
                            </button>
                            <button
                                type="button"
                                className={`px-4 py-2 border rounded ${addressType === "Văn Phòng" ? "border-violet-500" : "border-gray-300"}`}
                                onClick={() => setAddressType("Văn Phòng")}
                            >
                                Văn Phòng
                            </button>
                        </div>
                    </div>
                    
                    <div className="flex justify-between p-4 border-t border-gray-200 mt-4">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-gray-600"
                        >
                            Trở Lại
                        </button>
                        <button
                            type="submit"
                            className="px-6 py-2 bg-violet-500 text-white rounded"
                        >
                            Hoàn thành
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}

import React from "react";
import { useState } from "react";

export default function Order() {
    const [activeItem, setActiveItem] = useState(0);

    const handleItemClick = (item) => {
        setActiveItem(item);
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold mb-4">Đơn hàng của tôi</h1>
        <div className="space-y-4 pb-2">
            <ul className="container flex text-gray-600 font-medium scrollbar-none overflow-x-auto w-auto px-0">
                {[
                    "Tất cả",
                    "Chờ xác nhận",
                    "Đang giao hàng",
                    "Đã giao hàng",
                    "Đã hủy",
                    "Hoàn trả",
                ].map((tab, index) => (
                    <li
                        key={index}
                        tabIndex="0"
                        onClick={() => handleItemClick(index)}
                        className={`p-3 cursor-pointer min-w-36 text-center hover:border-b-2 hover:border-violet-600 hover:text-violet-600 ${
                            activeItem=== index
                                ? "border-b-2 border-violet-600 text-violet-600"
                                : ""    
                        }`}
                    >
                        {tab}
                    </li>
                ))}
            </ul>
            
            {/* Example order items */}
            <div className="border rounded-md p-4">
                <div className="flex justify-between mb-2">
                    <span className="font-medium">Đơn hàng #12345</span>
                    <span className="text-green-600 bg-green-100 px-2 py-1 rounded-full text-xs">Đã giao hàng</span>
                </div>
                <div className="text-sm text-gray-600">Ngày đặt: 15/04/2025</div>
                <div className="text-sm font-medium mt-2">2.590.000 ₫</div>
                </div>
        
                <div className="border rounded-md p-4">
                <div className="flex justify-between mb-2">
                    <span className="font-medium">Đơn hàng #12344</span>
                    <span className="text-yellow-600 bg-yellow-100 px-2 py-1 rounded-full text-xs">Đang giao hàng</span>
                </div>
                
                <div className="text-sm text-gray-600">Ngày đặt: 10/04/2025</div>
                <div className="text-sm font-medium mt-2">1.890.000 ₫</div>
            </div>
        </div>
        </div>
    );
}
import React from "react";

export default function CartHeader(){
    return <div className="cart-header">
        <div className="border-b-1 py-2">
            <div className="flex items-center cursor-pointer hover:text-blue-600 transition" onClick={() => window.history.back()}>
                <span className="mr-2 text-xl">←</span>
                <span>Quay lại</span>
            </div>
            <p className="text-2xl font-bold text-center text-gray-800 ">Giỏ hàng của bạn</p>
        </div>
    </div>
}
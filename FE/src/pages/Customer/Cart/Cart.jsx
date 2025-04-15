import React from "react";
import CartHeader from "./CartHeader";
import CartBody from "./CartBody";

export default function Cart(){
    return <div className="cart-page mx-auto px-50">
        <div className=" bg-gray-100 mx-auto pb-5 my-5 rounded-md px-5">
            <CartHeader/>
            <CartBody/>
        </div>
    </div>
}
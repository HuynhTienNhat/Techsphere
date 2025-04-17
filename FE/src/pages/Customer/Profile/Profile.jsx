import React from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Sidebar from "./Sidebar";
import ProfileInfo from "./ProfileInfo";
import Orders from "./Order";
import Addresses from "./Addresses";
import ChangePassword from "./ChangePassword";
import Support from "./Support";

export default function Profile() {
  return (
    <div className="mx-6 mt-2">
      <div className="flex">
        {/* Fixed width sidebar */}
        <Sidebar />
        
        {/* Main content */}
        <div className="flex-1 ml-6">
          <Routes>
            <Route index element={<ProfileInfo />} />
            <Route path="orders" element={<Orders />} />
            <Route path="addresses" element={<Addresses />} />
            <Route path="change-password" element={<ChangePassword />} />
            <Route path="support" element={<Support />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}
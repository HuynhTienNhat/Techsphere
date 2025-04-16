import React, { useState } from "react";
import Sidebar from "../../../components/customer/Sidebar";
import ProfileInfo from "./ProfileInfo";
import Orders from "./Orders";
import Address from "./Address";
import ChangePassword from "./ChangePassword";

export default function Profile() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const menuItems = [
    {
      label: "Thông tin cá nhân",
      onClick: () => setActiveTab("profile"),
    },
    {
      label: "Đơn hàng của tôi",
      onClick: () => setActiveTab("orders"),
    },
    {
      label: "Địa chỉ nhận hàng",
      onClick: () => setActiveTab("addresses"),
    },
    {
      label: "Thay đổi mật khẩu",
      onClick: () => setActiveTab("changePassword"),
    },
  ];

  return (
    
    <div id="profile-form" className="container mx-auto mt-5 flex">
      <div className="">
        <Sidebar menuItems={menuItems} />
      </div>
      <div className="flex-grow">
        {activeTab === "profile" && <ProfileInfo />}
        {activeTab === "orders" && <Orders />}
        {activeTab === "addresses" && <Address />}
        {activeTab === "changePassword" && <ChangePassword />}
      </div>
    </div>
  );
}
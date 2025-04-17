import React from "react";
import { useState } from "react";

export default function ChangePassword() {
  const ChangePasswordData = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  }

  const [confirmPassword, setConfirmPassword] = useState("");

    return (
        <div className="bg-white p-6 rounded-lg shadow">
    <h1 className="text-2xl font-bold mb-4">Thay đổi mật khẩu</h1>
    <form className="space-y-4">
      <div>
        <label className="block text-sm text-gray-600 mb-1">Mật khẩu hiện tại</label>
        <input 
          type="password" 
          className="w-full p-2 border rounded" 
          placeholder="Nhập mật khẩu hiện tại"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
        <input 
          type="password" 
          className="w-full p-2 border rounded" 
          placeholder="Nhập mật khẩu mới"
        />
      </div>
      <div>
        <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
        <input 
          type="password" 
          className="w-full p-2 border rounded" 
          placeholder="Nhập lại mật khẩu mới"
        />
      </div>
      <button className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700">
        Cập nhật mật khẩu
      </button>
    </form>
  </div>
    );
}
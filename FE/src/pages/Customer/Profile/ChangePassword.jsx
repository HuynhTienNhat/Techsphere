import React from "react";
import { useState } from "react";
import {changePassword} from './../../../services/api';
import { toast } from "react-toastify";

export default function ChangePassword() {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    // Kiểm tra xác nhận mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Mật khẩu xác nhận không khớp!");
      setLoading(false);
      return;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (formData.newPassword.length < 6) {
      toast.error("Mật khẩu mới phải có ít nhất 6 ký tự!");
      setLoading(false);
      return;
    }

    // Sử dụng false cho tham số showToast để tránh hiển thị toast hai lần
    const result = await changePassword(formData.oldPassword, formData.newPassword, false);
    
    if (result.success) {
      toast.success('Đổi mật khẩu thành công!');
      // Reset form sau khi thành công
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } else {
      toast.error(result.message);
    }
    
    setLoading(false);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Thay đổi mật khẩu</h1>
      
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mật khẩu hiện tại</label>
          <input 
            type="password" 
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded" 
            placeholder="Nhập mật khẩu hiện tại"
            required
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Mật khẩu mới</label>
          <input 
            type="password" 
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded" 
            placeholder="Nhập mật khẩu mới"
            required
            minLength={6}
          />
        </div>
        <div>
          <label className="block text-sm text-gray-600 mb-1">Xác nhận mật khẩu mới</label>
          <input 
            type="password" 
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            className="w-full p-2 border rounded" 
            placeholder="Nhập lại mật khẩu mới"
            required
          />
        </div>
        <button 
          type="submit"
          disabled={loading}
          className={`bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700 ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {loading ? 'Đang xử lý...' : 'Cập nhật mật khẩu'}
        </button>
      </form>
    </div>
  );
}
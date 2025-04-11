import React from 'react'
import { useState } from "react";

function ResetPassword() {
    const [resetData, setResetData] = useState({
        password: "",
    });

    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setResetData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    }
    
    const validateForm = () => {
        if (!resetData.password || !confirmPassword) {
            return "Vui lòng điền đầy đủ mật khẩu và xác nhận mật khẩu.";
        }
        if (resetData.password !== confirmPassword) {
            return "Mật khẩu và xác nhận mật khẩu không khớp.";
        }
        return null;
    }

    const handleInputChange = async (event) => {
        event.preventDefault();

        // Validate form trước khi gửi
        const errorMessage = validateForm();
        if (errorMessage) {
            alert(errorMessage);
            return;
        }

        try {
            console.log("Reset Data:", resetData);

            const response = await fetch("http://localhost:8080/api/users/reset-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(resetData),
            });

            console.log("Response Status:", response.status);

            const result = await response.json();
            console.log("Response Data:", result);

            if (response.status === 200) {
                alert("Đặt lại mật khẩu thành công!");
                window.location.href = "../login";
            } else {
                alert(result.message || "Đặt lại mật khẩu thất bại.");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }

  return (
    <div id="resetPwForm" className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className='border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative w-[450px]'>
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Đặt lại mật khẩu</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập mật khẩu mới của bạn
        </p>
        <form onSubmit={handleInputChange} className="mt-8 space-y-6" action="#" method="POST">
          <div className="relative my-4">
            <input
              type="password"
              name="password"
                value={resetData.password}
                onChange={handleChange}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Mật khẩu mới
            </label>
        </div>
          <div className="relative my-4">
            <input
              type='password'
                name="confirmPassword"
                onChange={(e) => setConfirmPassword(e.target.value)}
                value={confirmPassword}
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Nhập lại mật khẩu
            </label>
          </div>
          <button
            className="w-full mb-4 cursor-pointer text-[18px] mt-6 rounded-full bg-violet-600 text-white hover:bg-violet-800 py-2"
            type="submit"
          >
            Đặt lại mật khẩu
          </button>
        </form>
      </div>
    </div>
  )
}

export default ResetPassword
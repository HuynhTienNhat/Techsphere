import React from 'react'
import { Link } from "react-router-dom"
import { useState } from 'react';
import { sendOTP } from '../../services/api';
import { useNavigate } from 'react-router-dom';



function ForgetPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  const handleClick = () => {
    sendOTP(email); 
    localStorage.setItem('resetEmail', email);
    navigate('/email-verify', {
      state: "forgetPassword"
    });
  };

  return (
    <div id="forgetPwForm" className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
      <div className='border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative'>
        <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Quên mật khẩu</h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Nhập địa chỉ email của bạn để bắt đầu quá trình đặt lại mật khẩu
        </p>
        <form className="mt-8 space-y-6" action={() => {handleClick()}} method="POST" autoComplete="off">
          <div className="relative my-4">
            <input
              type="email"
              name="email"
              className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none"
              placeholder=""
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <label
              htmlFor=""
              className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6"
            >
              Địa chỉ Email
            </label>
          </div>
          
          <button
            className="w-full mb-4 cursor-pointer text-[18px] mt-6 rounded-full bg-violet-600 text-white hover:bg-violet-800 py-2"
            type="submit"
          >
            Tiếp tục
          </button>
          
          <p className="block text-center">
            Đã có tài khoản?{" "}
            <Link to={"/login"} className="text-violet-600 hover:underline">
              Đăng nhập ngay
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}

export default ForgetPassword
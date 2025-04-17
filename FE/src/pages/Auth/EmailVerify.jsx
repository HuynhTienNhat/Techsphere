import React from 'react'
import { sendOTP, verifyOTP } from '../../services/api';
import { useLocation, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

function EmailVerify() {
    const location = useLocation();
    const inputRef = React.useRef([]);
    const email = localStorage.getItem("resetEmail");
    const navigate = useNavigate();
    const { name } = location.state || {};

    const handleInput = (e, index) => {
        const value = e.target.value;
        if (value.length > 0 && index < inputRef.current.length - 1) {
            inputRef.current[index + 1].focus();
        }
    }

    const handleKeyDown = (e, index) => {
        if (e.key === 'Backspace' && e.target.value === '' && index > 0) {
            inputRef.current[index - 1].focus();
        }
    }

    const handleClick = async () => {
        const otp = inputRef.current.map(input => input?.value || '').join('').trim();
      
        if (otp.length < 6) {
          toast.warn("Vui lòng nhập đầy đủ 6 chữ số OTP!");
          return;
        }
      
        try {
          const result = await verifyOTP(otp, email);
      
          console.log("OTP gửi đi:", otp);
          console.log("Email xác thực:", email);
      
          if (result) {
            localStorage.setItem('resetEmail', email);
            console.log(name);
            if (name === "forgetPassword") {
                navigate('/reset-password');
              } else {
                navigate("/register", { state: { isVerify: "yes" } })
              }
          } else {
            toast.error(result?.message || "Mã OTP sai!");
            inputRef.current.forEach((input) => (input.value = ""));
          }
        } catch (error) {
          console.error("Lỗi verify OTP:", error);
          toast.error("Lỗi kết nối đến server hoặc OTP không hợp lệ!");
          inputRef.current.forEach((input) => (input.value = ""));
        }
      };
        


  return (
    <div id="emailVerifyForm" className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
        <div className='border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative'>
            <h2 className="mt-6 text-center text-3xl font-bold leading-9 tracking-tight text-gray-900">Xác thực Email</h2>
            <p className="mt-2 text-center text-sm text-gray-600 mb-6">
                Vui lòng kiểm tra email của bạn để xác thực tài khoản.
            </p>    
            <div className='flex justify-center items-center mb-6 gap-x-4'>
                {Array(6).fill(0).map((_, index) => (
                    <input type="text" maxLength='1' key={index} required className='w-12 h-12 text-center text-xl rounded-md outline-none border-1'
                    ref={e => inputRef.current[index] = e}
                    onInput={e => handleInput(e, index)}
                    onKeyDown={e => handleKeyDown(e, index)}
                    />
                ))}
            </div>
            <button onClick={()=>{handleClick()}} className="w-full mb-4 cursor-pointer text-[18px] mt-6 rounded-full bg-violet-600 text-white hover:bg-violet-800 py-2">
                Tiếp tục
            </button>
            <p className="block text-center">
                Không nhận được mã?{" "}
                <a onClick={()=>{
                    sendOTP(email);
                    toast.success("Đã gửi lại mã OTP");
                }} className="text-violet-600 hover:underline">
                    Gửi lại 
                </a>
            </p>
            
        </div>
    </div>
  )
}

export default EmailVerify
import { Link } from "react-router-dom"
import Login from "./Login"
import { useState, useEffect } from "react"
export default function Register() {
    const [registerData, setRegisterData] = useState({ name: "", username: "", password: "", email: "", phone: "", address: "" });
    
        const handleInputChange = async (event) => {
            event.preventDefault();
            try {
                const response = await fetch("http://localhost:5173/register", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(registerData),
                });
                const result = await response.json();
                if (result.status == "ok") {
                    alert("Đăng ký thành công!");
                    localStorage.setItem("token", result.token);
                    window.location.href = "../home";
                } else {
                    alert("Đăng ký thất bại!" + result.message);
                }
            }
            catch (error) {
                console.error("Lỗi đăng ký:", error);
                alert("Đăng nhập thất bại! Vui lòng thử lại sau.");
            }
        };

    return(
        <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8">
            <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative w-[450px]">
                <h2 className="text-3xl text-center mb-6">Đăng ký tài khoản</h2>
                <form onSubmit={handleInputChange}>
                <div className="relative my-4">
                    <input type="text" name="name" value={registerData.name} onChange={handleInputChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" required />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Họ và tên</label>
                </div>
                <div className="relative my-4">
                    <input type="text" name="username" value={registerData.username} onChange={handleInputChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" required />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Tên đăng nhập</label>
                </div>
                <div className="relative my-4">
                    <input type="password" name="password" value={registerData.password} onChange={handleInputChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Mật khẩu</label>
                </div>
                <div className="relative my-4">
                    <input type="password" className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Nhập lại mật khẩu</label>
                </div>
                <div className="relative my-4">
                    <input type="email" name="email" value={registerData.email} onChange={handleInputChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Email</label>
                </div>
                <div className="relative my-4">
                    <input type="tel" name="phone" value={registerData.phone} onChange={handleInputChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Số điện thoại</label>
                </div>
                <div className="relative my-4">
                    <input type="text" name="address" value={registerData.address} onChange={handleInputChange} className="block w-full py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Địa chỉ</label>
                </div>
                    <button className="w-full mb-4 text-[18px] mt-6 rounded-full bg-violet-600 text-emerald-50 hover:bg-violet-800  py-2"  type="submit">Đăng ký</button>
                    <p className="block text-center">Đã có tài khoản? <Link to={"/login"} className="text-violet-600 hover:underline">Đăng nhập ngay</Link></p>
                </form>
            </div>
        </div>
    )
}
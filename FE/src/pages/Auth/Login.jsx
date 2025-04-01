import { Link } from "react-router-dom"
import Register from "./Register"

export default function Login() {
    

    return(
        <div className="flex min-h-full flex-1 flex-col justify-center items-center px-6 py-12 lg:px-8"> 
            <div className="border border-slate-400 rounded-md p-8 shadow-lg backdrop-filter backdrop-blur-sm bg-opacity-50 relative">
                <h1 className="text-3xl text-center mb-6">Đăng nhập</h1>
                <form action="">
                <div className="relative my-4">
                    <input type="text" className="block w-72 py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder=""/>
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Tên đăng nhập</label>
                </div>
                <div className="relative my-4">
                    <input type="password" className="block w-72 py-2.5 px-0 text-sm border-0 border-b-2 focus:outline-none focus:border-violet-600 peer appearance-none" placeholder="" />
                    <label htmlFor="" className="absolute text-sm duration-300 transform translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:left-0 peer-focus:text-violet-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6 peer-not-placeholder-shown:scale-75 peer-not-placeholder-shown:-translate-y-6">Mật khẩu</label>
                </div>
                </form>
                <span className="block text-right text-violet-600 hover:underline"><a href="#">Quên mật khẩu?</a></span>
                <button className="w-full mb-4 text-[18px] mt-6 rounded-full bg-violet-600 text-emerald-50 hover:bg-violet-800  py-2" type="submit">Đăng nhập</button>
                <p className="block text-center">Chưa có tài khoản? <Link to={"/register"} className="text-violet-600 hover:underline">Đăng ký ngay</Link></p>
            </div>
        </div>
    )
}
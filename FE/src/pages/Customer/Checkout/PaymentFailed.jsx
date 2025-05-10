import {useNavigate } from "react-router-dom";

const PaymentFailed = () => {
  const navigate = useNavigate();

  return (
    <>
      <div className="p-4 text-center pt-30">Đơn hàng của bạn gặp lỗi trong quá trình xử lí.</div>
      <div className="flex justify-center items-center mt-10">
        <button className="bg-violet-600 p-2 rounded-md px-8" onClick={()=> navigate("/")}>Quay lại trang chủ</button>
      </div>
    </>
  );
};

export default PaymentFailed;

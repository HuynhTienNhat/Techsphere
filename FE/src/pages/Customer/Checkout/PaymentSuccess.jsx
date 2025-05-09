import React, { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import OrderConfirmationModal from "./OrderConfirmationModal";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const formatCurrency = (number) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(number);

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      if (vnp_ResponseCode !== "00") {
        toast.error("Thanh toán thất bại");
        navigate("/checkout");
        return;
      }

      const pendingOrder = JSON.parse(localStorage.getItem("pendingOrder"));
      if (!pendingOrder) {
        toast.error("Không tìm thấy dữ liệu đơn hàng");
        return;
      }


      try {
        const res = await axios.post("http://localhost:8080/api/orders", pendingOrder, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        const addresses = localStorage.getItem('orderAddress');
        const order = localStorage.getItem('pendingOrder');
        localStorage.removeItem("pendingOrder");

        toast.success("Đơn hàng đã tạo thành công sau thanh toán");
        <OrderConfirmationModal
            order={order}
            addresses={addresses}
            formatCurrency={formatCurrency}
            onClose={() => {navigate("/")}}
        />
      } catch (err) {
        toast.error("Không thể tạo đơn hàng sau khi thanh toán");
      }
    };

    createOrderAfterPayment();
  }, [searchParams, navigate]);

  return <div className="p-4 text-center pt-30">Đơn hàng của bạn đang chờ xác nhận</div>;
};

export default PaymentSuccess;

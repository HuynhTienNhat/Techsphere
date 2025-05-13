import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import OrderConfirmationModal from "./OrderConfirmationModal";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [addresses, setAddresses] = useState(null);

  const formatCurrency = (number) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(number);

  useEffect(() => {
    const createOrderAfterPayment = async () => {
      const vnp_ResponseCode = searchParams.get("vnp_ResponseCode");
      if (vnp_ResponseCode !== "00") {
        toast.error("Thanh toán thất bại");
        navigate("/checkout");
        return;
      }

      const pendingOrderStr = localStorage.getItem("pendingOrder");
      const addressStr = localStorage.getItem("orderAddress");

      if (!pendingOrderStr || !addressStr) {
        toast.error("Không tìm thấy dữ liệu đơn hàng");
        return;
      }

      const pendingOrder = JSON.parse(pendingOrderStr);
      const parsedAddresses = JSON.parse(addressStr);

      try {
        const res = await axios.post("http://localhost:8080/api/orders", pendingOrder, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });

        // Set order từ response (đã có đầy đủ orderId, orderItems, userAddressId...)
        setOrder(res.data);
        setAddresses(parsedAddresses);
        localStorage.removeItem("pendingOrder");
        localStorage.removeItem("orderAddress");
        toast.success("Đơn hàng đã tạo thành công sau thanh toán");
      } catch (err) {
        toast.error("Không thể tạo đơn hàng sau khi thanh toán");
      }
    };

    createOrderAfterPayment();
  }, [searchParams, navigate]);

  return (
    <>
      <div className="p-4 text-center pt-30">Đơn hàng của bạn đang được xử lí...</div>
      <OrderConfirmationModal
        order={order}
        addresses={addresses}
        formatCurrency={formatCurrency}
        onClose={() => {
          navigate("/");
        }}
      />
    </>
  );
};

export default PaymentSuccess;

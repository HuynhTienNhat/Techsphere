// src/pages/Customer/Checkout/Checkout.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { fetchCart, getAddresses, createOrder, handlePayment } from '../../../services/api.js';
import CheckoutItems from './CheckoutItems.jsx';
import CheckoutSummary from './CheckoutSummary';
import CheckoutForm from './CheckoutForm';
import OrderConfirmationModal from './OrderConfirmationModal';
import ConfirmCheckoutModal from './ConfirmCheckoutModal';

export default function Checkout() {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(true);
    const [cartItems, setCartItems] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);
    const [shippingFee, setShippingFee] = useState(100000);
    const [paymentMethod, setPaymentMethod] = useState('COD');
    const [addresses, setAddresses] = useState([]);
    const [selectedAddressId, setSelectedAddressId] = useState(null);
    const [order, setOrder] = useState(null);
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [banking, setBanking] = useState(null);
  
    useEffect(() => {
      const loadData = async () => {
        setIsLoading(true);
        try {
          // Lấy giỏ hàng
          const cartData = await fetchCart();
          if (cartData && cartData.cartItems && cartData.totalPrice !== undefined) {
            setCartItems(cartData.cartItems);
            setTotalPrice(cartData.totalPrice);
          } else {
            throw new Error('Dữ liệu giỏ hàng không hợp lệ');
          }
  
          // Lấy địa chỉ
          const addressData = await getAddresses();
          setAddresses(addressData);
          if (addressData.length > 0) {
            const defaultAddress = addressData.find((addr) => addr.isDefault);
            setSelectedAddressId(defaultAddress ? defaultAddress.id : addressData[0].id);
          }
        } catch (err) {
          if (err.message.includes('đăng nhập')) {
            toast.error('Vui lòng đăng nhập để thanh toán');
            localStorage.removeItem('token');
            localStorage.removeItem('role');
            window.dispatchEvent(new Event('token-changed'));
            navigate('/login');
          } else {
            toast.error(err.message || 'Không thể tải dữ liệu');
            navigate('/cart');
          }
        } finally {
          setIsLoading(false);
        }
      };
      loadData();
    }, [navigate]);
  
    const formatCurrency = (number) =>
      new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND',
      }).format(number);
  
    const handleConfirmCheckout = () => {
      setShowConfirmModal(true);
    };
  
    const handleSubmitOrder = async () => {
      if (!selectedAddressId) {
        toast.error('Vui lòng chọn địa chỉ giao hàng');
        setShowConfirmModal(false);
        return;
      }

      if (cartItems.length === 0) {
        toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm');
        setShowConfirmModal(false);
        return;
      }

      try {
        // Lưu tạm vào localStorage để dùng lại sau khi thanh toán thành công
        const orderDraft = {
          subtotal: totalPrice,
          shippingFee,
          discountCode: shippingFee === 0 ? 'TECHSPHERE' : '',
          discountAmount: shippingFee === 0 ? 100000 : 0,
          paymentMethod,
          userAddressId: selectedAddressId,
        };

        localStorage.setItem('pendingOrder', JSON.stringify(orderDraft));
        localStorage.setItem('orderAddress',JSON.stringify(addresses));

        console.log(paymentMethod);
        console.log(banking);
        if (paymentMethod === "BANKING" && banking === "VNPay") {
          await handlePayment(totalPrice + shippingFee, orderDraft,"");
          return; // Dừng lại, đợi xử lý sau khi redirect
        }

        // Với COD hoặc các phương thức không cần redirect
        const createdOrder = await createOrder(orderDraft);
        setOrder(createdOrder);
        setShowConfirmModal(false);
        toast.success('Đơn hàng đã được tạo thành công');
      } catch (err) {
        setShowConfirmModal(false);
        if (err.message.includes('đăng nhập') || err.message.includes('403')) {
          toast.error('Vui lòng đăng nhập để thanh toán');
          localStorage.removeItem('token');
          localStorage.removeItem('role');
          window.dispatchEvent(new Event('token-changed'));
          navigate('/login');
        } else {
          toast.error(err.message || 'Không thể tạo đơn hàng');
        }
      }
    };

  
    if (isLoading) {
      return (
        <div className="text-center py-10">
          <p className="text-gray-500">Đang tải...</p>
        </div>
      );
    }
  
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 font-roboto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Thanh toán</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cột sản phẩm */}
          <div className="lg:col-span-2">
            <CheckoutItems cartItems={cartItems} formatCurrency={formatCurrency} />
          </div>
  
          {/* Cột thanh toán */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <CheckoutSummary
              totalPrice={totalPrice}
              shippingFee={shippingFee}
              setShippingFee={setShippingFee}
              formatCurrency={formatCurrency}
            />
            <CheckoutForm
              paymentMethod={paymentMethod}
              setPaymentMethod={setPaymentMethod}
              addresses={addresses}
              selectedAddressId={selectedAddressId}
              setSelectedAddressId={setSelectedAddressId}
              onConfirm={handleConfirmCheckout}
              setBanking={setBanking}
              Banking={banking}
            />
          </div>
        </div>
  
        {/* Modal xác nhận đặt hàng */}
        <ConfirmCheckoutModal
          isOpen={showConfirmModal}
          onConfirm={handleSubmitOrder}
          onCancel={() => setShowConfirmModal(false)}
        />
  
        {/* Modal xác nhận đơn hàng */}
        <OrderConfirmationModal
          order={order}
          addresses={addresses}
          formatCurrency={formatCurrency}
          onClose={() => setOrder(null)}
        />
      </div>
    );
}
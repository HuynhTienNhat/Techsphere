import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FaTrash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { fetchCart, updateCartItemQuantity, removeCartItem } from '../../../services/api';

export default function CartBody() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [cartItems, setCartItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    loadCart();
  }, []);

  const loadCart = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchCart();
      console.log('Cart data:', data);
      if (data && data.cartItems && data.totalPrice !== undefined) {
        setCartItems(data.cartItems);
        setTotalPrice(data.totalPrice);
      } else {
        throw new Error('Dữ liệu giỏ hàng không hợp lệ');
      }
    } catch (err) {
      if (err.message.includes('đăng nhập')) {
        toast.error('Vui lòng đăng nhập để xem giỏ hàng');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('token-changed'));
        navigate('/login');
      } else {
        setError(err.message);
        toast.error(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const formatCurrency = (number) =>
    new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND',
    }).format(number);

  const updateQuantity = async (id, delta) => {
    const item = cartItems.find((item) => item.id === id);
    if (!item) return;

    const newQuantity = Math.max(1, item.quantity + delta);
    try {
      const updatedItem = await updateCartItemQuantity(id, newQuantity);
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: updatedItem.quantity } : item
        )
      );
      // Cập nhật totalPrice
      setTotalPrice(
        cartItems.reduce(
          (total, item) =>
            total +
            (item.id === id
              ? updatedItem.quantity * updatedItem.unitPrice
              : item.quantity * item.unitPrice),
          0
        )
      );
    } catch (err) {
      if (err.message.includes('đăng nhập') || err.message.includes('403')) {
        toast.error('Vui lòng đăng nhập để cập nhật giỏ hàng');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('token-changed'));
        navigate('/login');
      } else {
        toast.error(err.message || 'Không thể cập nhật số lượng');
      }
    }
  };

  const deleteCartItem = async (id) => {
    try {
      await removeCartItem(id);
      setCartItems((prev) => prev.filter((item) => item.id !== id));
      // Cập nhật totalPrice
      setTotalPrice(
        cartItems
          .filter((item) => item.id !== id)
          .reduce((total, item) => total + item.quantity * item.unitPrice, 0)
      );
      toast.success('Đã xóa sản phẩm');
    } catch (err) {
      if (err.message.includes('đăng nhập') || err.message.includes('403')) {
        toast.error('Vui lòng đăng nhập để xóa sản phẩm');
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        window.dispatchEvent(new Event('token-changed'));
        navigate('/login');
      } else {
        toast.error(err.message || 'Không thể xóa sản phẩm');
      }
    }
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      toast.error('Giỏ hàng trống, vui lòng thêm sản phẩm');
      return;
    }
    navigate('/checkout');
  };

  const cartItemsElement = cartItems.map((item) => (
    <div
      key={item.id}
      className="rounded-md flex items-start p-5 min-h-[100px] justify-between bg-white text-black border-gray-400"
    >
      <div className="flex-shrink-0">
        <img
          src={item.mainImageUrl || 'https://via.placeholder.com/150'}
          alt={item.productName}
          className="w-[130px] h-[130px] object-cover rounded"
        />
      </div>
      <div className="flex flex-col flex-grow ml-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-black font-medium">{item.productName}</p>
            <p>
              {item.storage} - {item.color}
            </p>
          </div>
          <FaTrash
            className="text-black dark:text-gray-400 text-2xl cursor-pointer"
            onClick={() => deleteCartItem(item.id)}
          />
        </div>
        <div className="flex justify-between items-center mt-15">
          <div className="flex gap-2">
            <p className="text-red-600 font-semibold text-xl">
              {formatCurrency(item.unitPrice)}
            </p>
            {item.oldPrice && (
              <p className="line-through text-gray-300 text-sm pt-1">
                {formatCurrency(item.oldPrice)}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <span
              onClick={() => updateQuantity(item.id, -1)}
              className="rounded-md cursor-pointer bg-gray-300 w-8 h-8 flex justify-center items-center"
            >
              -
            </span>
            <input
              type="text"
              readOnly
              className="bg-transparent w-8 h-8 text-center text-black"
              value={item.quantity}
            />
            <span
              onClick={() => updateQuantity(item.id, 1)}
              className="rounded-md cursor-pointer bg-gray-300 w-8 h-8 flex justify-center items-center"
            >
              +
            </span>
          </div>
        </div>
      </div>
    </div>
  ));

  return (
    <div>
      <div className="container-body items-center">
        <div className="container-items">
          {isLoading ? (
            <div className="text-center py-10">
              <p className="text-gray-500">Đang tải giỏ hàng...</p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-gray-500">{error}</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="mt-20 flex flex-col justify-center items-center">
              <p className="block h-[30vh] mt-20 text-center">
                Giỏ hàng của bạn đang trống.
                <br />
                Hãy chọn thêm sản phẩm mới để mua sắm.
              </p>
              <div className="mt-4">
                <Link
                  to={'/'}
                  className="px-10 p-2 cursor-pointer rounded-md dark:bg-violet-600 dark:text-gray-50 hover:dark:bg-violet-700 transition-colors"
                >
                  Quay lại trang chủ
                </Link>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-10 mt-10">
              {cartItemsElement}
              <div className="bg-white flex justify-between items-center">
                <p className="ml-2 p-5 text-xl">
                  Tạm tính: <span className="text-red-500">{formatCurrency(totalPrice)}</span>
                </p>
                <button onClick={handleCheckout} className="mr-5 bg-violet-500 rounded-md cursor-pointer h-10 p-2 px-5 text-white">
                  Mua ngay
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
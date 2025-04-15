import { useState } from 'react';
import { toast } from 'react-toastify';

export default function CheckoutSummary({
  totalPrice,
  shippingFee,
  setShippingFee,
  formatCurrency,
}) {
  const [coupon, setCoupon] = useState('');

  const handleApplyCoupon = () => {
    if (coupon.trim().toUpperCase() === 'TECHSPHERE') {
      setShippingFee(0);
      toast.success('Áp dụng mã giảm giá thành công');
    } else {
      setShippingFee(100000);
      toast.error('Mã giảm giá không hợp lệ');
    }
  };

  return (
    <div className="mb-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Tổng quan đơn hàng</h3>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Tạm tính</span>
        <span className="text-gray-900">{formatCurrency(totalPrice)}</span>
      </div>
      <div className="flex justify-between mb-2">
        <span className="text-gray-600">Phí vận chuyển</span>
        <span className="text-gray-900">{formatCurrency(shippingFee)}</span>
      </div>
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Mã giảm giá</label>
        <div className="flex gap-2">
          <input
            type="text"
            value={coupon}
            onChange={(e) => setCoupon(e.target.value)}
            className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-violet-600"
            placeholder="Nhập mã giảm giá"
          />
          <button
            onClick={handleApplyCoupon}
            className="px-4 py-2 bg-violet-600 text-white rounded-md hover:bg-violet-700"
          >
            Áp dụng
          </button>
        </div>
      </div>
      <div className="flex justify-between font-semibold text-lg">
        <span className="text-gray-900">Tổng cộng</span>
        <span className="text-red-600">{formatCurrency(totalPrice + shippingFee)}</span>
      </div>
    </div>
  );
}
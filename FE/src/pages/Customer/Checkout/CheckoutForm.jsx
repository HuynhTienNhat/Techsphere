// src/components/Checkout/CheckoutForm.jsx
import { useState } from 'react';
import AddressSelectionModal from './AddressSelectionModal';

export default function CheckoutForm({
  paymentMethod,
  setPaymentMethod,
  addresses,
  selectedAddressId,
  setSelectedAddressId,
  onConfirm,
  setBanking,
  Banking
}) {
  const [openAddressModal, setOpenAddressModal] = useState(false);

  const selectedAddress = addresses.find((addr) => addr.id === selectedAddressId);

  return (
    <div>
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Thông tin thanh toán</h3>

      {/* Phương thức thanh toán */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Phương thức thanh toán</label>
        <div className="flex flex-col gap-2">
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="COD"
              checked={paymentMethod === 'COD'}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setBanking(null);
              }}
              className="text-violet-600 focus:ring-violet-600"
            />
            Thanh toán khi nhận hàng (COD)
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              value="BANKING"
              checked={paymentMethod === 'BANKING'}
              onChange={(e) => {
                setPaymentMethod(e.target.value);
                setBanking("VNPay");
              }}
              className="text-violet-600 focus:ring-violet-600"
            />
            Chuyển khoản ngân hàng
          </label>
          {(paymentMethod === 'BANKING')&&(
            <div className="flex gap-2 ml-7">
              <button className={`bg-gray-200 p-2 rounded-md h-9 w-28 border ${Banking === "VNPay" ? "border-red-100" : "border-transparent"}`} 
                      style={{backgroundImage: "url('https://cdn.brandfetch.io/idV02t6WJs/theme/dark/logo.svg?c=1dxbfHSJFAPEGdCLU4o5B')"}}
                      onClick={()=>{setBanking("VNPay");}}>

              </button>
            </div>
          )}
        </div>
      </div>

      {/* Địa chỉ giao hàng */}
      <div className="mb-4">
        <label className="block text-gray-600 mb-2">Địa chỉ giao hàng</label>
        <div
          onClick={() => setOpenAddressModal(true)}
          className="p-2 border border-gray-300 rounded-md cursor-pointer hover:bg-gray-100"
        >
          {selectedAddress ? (
            <p className="text-gray-900">
              {selectedAddress.streetAndHouseNumber}, {selectedAddress.district}, {selectedAddress.city}
              {selectedAddress.isDefault && ' (Mặc định)'}
            </p>
          ) : (
            <p className="text-gray-600">Chọn địa chỉ giao hàng</p>
          )}
        </div>
      </div>

      {/* Nút xác nhận */}
      <button
        onClick={onConfirm}
        className="w-full py-3 bg-violet-600 text-white rounded-md hover:bg-violet-700"
      >
        Xác nhận thanh toán
      </button>

      {/* Modal chọn địa chỉ */}
      <AddressSelectionModal
        open={openAddressModal}
        addresses={addresses}
        selectedAddressId={selectedAddressId}
        onSelect={(id) => {
          setSelectedAddressId(id);
          setOpenAddressModal(false);
        }}
        onClose={() => setOpenAddressModal(false)}
      />
    </div>
  );
}
import { useState, useEffect } from 'react';
import { getAddresses, addAddress, updateAddress, deleteAddress, setDefaultAddress } from './../../../services/api.js';
import AddressModal from './AddressModal';
import { toast } from 'react-toastify';

export default function Addresses() {
  const [open, setOpen] = useState(false);
  const [edit, setEdit] = useState(null);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const data = await getAddresses();
        setAddresses(data);
      } catch (error) {
        toast.error(error.message);
      }
    };
    fetchAddresses();
  }, []);

  const handleAddNew = () => {
    setEdit(null);
    setOpen(true);
  };

  const handleEdit = (address) => {
    setEdit(address);
    setOpen(true);
  };

  const handleDelete = async (addressId) => {
    try {
      await deleteAddress(addressId);
      setAddresses(addresses.filter((addr) => addr.id !== addressId));
      toast.success('Xóa địa chỉ thành công!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleSetDefault = async (addressId) => {
    try {
      await setDefaultAddress(addressId);
      setAddresses(
        addresses.map((addr) =>
          addr.id === addressId
            ? { ...addr, isDefault: true } // Sửa từ default sang isDefault
            : { ...addr, isDefault: false }
        )
      );
      toast.success('Đặt địa chỉ mặc định thành công!');
    } catch (error) {
      toast.error(error.message);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setEdit(null);
  };

  const handleSave = async (formData) => {
    try {
      if (edit) {
        const updatedAddress = await updateAddress(edit.id, formData);
        setAddresses(
          addresses.map((addr) =>
            addr.id === edit.id ? updatedAddress : addr
          )
        );
        toast.success('Cập nhật địa chỉ thành công!');
      } else {
        const newAddress = await addAddress(formData);
        setAddresses([...addresses, newAddress]);
        toast.success('Thêm địa chỉ thành công!');
      }
      setOpen(false);
      setEdit(null);
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <h1 className="text-2xl font-bold mb-4">Địa chỉ nhận hàng</h1>
      <div className="space-y-4">
        {addresses.map((address) => (
          <div key={address.id} className="border rounded-md p-4">
            <div className="flex justify-between">
              <div>
                <div className="font-medium">{address.typeOfAddress}</div>
                <div className="text-sm text-gray-600 mt-1">
                  {address.streetAndHouseNumber}, {address.district}, {address.city}
                </div>
                {address.isDefault && (
                  <div className="text-sm text-green-600 mt-1">Mặc định</div>
                )}
              </div>
              <div className="flex space-x-2">
                <button
                  onClick={() => handleEdit(address)}
                  className="text-violet-600 hover:text-violet-800"
                >
                  Chỉnh sửa
                </button>
                <button
                  onClick={() => handleDelete(address.id)}
                  className={`text-red-600 hover:text-red-800 ${address.isDefault ? 'opacity-50 cursor-not-allowed' : ''}`}
                  disabled={address.isDefault} // Vô hiệu hóa nút Xóa cho địa chỉ mặc định
                >
                  Xóa
                </button>
                {!address.isDefault && (
                  <button
                    onClick={() => handleSetDefault(address.id)}
                    className="text-blue-600 hover:text-blue-800"
                  >
                    Đặt làm mặc định
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
        <button
          onClick={handleAddNew}
          className="bg-violet-600 text-white px-4 py-2 rounded hover:bg-violet-700"
        >
          Thêm địa chỉ mới
        </button>
      </div>

      {open && (
        <AddressModal
          initialData={edit}
          onClose={handleClose}
          onSave={handleSave}
        />
      )}
    </div>
  );
}
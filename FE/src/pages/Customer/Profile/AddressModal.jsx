import { useState, useEffect } from 'react';

export default function AddressModal({ initialData, onSave, onClose }) {
  const [formData, setFormData] = useState(
    initialData || {
      city: '',
      district: '',
      streetAndHouseNumber: '',
      default: false,
      typeOfAddress: 'Nhà Riêng',
    }
  );

  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);

  useEffect(() => {
    fetch('https://provinces.open-api.vn/api/?depth=1')
      .then((res) => res.json())
      .then((data) => setProvinces(data));
  }, []);

  useEffect(() => {
    if (formData.city) {
      const selectedProvince = provinces.find((p) => p.name === formData.city);
      if (selectedProvince) {
        fetch(`https://provinces.open-api.vn/api/p/${selectedProvince.code}?depth=2`)
          .then((res) => res.json())
          .then((data) => setDistricts(data.districts));
      }
    } else {
      setDistricts([]);
    }
  }, [formData.city, provinces]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
    onSave(formData);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50">
      <div className="absolute inset-0 bg-black opacity-50" onClick={onClose}></div>
      <div className="bg-white w-full max-w-md rounded-md shadow-lg z-10">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-medium">
            {initialData ? 'Chỉnh sửa địa chỉ' : 'Địa chỉ mới'}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-4">
          <div className="mb-4">
            <label className="block text-sm mb-1">Tỉnh/Thành phố</label>
            <select
              name="city"
              value={formData.city}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  city: e.target.value,
                  district: '',
                })
              }
              className="w-full p-2 border rounded"
              required
            >
              <option value="">-- Chọn Tỉnh/Thành --</option>
              {provinces.map((province) => (
                <option key={province.code} value={province.name}>
                  {province.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Quận/Huyện</label>
            <select
              name="district"
              value={formData.district}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
              disabled={!formData.city}
            >
              <option value="">-- Chọn Quận/Huyện --</option>
              {districts.map((district) => (
                <option key={district.code} value={district.name}>
                  {district.name}
                </option>
              ))}
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-1">Số nhà / Tên đường</label>
            <input
              type="text"
              name="streetAndHouseNumber"
              value={formData.streetAndHouseNumber}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              placeholder="Ví dụ: 123 Lê Lợi"
              required
            />
          </div>

          <div className="mb-4 flex items-center space-x-2">
            <input
              type="checkbox"
              id="default"
              checked={formData.default}
              onChange={(e) =>
                setFormData({ ...formData, default: e.target.checked })
              }
            />
            <label htmlFor="default" className="text-sm">
              Đặt làm địa chỉ mặc định
            </label>
          </div>

          <div className="mb-4">
            <label className="block text-sm mb-2">Loại địa chỉ:</label>
            <div className="flex space-x-4">
              {['Nhà riêng', 'Văn phòng'].map((type) => (
                <button
                  type="button"
                  key={type}
                  className={`px-4 py-2 border rounded ${
                    formData.typeOfAddress === type
                      ? 'border-violet-500'
                      : 'border-gray-300'
                  }`}
                  onClick={() => setFormData({ ...formData, typeOfAddress: type })}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <div className="flex justify-between p-4 border-t border-gray-200 mt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-600"
            >
              Trở Lại
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-violet-500 text-white rounded"
            >
              Hoàn thành
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
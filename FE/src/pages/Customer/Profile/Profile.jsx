import Navbar from './Navbar.jsx';

export default function Profile() {
  return (
    <div className="mx-30 mt-2">
      <div className="flex">
        {/* Fixed width sidebar */}
        <Navbar />
        
        {/* Main content */}
        <div className="flex-1 ml-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <h1 className="text-2xl font-bold mb-4">Thông tin tài khoản</h1>
            
            {/* Profile content */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h2 className="text-lg font-semibold mb-3">Thông tin cá nhân</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Họ tên</label>
                    <input 
                      type="text" 
                      className="w-full p-2 border rounded" 
                      defaultValue="Nguyễn Văn A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Email</label>
                    <input 
                      type="email" 
                      className="w-full p-2 border rounded" 
                      defaultValue="example@email.com" 
                      readOnly
                    />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Số điện thoại</label>
                    <input 
                      type="tel" 
                      className="w-full p-2 border rounded" 
                      defaultValue="0123456789"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-lg font-semibold mb-3">Địa chỉ giao hàng</h2>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Địa chỉ</label>
                    <textarea 
                      className="w-full p-2 border rounded" 
                      rows="3"
                      defaultValue="123 Đường ABC, Phường XYZ, Quận 1, TP.HCM"
                    ></textarea>
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600 mb-1">Tỉnh/Thành phố</label>
                    <select className="w-full p-2 border rounded">
                      <option>TP.HCM</option>
                      <option>Hà Nội</option>
                      <option>Đà Nẵng</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="mt-6">
              <button className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700">
                Lưu thay đổi
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
import React from 'react';

const PrivacyPolicy = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Chính Sách Bảo Mật</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Thông tin chúng tôi thu thập</h2>
        <p className="mb-4">Tại TechSphere, chúng tôi coi trọng quyền riêng tư của khách hàng. Chúng tôi chỉ thu thập những thông tin cần thiết để xử lý đơn hàng và cải thiện trải nghiệm mua sắm của bạn:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Thông tin cá nhân: Họ tên, địa chỉ email, số điện thoại, địa chỉ giao hàng</li>
          <li className="mb-2">Thông tin thanh toán: Chúng tôi không lưu trữ dữ liệu thẻ tín dụng mà sử dụng các cổng thanh toán an toàn</li>
          <li className="mb-2">Dữ liệu hoạt động: Lịch sử đơn hàng, sản phẩm đã xem, thời gian truy cập website</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Cách chúng tôi sử dụng thông tin</h2>
        <p className="mb-4">Chúng tôi sử dụng thông tin của bạn để:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Xử lý và giao hàng đơn đặt hàng của bạn</li>
          <li className="mb-2">Cung cấp dịch vụ hỗ trợ khách hàng</li>
          <li className="mb-2">Cải thiện trải nghiệm mua sắm và trang web của chúng tôi</li>
          <li className="mb-2">Gửi thông báo về đơn hàng, sản phẩm mới hoặc khuyến mãi (nếu bạn đăng ký)</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Bảo mật thông tin</h2>
        <p className="mb-4">TechSphere cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật sau:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Mã hóa SSL cho tất cả các giao dịch</li>
          <li className="mb-2">Hệ thống bảo mật tiên tiến để ngăn chặn truy cập trái phép</li>
          <li className="mb-2">Giới hạn quyền truy cập vào thông tin cá nhân chỉ cho nhân viên được ủy quyền</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Quyền của bạn</h2>
        <p className="mb-4">Bạn có quyền:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Truy cập thông tin cá nhân mà chúng tôi lưu trữ về bạn</li>
          <li className="mb-2">Yêu cầu chỉnh sửa hoặc cập nhật thông tin không chính xác</li>
          <li className="mb-2">Yêu cầu xóa dữ liệu cá nhân của bạn</li>
          <li className="mb-2">Từ chối nhận thông tin tiếp thị từ chúng tôi</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">5. Liên hệ</h2>
        <p className="mb-4">Nếu bạn có thắc mắc về chính sách bảo mật của chúng tôi, vui lòng liên hệ:</p>
        <p className="mb-2">Email: privacy@techsphere.com</p>
        <p className="mb-2">Điện thoại: 1900 1234</p>
      </section>
    </div>
  );
};

export default PrivacyPolicy;
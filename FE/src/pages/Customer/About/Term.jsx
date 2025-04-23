import React from 'react';

const TermOfUse = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Điều Khoản Sử Dụng</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">1. Điều khoản chung</h2>
        <p className="mb-4">Bằng việc truy cập và sử dụng website TechSphere, bạn đồng ý tuân thủ các điều khoản và điều kiện được quy định dưới đây. Nếu bạn không đồng ý với bất kỳ điều khoản nào, vui lòng không sử dụng website của chúng tôi.</p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">2. Tài khoản người dùng</h2>
        <p className="mb-4">Khi tạo tài khoản trên TechSphere, bạn phải:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Cung cấp thông tin chính xác, đầy đủ và cập nhật</li>
          <li className="mb-2">Bảo mật thông tin đăng nhập của bạn</li>
          <li className="mb-2">Chịu trách nhiệm về mọi hoạt động diễn ra dưới tài khoản của bạn</li>
          <li className="mb-2">Thông báo cho chúng tôi ngay lập tức nếu phát hiện bất kỳ vi phạm bảo mật nào</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">3. Đặt hàng và thanh toán</h2>
        <p className="mb-4">Khi đặt hàng trên TechSphere:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Bạn đảm bảo rằng mọi thông tin bạn cung cấp là chính xác</li>
          <li className="mb-2">Chúng tôi có quyền từ chối hoặc hủy đơn hàng vì bất kỳ lý do gì</li>
          <li className="mb-2">Giá cả có thể thay đổi mà không cần thông báo trước</li>
          <li className="mb-2">Thanh toán phải được thực hiện đầy đủ thông qua các phương thức được chấp nhận trên website</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">4. Bảo hành sản phẩm</h2>
        <p className="mb-4">Tất cả sản phẩm điện thoại được bán trên TechSphere đều có chính sách bảo hành:</p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2">Thời gian bảo hành theo quy định của nhà sản xuất</li>
          <li className="mb-2">Phiếu bảo hành điện tử được gửi qua email sau khi mua hàng</li>
          <li className="mb-2">Sản phẩm không được bảo hành trong trường hợp: rơi vỡ, ngấm nước, sử dụng sai cách</li>
          <li className="mb-2">Chi tiết bảo hành cụ thể được cung cấp kèm theo từng sản phẩm</li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">5. Quyền sở hữu trí tuệ</h2>
        <p className="mb-4">Tất cả nội dung trên website TechSphere, bao gồm nhưng không giới hạn: logo, hình ảnh, văn bản, đồ họa, phần mềm đều thuộc quyền sở hữu của TechSphere hoặc các đối tác cung cấp nội dung. Việc sao chép, phân phối, hiển thị, sửa đổi hoặc sử dụng bất kỳ nội dung nào mà không có sự cho phép đều bị nghiêm cấm.</p>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">6. Thay đổi điều khoản</h2>
        <p className="mb-4">TechSphere có quyền thay đổi điều khoản sử dụng bất cứ lúc nào. Việc tiếp tục sử dụng website sau khi thay đổi được coi là bạn đã chấp nhận các điều khoản mới.</p>
      </section>
    </div>
  );
};

export default TermOfUse;
import React from 'react';

const AboutUs = () => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-6">Về Chúng Tôi</h1>
      
      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Câu chuyện của TechSphere</h2>
        <p className="mb-4">
          TechSphere được thành lập vào năm 2020 bởi một nhóm sinh viên đam mê công nghệ, với mong muốn tạo ra một nền tảng mua sắm điện thoại trực tuyến uy tín, chất lượng và thân thiện với người dùng.
        </p>
        <p className="mb-4">
          Khởi đầu từ một ý tưởng dự án trường học, TechSphere đã phát triển thành một nền tảng thương mại điện tử chuyên cung cấp các sản phẩm điện thoại chính hãng với giá cả cạnh tranh và dịch vụ khách hàng xuất sắc.
        </p>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Tầm nhìn & Sứ mệnh</h2>
        <div className="mb-4">
          <h3 className="text-xl font-medium mb-2">Tầm nhìn</h3>
          <p>
            Trở thành nền tảng thương mại điện tử hàng đầu trong lĩnh vực công nghệ tại Việt Nam, nơi mọi người có thể tiếp cận với những sản phẩm điện thoại tốt nhất một cách dễ dàng và tin cậy.
          </p>
        </div>
        
        <div>
          <h3 className="text-xl font-medium mb-2">Sứ mệnh</h3>
          <p>
            Mang đến cho khách hàng trải nghiệm mua sắm điện thoại trực tuyến thuận tiện, an toàn và đáng tin cậy với sản phẩm chất lượng, giá cả hợp lý và dịch vụ khách hàng tận tâm.
          </p>
        </div>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Giá trị cốt lõi</h2>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-3">
            <strong className="font-medium">Chính trực:</strong> Chúng tôi cam kết kinh doanh minh bạch, trung thực và đặt lợi ích của khách hàng lên hàng đầu.
          </li>
          <li className="mb-3">
            <strong className="font-medium">Chất lượng:</strong> Chúng tôi chỉ cung cấp những sản phẩm điện thoại chính hãng với chất lượng đảm bảo.
          </li>
          <li className="mb-3">
            <strong className="font-medium">Đổi mới:</strong> Chúng tôi liên tục cải tiến để mang đến trải nghiệm mua sắm tốt nhất cho khách hàng.
          </li>
          <li className="mb-3">
            <strong className="font-medium">Tận tâm:</strong> Chúng tôi luôn lắng nghe và hỗ trợ khách hàng một cách nhiệt tình, chu đáo.
          </li>
        </ul>
      </section>

      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Đội ngũ của chúng tôi</h2>
        <p className="mb-4">
          TechSphere là sự kết hợp của những người trẻ đầy nhiệt huyết và chuyên gia trong lĩnh vực công nghệ và thương mại điện tử. Đội ngũ của chúng tôi gồm các thành viên:
        </p>
        <ul className="list-disc pl-6 mb-4">
          <li className="mb-2"><strong>Nguyễn Văn A</strong> - Người sáng lập & CEO</li>
          <li className="mb-2"><strong>Trần Thị B</strong> - Giám đốc công nghệ</li>
          <li className="mb-2"><strong>Lê Văn C</strong> - Giám đốc sản phẩm</li>
          <li className="mb-2"><strong>Phạm Thị D</strong> - Giám đốc dịch vụ khách hàng</li>
        </ul>
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-4">Liên hệ</h2>
        <p className="mb-4">
          Chúng tôi luôn sẵn sàng lắng nghe ý kiến của bạn. Hãy liên hệ với chúng tôi qua:
        </p>
        <ul className="list-none mb-4">
          <li className="mb-2"><strong>Email:</strong> info@techsphere.com</li>
          <li className="mb-2"><strong>Hotline:</strong> 1900 1234</li>
          <li className="mb-2"><strong>Địa chỉ:</strong> Tòa nhà Innovation, 123 Đường Công Nghệ, Quận Cầu Giấy, Hà Nội</li>
        </ul>
      </section>
    </div>
  );
};

export default AboutUs;
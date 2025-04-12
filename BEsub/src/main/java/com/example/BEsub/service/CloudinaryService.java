package com.example.BEsub.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
public class CloudinaryService {
    @Autowired
    private Cloudinary cloudinary;

    public String uploadImage(MultipartFile file, String folder, String publicId) throws IOException {
        Map uploadParams = ObjectUtils.asMap(
                "folder", folder, // Thư mục trên Cloudinary, ví dụ: "products/1"
                "public_id", publicId, // Public ID, ví dụ: "main"
                "overwrite", true // Ghi đè nếu Public ID đã tồn tại
        );

        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), uploadParams);
        String imageUrl = uploadResult.get("secure_url").toString();

        // Chuyển đổi URL để sử dụng tính năng tự động tối ưu hóa hình ảnh
        imageUrl = imageUrl.replace("upload/", "upload/f_auto,q_auto/");
        return imageUrl;
    }

    public void deleteImage(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}

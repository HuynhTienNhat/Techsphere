package com.phonestore.ts.entity;

import java.io.Serializable;
import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.FieldDefaults;
import org.springframework.transaction.annotation.Transactional;

import javax.lang.model.element.Name;

@Entity
@Setter
@Getter
@FieldDefaults(level = AccessLevel.PRIVATE)
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class User{
	@Id
	@GeneratedValue(strategy = GenerationType.AUTO)
	private int id;

	@NotBlank(message = "Tên không được để trống")
	@Size(min = 2, max = 50, message = "Tên phải từ 2 đến 50 ký tự")
	@Column(name = "name", nullable = false)
	private String name;

	@NotBlank(message = "Username không được để trống")
	@Size(min = 3, max = 20, message = "Username phải từ 3 đến 20 ký tự")
	@Column(name = "username", unique = true, nullable = false)
	private String username;

	@NotBlank(message = "Mật khẩu không được để trống")
	@Size(min = 6, max = 30, message = "Mật khẩu phải từ 6 đến 30 ký tự")
	@Column(name = "password", nullable = false)
	private String password;

	@Email(message = "Email không hợp lệ")
	@NotBlank(message = "Email không được để trống")
	@Size(max = 50, message = "Email không được vượt quá 50 ký tự")
	@Column(name = "email", unique = true, nullable = false)
	private String email;

	@Pattern(regexp = "^(\\+84|0)[0-9]{9,10}$", message = "Số điện thoại không hợp lệ")
	@NotBlank(message = "Số điện thoại không được để trống")
	@Column(name = "phone", unique = true, nullable = false)
	private String phone;

	@NotBlank(message = "Địa chỉ không được để trống")
	@Size(max = 255, message = "Địa chỉ không được vượt quá 255 ký tự")
	@Column(name = "address", nullable = false)
	private String address;

	@NotNull(message = "Role không được để trống")
	@ElementCollection(fetch = FetchType.EAGER)
	@CollectionTable(name = "user_roles", joinColumns = @JoinColumn(name = "user_id"), uniqueConstraints = @UniqueConstraint(
			columnNames = {"user_id", "role"}))
	@Column(name = "roles")
	@Enumerated(EnumType.STRING)
	private Set<String> roles = new HashSet<>();;

	@PastOrPresent(message = "Ngày tạo không thể ở tương lai")
	@Column(name = "create_date")
	private Date createDate;
}

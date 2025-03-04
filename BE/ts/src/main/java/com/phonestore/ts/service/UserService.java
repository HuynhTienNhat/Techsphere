package com.phonestore.ts.service;


import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import com.phonestore.ts.dto.request.UserCreationRequest;
import com.phonestore.ts.dto.request.UserUpdateRequest;
import com.phonestore.ts.dto.response.ResponseObject;
import com.phonestore.ts.entity.User;
import com.phonestore.ts.enums.Role;
import com.phonestore.ts.mapper.UserMapper;
import com.phonestore.ts.repository.UserRepository;

@Service
public class UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserMapper userMapper;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	public ResponseEntity<ResponseObject> getUsers(){
		return ResponseEntity.status(HttpStatus.OK).body(
					ResponseObject.builder()
					.status("ok")
					.message("get all users")
					.data(userRepository.findAll())
					.build()
				);
	}
	
	public ResponseEntity<ResponseObject> createUser(UserCreationRequest request){
		String errorMessage = "";
		if(userRepository.existsByUsername(request.getUsername())) errorMessage = "Username existed";
		if(userRepository.existsByEmail(request.getEmail())) errorMessage = "Email existed";
		if(userRepository.existsByPhone(request.getPhone())) errorMessage = "Phone number existed";
		if(!errorMessage.equals(""))
			return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
					ResponseObject.builder()
					.status("bad request")
					.message(errorMessage)
					.data("")
					.build()
				);
		
		User user = userMapper.toUser(request);
		
		Set<String> roles = new HashSet<String>();
		roles.add(Role.USER.name());
		
		user.setRoles(roles);
		user.setCreateDate(new Date());
		
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		
		userRepository.save(user);
		return ResponseEntity.status(HttpStatus.OK).body(
					ResponseObject.builder()
					.status("ok")
					.message("Create user successfully")
					.data(user)
					.build()
				);
	}
	
	public ResponseEntity<ResponseObject> updateUser(UserUpdateRequest request, int id) {
		User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not exists"));
		
		userMapper.updateUser(user, request);
		
		return ResponseEntity.status(HttpStatus.OK).body(
				ResponseObject.builder()
				.status("ok")
				.message("Create user successfully")
				.data(userMapper.toUserResponse(userRepository.save(user)))
				.build()
			);
	}
	
	public ResponseEntity<ResponseObject> deleteUser(int id){
		userRepository.deleteById(id);
		
		return ResponseEntity.status(HttpStatus.OK).body(
				ResponseObject.builder()
				.status("ok")
				.message("Dalete user successfully")
				.data("")
				.build()
			);
	}
}

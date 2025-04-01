package com.phonestore.ts.service;


import java.util.Date;
import java.util.HashSet;
import java.util.Set;

import com.phonestore.ts.exception.ErrorCode;
import lombok.extern.slf4j.Slf4j;
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
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
public class UserService {
	@Autowired
	UserRepository userRepository;
	
	@Autowired
	UserMapper userMapper;
	
	@Autowired
	PasswordEncoder passwordEncoder;
	
	public ResponseObject getUsers(){
		return ResponseObject.builder()
					.status(ErrorCode.OK.getStatus())
					.message("Get users successfully")
					.data(userRepository.findAll())
					.build();
	}
	@Transactional(rollbackFor = Exception.class)
	public ResponseObject createUser(UserCreationRequest request){
		String errorMessage = "";
		if(userRepository.existsByUsername(request.getUsername())) errorMessage = "Username existed";
		if(userRepository.existsByEmail(request.getEmail())) errorMessage = "Email existed";
		if(userRepository.existsByPhone(request.getPhone())) errorMessage = "Phone number existed";
		if(!errorMessage.equals(""))
			return ResponseObject.builder()
					.status(ErrorCode.RUNTIME_ERROR.getStatus())
					.message(errorMessage)
					.data("")
					.build();
		
		User user = userMapper.toUser(request);
		
		Set<String> roles = new HashSet<String>();
		roles.add(Role.USER.name());
		
		user.setRoles(roles);
		user.setCreateDate(new Date());
		
		user.setPassword(passwordEncoder.encode(request.getPassword()));
		
		userRepository.save(user);
		return ResponseObject.builder()
					.status(ErrorCode.OK.getStatus())
					.message("Create user successfully")
					.data(user)
					.build();
	}
	
	public ResponseObject updateUser(UserUpdateRequest request, int id) {
		User user = userRepository.findById(id).orElseThrow(()-> new RuntimeException("User not exists"));
		
		userMapper.updateUser(user, request);
		
		return ResponseObject.builder()
				.status(ErrorCode.OK.getStatus())
				.message("Update user successfully")
				.data(userMapper.toUserResponse(userRepository.save(user)))
				.build();
	}
	
	public ResponseObject deleteUser(int id){
		userRepository.deleteById(id);
		
		return ResponseObject.builder()
				.status(ErrorCode.OK.getStatus())
				.message("Delete user successfully")
				.data("")
				.build();
	}
}

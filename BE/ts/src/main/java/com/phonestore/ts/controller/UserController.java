package com.phonestore.ts.controller;

import com.phonestore.ts.exception.ErrorCode;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phonestore.ts.dto.request.UserCreationRequest;
import com.phonestore.ts.dto.request.UserUpdateRequest;
import com.phonestore.ts.dto.response.ResponseObject;
import com.phonestore.ts.service.UserService;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
	UserService userService;
	
	@GetMapping
	ResponseEntity<ResponseObject> getUsers(){
		return ResponseEntity.status(HttpStatus.OK).body(userService.getUsers());
	}
	
	@PostMapping
	ResponseEntity<ResponseObject> createUser(@Valid @RequestBody UserCreationRequest request){
		return ResponseEntity.status(HttpStatus.OK).body(userService.createUser(request));
	}
	
	@PutMapping("/{id}")
	ResponseEntity<ResponseObject> updateUser(@Valid @RequestBody UserUpdateRequest request,@PathVariable int id){
		return ResponseEntity.status(HttpStatus.OK).body(userService.updateUser(request,id));
	}
	
	@DeleteMapping("/{id}")
	ResponseEntity<ResponseObject> updateUser(@PathVariable int id){
		return ResponseEntity.status(HttpStatus.OK).body(userService.deleteUser(id));
	}
}

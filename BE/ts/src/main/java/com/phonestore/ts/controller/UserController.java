package com.phonestore.ts.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
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

@RestController
@RequestMapping("/users")
public class UserController {
	@Autowired
	UserService userService;
	
	@GetMapping
	ResponseEntity<ResponseObject> getUsers(){
		return userService.getUsers();
	}
	
	@PostMapping
	ResponseEntity<ResponseObject> createUser(@RequestBody UserCreationRequest request){
		return userService.createUser(request);
	}
	
	@PutMapping("/{id}")
	ResponseEntity<ResponseObject> updateUser(@RequestBody UserUpdateRequest request,@PathVariable int id){
		return userService.updateUser(request,id);
	}
	
	@DeleteMapping("/{id}")
	ResponseEntity<ResponseObject> updateUser(@PathVariable int id){
		return userService.deleteUser(id);
	}
}

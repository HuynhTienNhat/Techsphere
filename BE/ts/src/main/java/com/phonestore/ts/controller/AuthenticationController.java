package com.phonestore.ts.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.phonestore.ts.dto.request.AuthenticationRequest;
import com.phonestore.ts.dto.response.ResponseObject;
import com.phonestore.ts.service.AuthenticationService;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;

@CrossOrigin(origins = "http://127.0.0.1:5500")
@RestController
@RequestMapping("/login")
public class AuthenticationController {

	@Autowired
	AuthenticationService authenticationService;
	
	@PostMapping
	public ResponseObject authenticate(@RequestBody AuthenticationRequest request) throws Exception{
		return ResponseObject.builder()
				.status("ok")
				.message("Login succesfully")
				.data(authenticationService.authenticate(request))
				.build();
	}
}

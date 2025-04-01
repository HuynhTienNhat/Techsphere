package com.phonestore.ts.controller;

import com.phonestore.ts.exception.ErrorCode;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
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
	public ResponseEntity<ResponseObject>  authenticate(@Valid @RequestBody AuthenticationRequest request) throws Exception{
		return ResponseEntity.status(HttpStatus.OK).body(
				ResponseObject.builder()
						.status(ErrorCode.OK.getStatus())
						.message("Login succesfully")
						.data(authenticationService.authenticate(request))
						.build()
		);
	}
}

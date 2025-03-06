package com.phonestore.ts.service;

import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Date;
import java.util.StringJoiner;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSObject;
import com.nimbusds.jose.Payload;
import com.nimbusds.jose.crypto.MACSigner;
import com.nimbusds.jwt.JWTClaimsSet;
import com.phonestore.ts.dto.request.AuthenticationRequest;
import com.phonestore.ts.dto.response.AuthenticationResponse;
import com.phonestore.ts.entity.User;
import com.phonestore.ts.repository.UserRepository;

@Service
public class AuthenticationService {
	
	@Autowired
	UserRepository userRepository;
	@Autowired
	PasswordEncoder passwordEncoder;
	@Value("${jwt.signerKey}")
	String SIGNER_KEY;
	
	public AuthenticationResponse authenticate(AuthenticationRequest request) throws Exception {
		var user = userRepository.findByUsername(request.getUsername()).orElseThrow(()->  new Exception());
		
		Boolean authenticated = passwordEncoder.matches(request.getPassword(), user.getPassword());
		
		if(!authenticated) {
			throw new Exception();
		}
		
		String token = generateToken(user);
		
		return AuthenticationResponse.builder()
				.token(token)
				.isAuthenticated(true)
				.build();
	}
	
	public String generateToken(User user) {
		JWSHeader header = new JWSHeader(JWSAlgorithm.HS512);
		JWTClaimsSet jwtClaimsSet = new JWTClaimsSet.Builder()
				.subject(user.getUsername())
				.issuer("dev")
				.issueTime(new Date())
				.expirationTime(new Date(
						Instant.now().plus(1,ChronoUnit.HOURS).toEpochMilli()
						))
				.claim("scope", buildScope(user))
				.build();
		Payload payload = new Payload(jwtClaimsSet.toJSONObject());
		JWSObject jwsObject = new JWSObject(header,payload);
		try {
			jwsObject.sign(new MACSigner(SIGNER_KEY.getBytes()));
			return jwsObject.serialize();
		}catch  (JOSEException e) {
			throw new RuntimeException();
		}
		
	}
	
	public String buildScope(User user) {
		StringJoiner stringJoiner = new StringJoiner(" ");
		if(!CollectionUtils.isEmpty(user.getRoles())) {
			user.getRoles().forEach((role)->stringJoiner.add(role));
		}
		return stringJoiner.toString();
	}
}

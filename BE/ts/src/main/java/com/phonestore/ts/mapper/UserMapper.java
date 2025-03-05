package com.phonestore.ts.mapper;

import org.mapstruct.Mapper;

import org.mapstruct.MappingTarget;

import com.phonestore.ts.dto.request.UserCreationRequest;
import com.phonestore.ts.dto.request.UserUpdateRequest;
import com.phonestore.ts.dto.response.UserResponse;
import com.phonestore.ts.entity.User;

@Mapper
public interface UserMapper {
//	@Mapping(source = "createDate" , target = "createDate",ignore = true)
	User toUser(UserCreationRequest creationRequest);

//	@Mapping(source = "firstName" , target = "lastName",ignore = true)
	UserResponse toUserResponse(User user);
	
	void updateUser(@MappingTarget User user, UserUpdateRequest request);
}

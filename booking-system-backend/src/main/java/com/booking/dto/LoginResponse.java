package com.booking.dto;

import lombok.Data;

@Data
public class LoginResponse {
    private String token;
    private UserDTO user;
    
    @Data
    public static class UserDTO {
        private Long id;
        private String phone;
        private String nickname;
    }
}
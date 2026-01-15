package com.booking.service;

import com.booking.dto.LoginRequest;
import com.booking.dto.LoginResponse;
import com.booking.entity.User;
import com.booking.repository.UserRepository;
import com.booking.util.JwtUtil;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class AuthService {
    private final UserRepository userRepository;
    private final JwtUtil jwtUtil;
    
    @Value("${app.fixed-verification-code}")
    private String fixedVerificationCode;
    
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 验证码验证（简化版）
        if (!fixedVerificationCode.equals(request.getVerificationCode())) {
            throw new RuntimeException("验证码错误");
        }
        
        // 查找或创建用户
        User user = userRepository.findByPhone(request.getPhone())
                .orElseGet(() -> {
                    User newUser = new User();
                    newUser.setPhone(request.getPhone());
                    newUser.setNickname("用户_" + request.getPhone().substring(7));
                    newUser.setCreatedAt(LocalDateTime.now());
                    return userRepository.save(newUser);
                });
        
        // 生成token
        String token = jwtUtil.generateToken(user.getId(), user.getPhone());
        
        // 构建响应
        LoginResponse response = new LoginResponse();
        response.setToken(token);
        
        LoginResponse.UserDTO userDTO = new LoginResponse.UserDTO();
        userDTO.setId(user.getId());
        userDTO.setPhone(user.getPhone());
        userDTO.setNickname(user.getNickname());
        response.setUser(userDTO);
        
        return response;
    }
}
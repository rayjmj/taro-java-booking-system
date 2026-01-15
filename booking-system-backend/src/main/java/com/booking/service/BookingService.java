package com.booking.service;

import com.booking.dto.BookingRequest;
import com.booking.dto.BookingResponse;
import com.booking.entity.Booking;
import com.booking.repository.BookingRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookingService {
    private final BookingRepository bookingRepository;
    
    @Transactional
    public BookingResponse createBooking(Long userId, BookingRequest request) {
        // 幂等性检查
        if (request.getIdempotentKey() != null) {
            bookingRepository.findByBookingKey(request.getIdempotentKey())
                    .ifPresent(existing -> {
                        throw new RuntimeException("重复请求，已存在相同预约");
                    });
        }
        
        // 业务重复性检查（同一用户、相同服务、日期、时间段）
        if (bookingRepository.existsByUserIdAndServiceNameAndBookingDateAndTimeSlot(
                userId, request.getServiceName(), request.getBookingDate(), request.getTimeSlot())) {
            throw new RuntimeException("该时间段已存在相同预约");
        }
        
        // 创建预约
        Booking booking = new Booking();
        booking.setUserId(userId);
        booking.setServiceName(request.getServiceName());
        booking.setBookingDate(request.getBookingDate());
        booking.setTimeSlot(request.getTimeSlot());
        booking.setCreatedAt(LocalDateTime.now());
        
        // 生成幂等key（如果客户端未提供）
        String bookingKey = request.getIdempotentKey() != null ? 
                request.getIdempotentKey() : 
                generateIdempotentKey(userId, request);
        booking.setBookingKey(bookingKey);
        
        Booking saved = bookingRepository.save(booking);
        return convertToResponse(saved);
    }
    
    public List<BookingResponse> getUserBookings(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(this::convertToResponse)
                .collect(Collectors.toList());
    }
    
    private BookingResponse convertToResponse(Booking booking) {
        BookingResponse response = new BookingResponse();
        response.setId(booking.getId());
        response.setServiceName(booking.getServiceName());
        response.setBookingDate(booking.getBookingDate());
        response.setTimeSlot(booking.getTimeSlot());
        response.setCreatedAt(booking.getCreatedAt());
        return response;
    }
    
    private String generateIdempotentKey(Long userId, BookingRequest request) {
        return String.format("%d_%s_%s_%s_%s", 
                userId,
                request.getServiceName(),
                request.getBookingDate(),
                request.getTimeSlot(),
                UUID.randomUUID().toString().substring(0, 8));
    }
}
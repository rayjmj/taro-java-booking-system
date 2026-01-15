package com.booking.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "bookings")
@Data
public class Booking {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(name = "user_id", nullable = false)
    private Long userId;
    
    @Column(name = "service_name", nullable = false)
    private String serviceName;
    
    @Column(name = "booking_date", nullable = false)
    private LocalDate bookingDate;
    
    @Column(name = "time_slot", nullable = false)
    private String timeSlot;
    
    @Column(name = "created_at")
    private LocalDateTime createdAt;
    
    @Column(name = "booking_key", unique = true)
    private String bookingKey; // 用于幂等性控制
}
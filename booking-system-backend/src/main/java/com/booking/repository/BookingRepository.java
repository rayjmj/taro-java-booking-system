package com.booking.repository;

import com.booking.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface BookingRepository extends JpaRepository<Booking, Long> {
    List<Booking> findByUserIdOrderByCreatedAtDesc(Long userId);
    Optional<Booking> findByBookingKey(String bookingKey);
    boolean existsByUserIdAndServiceNameAndBookingDateAndTimeSlot(
        Long userId, String serviceName, java.time.LocalDate bookingDate, String timeSlot);
}
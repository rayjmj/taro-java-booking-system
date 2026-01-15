package com.booking.dto;

import com.fasterxml.jackson.annotation.JsonFormat;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import java.time.LocalDate;

@Data
public class BookingRequest {
    @NotBlank(message = "服务名称不能为空")
    private String serviceName;
    
    @NotNull(message = "日期不能为空")
    @JsonFormat(pattern = "yyyy-MM-dd")
    @DateTimeFormat(pattern = "yyyy-MM-dd")
    private LocalDate bookingDate;
    
    @NotBlank(message = "时间段不能为空")
    private String timeSlot;
    
    private String idempotentKey; // 幂等性key
}
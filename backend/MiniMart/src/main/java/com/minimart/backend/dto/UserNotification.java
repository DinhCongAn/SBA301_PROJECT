package com.minimart.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserNotification {
    private Long orderId;
    private String orderCode;
    private String message;
    private Long time;
}
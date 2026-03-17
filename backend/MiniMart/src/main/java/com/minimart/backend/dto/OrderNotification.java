package com.minimart.backend.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrderNotification {
    private Long id;
    private String orderCode;
    private String customerName;
    private Double totalAmount;
    private String time;
}
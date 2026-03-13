package com.minimart.backend;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableAsync;

@SpringBootApplication
@EnableAsync
public class MiniMartApplication {

    public static void main(String[] args) {
        SpringApplication.run(MiniMartApplication.class, args);
    }

}

package com.example.buildingplatform.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class webconfig implements WebMvcConfigurer {
    // 暂时移除拦截器，避免认证问题
}


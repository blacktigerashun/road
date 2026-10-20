package com.example.buildingplatform.utils;

import com.example.buildingplatform.dto.UerDto;
import cn.hutool.core.bean.BeanUtil;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.jspecify.annotations.Nullable;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.web.servlet.HandlerInterceptor;

import java.util.Map;
import java.util.concurrent.TimeUnit;

public class LoginIntercepter implements HandlerInterceptor {

    private StringRedisTemplate stringRedisTemplate;

    public LoginIntercepter(StringRedisTemplate stringRedisTemplate) {
        this.stringRedisTemplate = stringRedisTemplate;
    }

    @Override
    public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {
        String token = request.getHeader("authorization");
        if (token == null) {
            response.setStatus(401);
            return false;
        }
        Map< Object, Object> userMap = stringRedisTemplate.opsForHash()
                .entries("login:token:" + token);
        if (userMap.isEmpty()) {
            response.setStatus(401);
            return false;
        }
        UerDto userDto =BeanUtil.fillBeanWithMap(userMap,new UerDto(),false);
        UserHolder.saveUser(userDto);
        stringRedisTemplate.expire(
                "login:token:"+token,
                30,
                TimeUnit.MINUTES
        );
        return true;
    }

    @Override
    public void afterCompletion(HttpServletRequest request, HttpServletResponse response, Object handler, @Nullable Exception ex) throws Exception {
       UserHolder.removeUser();
    }
}

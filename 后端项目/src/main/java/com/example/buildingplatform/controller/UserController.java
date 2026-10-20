package com.example.buildingplatform.controller;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@RestController
@RequestMapping("/user")
public class UserController {

    // 保存验证码
    private String currentCode;

    // 获取验证码
    @PostMapping("/code")
    public Map<String, Object> getCode(@RequestBody Map<String, String> map) {
        String phone = map.get("phone");

        // 生成6位验证码
        String code = String.valueOf(100000 + new Random().nextInt(900000));
        currentCode = code;

        // ====================== 【关键】控制台打印验证码 ======================
        System.out.println("======================================");
        System.out.println("手机号：" + phone);
        System.out.println("后端生成验证码：" + code);  // 控制台显示
        System.out.println("======================================");

        Map<String, Object> res = new HashMap<>();
        res.put("success", true);
        res.put("code", code);  // 前端页面显示
        res.put("message", "发送成功");
        return res;
    }

    // 登录
    @PostMapping("/login")
    public Map<String, Object> login(@RequestBody Map<String, String> map) {
        String phone = map.get("phone");
        String code = map.get("code");

        Map<String, Object> res = new HashMap<>();

        if (code.equals(currentCode)) {
            res.put("success", true);
            res.put("token", "login-success");
            res.put("message", "登录成功");
            System.out.println("用户 " + phone + " 登录成功，验证码正确：" + code);
        } else {
            res.put("success", false);
            res.put("message", "验证码错误");
            System.out.println("用户 " + phone + " 登录失败，验证码错误");
        }

        return res;
    }
}
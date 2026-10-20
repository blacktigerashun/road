package com.example.buildingplatform.service;

import com.example.buildingplatform.dto.LoginDto;
import com.example.buildingplatform.dto.Result;

public
interface UserService {
    /*
    发送手机验证码
     */
    Result sendCode(String phone);

    /*
    登录功能
     */
    Result login(LoginDto loginDto);
}

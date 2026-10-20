package com.example.buildingplatform.dto;

import lombok.Data;

@Data
public class LoginDto {
    public String phone;
    public String code;
    public String password;
}

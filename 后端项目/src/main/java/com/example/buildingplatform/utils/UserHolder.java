package com.example.buildingplatform.utils;

import com.example.buildingplatform.dto.UerDto;

public class UserHolder {
    private static final ThreadLocal<UerDto> tl = new ThreadLocal<>();

    public static void saveUser(UerDto user){
        tl.set(user);
    }

    public static UerDto getUser(){
        return tl.get();
    }
    public static void removeUser(){
        tl.remove();
    }
}

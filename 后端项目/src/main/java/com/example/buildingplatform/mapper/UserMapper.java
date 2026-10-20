package com.example.buildingplatform.mapper;

import com.example.buildingplatform.entity.User;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface UserMapper {
    /*
    查询用户
     */
    @Select("select * from user where phone = #{phone}")
    User queryByPhone(String phone);

    @Insert("insert into user(phone,nickname) values (#{phone},#{nickname})")
    void saveUser(User user);
}

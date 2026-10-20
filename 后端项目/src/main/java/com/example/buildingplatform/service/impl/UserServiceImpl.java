package com.example.buildingplatform.service.impl;

import com.example.buildingplatform.dto.UerDto;
import com.example.buildingplatform.dto.LoginDto;
import com.example.buildingplatform.dto.Result;
import com.example.buildingplatform.entity.User;
import com.example.buildingplatform.mapper.UserMapper;
import com.example.buildingplatform.service.UserService;
import com.example.buildingplatform.utils.RegexUtils;
import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.lang.UUID;
import cn.hutool.core.util.RandomUtil;
import jakarta.annotation.Resource;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.redis.core.StringRedisTemplate;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class UserServiceImpl implements UserService {
    @Resource
    private StringRedisTemplate stringRedisTemplate;

    @Resource
    private UserMapper userMapper;

    /*
    发生手机验证码
     */
    public Result sendCode(String phone) {
        //校验手机格式
        if (RegexUtils.isPhoneInvalid(phone)) {
            return Result.fail("手机格式错误");
        }
        //生成验证码
        String code = RandomUtil.randomNumbers(6);
        //防止60秒重复发送
        String key1 = "login:code:limit:" + phone;
        Boolean exists = stringRedisTemplate.hasKey(key1);

        if (Boolean.TRUE.equals(exists)) {
            return Result.fail("发送过于频繁");
        }
        //保存到redis
        String key2 = "login:code:" + phone;
        stringRedisTemplate.opsForValue().set(key2, code, 2, TimeUnit.MINUTES);
        //发送验证码
        log.info("验证码:"+code);
        return Result.ok();
    }

    /*
    登录
     */
    public Result login(LoginDto loginDto) {
        String phone = loginDto.getPhone();
        String code = loginDto.getCode();
        if (RegexUtils.isPhoneInvalid(phone)) {
            return Result.fail("手机格式错误");
        }
        //从redis中获取code
        String catchcode = stringRedisTemplate.opsForValue().get("login:code:" + phone);
        if(catchcode == null || !catchcode.equals(code)) {
            return Result.fail("验证码错误");
        }
        User user = userMapper.queryByPhone(phone);
        if(user == null){
            user = createUserWithPhone(phone);
        }
        String token = UUID.randomUUID().toString(true);
        UerDto userDto = BeanUtil.copyProperties(user, UerDto.class);
        HashMap<String, Object> map = new HashMap<>();
        map.put("id", userDto.getId().toString());
        map.put("nickName",userDto.getNickName() );
        map.put("icon",userDto.getIcon() );
        String key = "login:token:" + token;
        stringRedisTemplate.opsForHash().putAll(key, map);
        stringRedisTemplate.expire(key, 30, TimeUnit.MINUTES);
        return Result.ok(token);
    }

    public User createUserWithPhone(String phone) {
        User user = new User();
        user.setPhone(phone);
        user.setNickName(RandomUtil.randomString(5));
        userMapper.saveUser(user);
        return user;
    }
}

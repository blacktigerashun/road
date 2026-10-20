package com.example.buildingplatform.entity;

import java.time.LocalDateTime;
import lombok.Data;

@Data
public class Article {
    private Integer id;
    private Integer category;
    private String title;
    private String content;
    private String coverUrl;
    private Integer views;
    private Integer likes;
    private Integer comments;
    private LocalDateTime createTime;
    private byte[] coverBlob;
    private String coverFilename;
    private String coverContentType;
}
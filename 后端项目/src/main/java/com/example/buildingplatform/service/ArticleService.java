package com.example.buildingplatform.service;

import com.example.buildingplatform.entity.Article;
import org.springframework.http.ResponseEntity;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface ArticleService {
    // 发布文章
    void publishArticle(Integer category,
                        String title,
                        String content,
                        MultipartFile img);

    // 获取文章封面
    ResponseEntity<byte[]> getArticleCover(Long id);

    // 获取所有文章
    List<Article> getAllArticles();

    // 根据ID获取文章
    Article getArticleById(Long id);

    // 更新文章
    void updateArticle(Article article);

    // 删除文章
    void deleteArticle(Long id);
}

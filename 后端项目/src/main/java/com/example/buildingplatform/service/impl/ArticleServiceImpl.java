package com.example.buildingplatform.service.impl;

import com.example.buildingplatform.entity.Article;
import com.example.buildingplatform.mapper.ArticleMapper;
import com.example.buildingplatform.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

@Service
public class ArticleServiceImpl implements ArticleService {

    @Autowired
    private ArticleMapper articleMapper;

    @Override
    public void publishArticle(Integer category, String title, String content, MultipartFile img) {
        Article article = new Article();
        if (img != null && !img.isEmpty()) {
            try {
                // 读取文件二进制流
                byte[] blob = img.getBytes();
                // 存到实体类
                article.setCoverBlob(blob);
                article.setCoverFilename(img.getOriginalFilename());
                article.setCoverContentType(img.getContentType());
            } catch (IOException e) {
                throw new RuntimeException("文件读取失败", e);
            }
        }
        article.setCategory(category);
        article.setTitle(title);
        article.setContent(content);
        article.setCreateTime(LocalDateTime.now());

        articleMapper.insert(article);
    }

    @Override
    public ResponseEntity<byte[]> getArticleCover(Long id) {
        Article article = articleMapper.findById(id);
        if (article == null || article.getCoverBlob() == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(article.getCoverContentType()))
                .body(article.getCoverBlob());
    }

    @Override
    public List<Article> getAllArticles() {
        return articleMapper.findAll();  // 获取所有文章
    }

    @Override
    public Article getArticleById(Long id) {
        return articleMapper.findById(id);  // 根据 id 获取文章
    }

    @Override
    public void updateArticle(Article article) {
        articleMapper.update(article);  // 更新文章
    }

    @Override
    public void deleteArticle(Long id) {
        articleMapper.delete(id);  // 删除文章
    }
}




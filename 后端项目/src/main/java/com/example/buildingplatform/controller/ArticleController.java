package com.example.buildingplatform.controller;

import com.example.buildingplatform.entity.Article;
import com.example.buildingplatform.service.ArticleService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/articles")
@CrossOrigin
public class ArticleController {

    @Autowired
    private ArticleService articleService;

    @PostMapping("/publish")
    public Map<String,Object> publish(
            @RequestParam("category") Integer category,
            @RequestParam("title") String title,
            @RequestParam("content") String content,
            @RequestParam(value = "img",required = false)MultipartFile img
            ){
        Map<String,Object> result = new HashMap<>();
        try{
            articleService.publishArticle(category,title,content,img);
            result.put("code",200);
            result.put("message","发布成功");
        }catch(Exception e){
            e.printStackTrace();
            result.put("code",500);
            result.put("message","发布失败");
        }
        return result;
    }

    @GetMapping("/cover/{id}")
    public ResponseEntity<byte[]> getArticleCover(@PathVariable Long id) {
        return articleService.getArticleCover(id);
    }

    @GetMapping("/list")
    public List<Article> list(){
        return articleService.getAllArticles();
    }
}

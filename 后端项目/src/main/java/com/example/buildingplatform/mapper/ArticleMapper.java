package com.example.buildingplatform.mapper;

import com.example.buildingplatform.entity.Article;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.annotations.Delete;

import java.util.List;

@Mapper
public interface ArticleMapper {

    // 查询所有文章
    @Select("SELECT * FROM article")
    List<Article> findAll();

    // 根据 ID 查询文章
    @Select("SELECT * FROM article WHERE id = #{id}")
    Article findById(@Param("id") Long id);

    // 插入文章
    @Insert("INSERT INTO article(title, content, category, cover_blob, cover_filename, cover_content_type, create_time) " +
            "VALUES(#{title}, #{content}, #{category}, #{coverBlob}, #{coverFilename}, #{coverContentType}, #{createTime})")
    int insert(Article article);

    // 更新文章
    @Update("UPDATE article SET title=#{title}, content=#{content}, category=#{category}, cover_blob=#{coverBlob}, " +
            "cover_filename=#{coverFilename}, cover_content_type=#{coverContentType}, create_time=#{createTime} WHERE id=#{id}")
    int update(Article article);

    // 删除文章
    @Delete("DELETE FROM article WHERE id=#{id}")
    int delete(@Param("id") Long id);
}



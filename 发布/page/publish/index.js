
// 使用本地存储模拟发布功能

// 全局变量
let articleId = null;
let contentTextarea = null;

// 初始化编辑器
function initEditor() {
  try {
    const editorContainer = document.getElementById('editor-container');
    contentTextarea = document.createElement('textarea');
    contentTextarea.id = 'content';
    contentTextarea.name = 'content';
    contentTextarea.style.width = '100%';
    contentTextarea.style.minHeight = '400px';
    contentTextarea.style.padding = '16px';
    contentTextarea.style.border = '1px solid #d9c9b4';
    contentTextarea.style.borderRadius = '0 0 8px 8px';
    contentTextarea.style.fontSize = '16px';
    contentTextarea.style.fontFamily = 'SimSun, serif';
    contentTextarea.style.resize = 'vertical';
    
    // 清空编辑器容器并添加文本域
    editorContainer.innerHTML = '';
    editorContainer.appendChild(contentTextarea);
    
    // 隐藏工具栏
    const toolbarContainer = document.getElementById('toolbar-container');
    toolbarContainer.style.display = 'none';
    
    console.log('文本域初始化成功');
  } catch (error) {
    console.error('文本域初始化失败:', error);
    showAlert('编辑器初始化失败，请刷新页面重试', false);
  }
}

// 封面预览功能
function initCoverPreview() {
  const imgInput = document.getElementById('img');
  const coverPreview = document.getElementById('coverPreview');
  
  if (imgInput) {
    imgInput.addEventListener('change', function(e) {
      const file = e.target.files[0];
      if (file) {
        coverPreview.src = URL.createObjectURL(file);
        coverPreview.style.display = 'inline-block';
        document.querySelector('.place').style.display = 'none';
      }
    });
  }
  
  if (coverPreview) {
    coverPreview.addEventListener('click', function() {
      document.getElementById('img').click();
    });
  }
}

// 从URL获取文章ID
function getArticleIdFromUrl() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// 从本地存储加载文章
function loadArticles() {
  const articles = localStorage.getItem('articles');
  return articles ? JSON.parse(articles) : [];
}

// 保存文章到本地存储
function saveArticles(articles) {
  localStorage.setItem('articles', JSON.stringify(articles));
}

// 加载文章详情
function loadArticleDetail(id) {
  try {
    const articles = loadArticles();
    const article = articles.find(a => a.id == id);
    if (article) {
      // 填充表单
      document.querySelector('select[name="category"]').value = article.category;
      document.querySelector('input[name="title"]').value = article.title;
      if (contentTextarea) {
        contentTextarea.value = article.content;
      }
      // 如果有封面，显示封面
      if (article.cover) {
        document.getElementById('coverPreview').src = article.cover;
        document.getElementById('coverPreview').style.display = 'inline-block';
        document.querySelector('.place').style.display = 'none';
      }
      // 修改页面标题
      document.querySelector('.card-title').textContent = '修改文章';
      document.getElementById('publishBtn').textContent = '更新';
    } else {
      showAlert('文章不存在', false);
    }
  } catch (error) {
    console.error('加载文章详情失败:', error);
    showAlert('加载文章详情失败：' + error.message, false);
  }
}

// 发布或更新文章功能
function initPublishButton() {
  const publishBtn = document.getElementById('publishBtn');
  if (publishBtn) {
    publishBtn.addEventListener('click', function() {
      const category = document.querySelector('select[name="category"]').value;
      const title = document.querySelector('input[name="title"]').value.trim();
      const content = contentTextarea ? contentTextarea.value.trim() : '';
      const imgInput = document.getElementById('img');
      const coverPreview = document.getElementById('coverPreview');

      if (!category) {
        showAlert('请选择分类', false);
        return;
      }
      if (!title || title.length < 2 || title.length > 50) {
        showAlert('标题长度应在2-50字之间', false);
        return;
      }
      if (!content) {
        showAlert('请输入内容', false);
        return;
      }

      // 禁用按钮，防止重复提交
      this.disabled = true;
      this.innerText = articleId ? '更新中...' : '发布中...';

      try {
        let articles = loadArticles();
        let cover = '';
        
        // 处理封面图片
        if (imgInput.files[0]) {
          cover = URL.createObjectURL(imgInput.files[0]);
        } else if (coverPreview.src && coverPreview.src !== 'about:blank') {
          cover = coverPreview.src;
        }

        if (articleId) {
          // 更新文章
          const index = articles.findIndex(a => a.id == articleId);
          if (index !== -1) {
            articles[index] = {
              ...articles[index],
              category: category,
              title: title,
              content: content,
              cover: cover
            };
          }
        } else {
          // 发布新文章
          const newArticle = {
            id: Date.now().toString(),
            category: category,
            title: title,
            content: content,
            cover: cover,
            createTime: new Date().toISOString(),
            views: 0,
            comments: 0,
            likes: 0
          };
          articles.push(newArticle);
        }

        // 保存到本地存储
        saveArticles(articles);
        showAlert(articleId ? '更新成功！' : '发布成功！');

        setTimeout(() => {
          window.location.href = '../content/index.html';
        }, 1500);
      } catch (error) {
        console.error((articleId ? '更新' : '发布') + '失败:', error);
        showAlert((articleId ? '更新' : '发布') + '失败：' + error.message, false);
      } finally {
        // 恢复按钮状态
        this.disabled = false;
        this.innerText = articleId ? '更新' : '发布';
      }
    });
  }
}

// 显示提示框
function showAlert(message, success = true) {
  const alertBox = document.getElementById('alertBox');
  if (alertBox) {
    alertBox.innerText = message;
    alertBox.className = 'alert info-box ' + (success ? 'success' : 'error');
    alertBox.style.display = 'block';
    setTimeout(() => {
      alertBox.style.display = 'none';
    }, 3000);
  }
}

// 初始化
function init() {
  // 初始化编辑器
  initEditor();
  // 初始化封面预览
  initCoverPreview();
  // 初始化发布按钮
  initPublishButton();
  // 获取文章ID
  articleId = getArticleIdFromUrl();
  // 如果有文章ID，加载文章详情
  if (articleId) {
    loadArticleDetail(articleId);
  }
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);
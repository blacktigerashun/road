// 使用本地存储管理文章

// 全局变量
let articles = [];
let filteredArticles = [];

// 从本地存储加载文章
function loadArticlesFromStorage() {
  const storedArticles = localStorage.getItem('articles');
  return storedArticles ? JSON.parse(storedArticles) : [];
}

// 保存文章到本地存储
function saveArticlesToStorage(articles) {
  localStorage.setItem('articles', JSON.stringify(articles));
}

// 获取并设置文章列表
function loadArticleList() {
  try {
    // 显示加载中
    document.getElementById('articleList').innerHTML = `
      <tr class="loading-row">
        <td colspan="9" class="loading">
          <div>加载中...</div>
        </td>
      </tr>
    `;

    // 从本地存储加载文章
    articles = loadArticlesFromStorage();
    filteredArticles = [...articles];
    showAlert('从本地存储加载数据成功', true);

    if (articles && articles.length > 0) {
      renderArticleList(filteredArticles);
    } else {
      renderEmpty();
    }
  } catch (error) {
    console.error('加载文章列表失败:', error);
    renderEmpty();
    showAlert('加载失败：' + (error.message || '网络错误'), false);
  }
}

// 渲染文章列表
function renderArticleList(articles) {
  let html = '';
  articles.forEach(article => {
    // 分类名称映射
    const categoryMap = {
      '1': '丝绸之路上的皇宫建筑',
      '2': '丝绸之路上的官府建筑',
      '3': '丝绸之路上的桥梁建筑',
      '4': '丝绸之路上的民居建筑'
    };
    const categoryName = categoryMap[article.category] || '未分类';

    // 封面图片处理
    const coverImg = article.cover
      ? `<img src="${article.cover}" alt="${article.title}" class="rounded">`
      : '<span style="color:#a8937e;">无封面</span>';

    html += `
      <tr data-id="${article.id}">
        <td>${coverImg}</td>
        <td style="max-width: 200px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${article.title || '无标题'}</td>
        <td>${categoryName}</td>
        <td><span class="badge text-bg-success">审核通过</span></td>
        <td>${article.createTime ? new Date(article.createTime).toLocaleString() : '-'}</td>
        <td>${article.views || 0}</td>
        <td>${article.comments || 0}</td>
        <td>${article.likes || 0}</td>
        <td>
          <i class="bi bi-pencil-square edit" data-id="${article.id}" title="编辑"></i>
          <i class="bi bi-trash3 del" data-id="${article.id}" title="删除"></i>
        </td>
      </tr>
    `;
  });

  document.getElementById('articleList').innerHTML = html;
  document.getElementById('totalCount').textContent = `共${articles.length}条`;
  document.getElementById('pageInfo').textContent = `第1页 / 共1页`;

  // 绑定编辑和删除事件
  bindArticleEvents();
}

// 渲染空数据
function renderEmpty() {
  document.getElementById('articleList').innerHTML = `
    <tr class="empty-row">
      <td colspan="9" class="empty-data">
        <i class="bi bi-file-earmark-text"></i>
        <div>暂无文章数据</div>
      </td>
    </tr>
  `;
  document.getElementById('totalCount').textContent = `共0条`;
  document.getElementById('pageInfo').textContent = `第1页 / 共0页`;
}

// 绑定文章操作事件
function bindArticleEvents() {
  // 编辑事件
  document.querySelectorAll('.edit').forEach(btn => {
    btn.addEventListener('click', function() {
      const articleId = this.getAttribute('data-id');
      // 跳转到编辑页面，传递文章ID
      window.location.href = `../publish/index.html?id=${articleId}`;
    });
  });

  // 删除事件
  document.querySelectorAll('.del').forEach(btn => {
    btn.addEventListener('click', function() {
      const articleId = this.getAttribute('data-id');
      if (!confirm('确定要删除这篇文章吗？删除后无法恢复！')) {
        return;
      }

      try {
        // 从本地存储中删除文章
        const index = articles.findIndex(article => article.id == articleId);
        if (index !== -1) {
          articles.splice(index, 1);
          saveArticlesToStorage(articles);
          filteredArticles = [...articles];
          renderArticleList(filteredArticles);
        }
        showAlert('删除成功！', true);
      } catch (error) {
        console.error('删除失败:', error);
        showAlert('删除失败：' + error.message, false);
      }
    });
  });
}

// 显示提示框
function showAlert(message, success = true) {
  const alertBox = document.getElementById('alertBox');
  alertBox.textContent = message;
  alertBox.className = `alert-box ${success ? 'alert-success' : 'alert-error'}`;
  alertBox.style.display = 'block';
  setTimeout(() => {
    alertBox.style.display = 'none';
  }, 3000);
}

// 筛选功能
function initFilter() {
  // 筛选按钮点击事件
  document.getElementById('filterBtn').addEventListener('click', function() {
    const category = document.querySelector('select[name="category"]').value;
    filterArticles(category, '');
  });

  // 刷新按钮点击事件
  document.getElementById('refreshBtn').addEventListener('click', function() {
    loadArticleList();
    showAlert('列表已刷新', true);
  });

  // 搜索功能
  document.getElementById('searchBtn').addEventListener('click', function() {
    const keyword = document.getElementById('searchInput').value.trim();
    const category = document.querySelector('select[name="category"]').value;
    filterArticles(category, keyword);
  });

  // 搜索框回车事件
  document.getElementById('searchInput').addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
      document.getElementById('searchBtn').click();
    }
  });
}

// 筛选文章
function filterArticles(category, keyword) {
  filteredArticles = articles.filter(article => {
    // 分类筛选
    if (category && article.category != category) {
      return false;
    }
    
    // 关键词搜索
    if (keyword) {
      const titleMatch = article.title && article.title.includes(keyword);
      const contentMatch = article.content && article.content.includes(keyword);
      if (!titleMatch && !contentMatch) {
        return false;
      }
    }
    
    return true;
  });
  
  if (filteredArticles.length > 0) {
    renderArticleList(filteredArticles);
    showAlert(`筛选结果：共${filteredArticles.length}条`, true);
  } else {
    renderEmpty();
    showAlert('没有找到匹配的文章', false);
  }
}

// 初始化
function init() {
  loadArticleList();
  initFilter();
}

// 页面加载完成后初始化
window.addEventListener('DOMContentLoaded', init);

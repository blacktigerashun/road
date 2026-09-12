// 引入依赖
require('dotenv').config() // 从同目录 .env 文件加载环境变量（.env 不入库，切勿提交密钥）
const express = require('express')
const cors = require('cors')
const bodyParser = require('body-parser')
const axios = require('axios') // 调用 DeepSeek 接口需要
const path = require('path')

// ============ DeepSeek API 配置 ============
// API Key 只从环境变量读取：在 chat-backend/.env 文件中填写 DEEPSEEK_API_KEY=sk-xxx
// （可复制 .env.example 为 .env）。不要把真实 Key 写进本文件。
const DEEPSEEK_API_KEY = process.env.DEEPSEEK_API_KEY || ''
const DEEPSEEK_API_URL = 'https://api.deepseek.com/chat/completions' // DeepSeek 对话接口（OpenAI 兼容格式）
const DEEPSEEK_MODEL = 'deepseek-v4-pro' // 使用的模型

// 创建 Express 应用
const app = express()
const PORT = 3000 // 后端服务端口

// 项目总目录（chat-backend 的上两级），所有静态站点都在其下：
//   丝绸之路/ 数据大屏/ 发布/ chat/（chatAI 构建产物）
const PROJECT_ROOT = path.join(__dirname, '..', '..')

// 中间件配置·
app.use(cors()) // 解决跨域
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// 根路径直接重定向到数据大屏首页，方便一键打开
app.get('/', (req, res) => {
  res.redirect(encodeURI('/数据大屏/index.html'))
})

// 系统提示词：设定 AI 助手「小筑理」的身份（中式建筑智能问答）
const SYSTEM_PROMPT =
  '你是「小筑理」，一位精通中国传统建筑文化的智能助手，擅长解答中式古建筑（宫殿、园林、民居、寺庙、城墙、营造技艺等）相关问题。' +
  '请用简体中文回答，语言通俗易懂、条理清晰，可适当使用 Markdown 排版。'

// 核心：调用 DeepSeek 接口获取 AI 回复
const getDeepSeekReply = async (userMessage) => {
  // API Key 未配置时的友好提示
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === '在这里填入你的API_KEY') {
    return '「配置缺失」请在 chat-backend/.env 文件中填入 DEEPSEEK_API_KEY=sk-你的Key（可复制 .env.example 为 .env，申请地址：https://platform.deepseek.com/api_keys），保存后重启后端服务。'
  }

  try {
    // DeepSeek Chat Completions API 请求格式（OpenAI 兼容）
    const response = await axios.post(
      DEEPSEEK_API_URL,
      {
        model: DEEPSEEK_MODEL,
        messages: [
          { role: 'system', content: SYSTEM_PROMPT }, // 系统角色：设定助手身份
          { role: 'user', content: userMessage }, // 用户输入的消息
        ],
        stream: false, // 关闭流式响应（返回完整结果）
        temperature: 1.0, // 随机性（0-2，DeepSeek 推荐默认 1.0）
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${DEEPSEEK_API_KEY}`, // API Key 认证
        },
        timeout: 60000, // 超时时间 60 秒
      }
    )

    const choice = response.data?.choices?.[0]?.message
    // 正式回复内容
    let reply = (choice?.content || '').trim()

    // 思考过程（deepseek-v4-pro 默认开启思考模式，思考内容通过 reasoning_content 返回）
    // 用「」包裹，前端会将其渲染为斜体金色的“思考”样式
    const reasoning = (choice?.reasoning_content || '').trim()
    if (reasoning) {
      reply = `「${reasoning}」${reply}`
    }

    return reply || '抱歉，模型没有返回有效内容，请换个问题再试一次。'
  } catch (err) {
    console.error('DeepSeek 调用失败：', err.response?.data || err.message)

    // 根据错误类型返回兜底提示
    const status = err.response?.status
    if (status === 401) {
      return '「调用失败」API Key 无效或已过期，请检查 chat-backend/app.js 中的 DEEPSEEK_API_KEY 是否填写正确。'
    }
    if (status === 402 || err.response?.data?.error?.code === 'insufficient_balance') {
      return '「调用失败」DeepSeek 账户余额不足，请前往 https://platform.deepseek.com 充值后再试。'
    }
    if (err.code === 'ECONNABORTED' || err.code === 'ENOTFOUND' || err.code === 'ECONNREFUSED') {
      return '「调用失败」无法连接 DeepSeek 服务器，请检查网络连接是否正常。'
    }
    const apiMsg = err.response?.data?.error?.message
    return `「调用失败」DeepSeek 服务异常${apiMsg ? `：${apiMsg}` : '，请稍后再试'}`
  }
}

// 对外提供的聊天接口（前端调用）
app.post('/api/chat', async (req, res) => {
  try {
    const { message } = req.body
    if (!message || message.trim() === '') {
      return res.status(400).json({
        code: 400,
        msg: '消息内容不能为空',
        reply: '',
      })
    }

    // 调用 DeepSeek 获取回复
    const botReply = await getDeepSeekReply(message)

    // 返回给前端
    res.status(200).json({
      code: 200,
      msg: 'success',
      reply: botReply,
    })
  } catch (err) {
    console.error('接口报错：', err)
    res.status(500).json({
      code: 500,
      msg: '服务器内部错误',
      reply: '抱歉，后端处理失败，请稍后再试 😭',
    })
  }
})

// ============ 静态站点托管 ============
// 一个服务统一托管所有页面，浏览器内即可连续访问全部站点：
//   /数据大屏/...   数据大屏页面（首页）
//   /丝绸之路/...   丝绸之路主站及各遗址分页面
//   /chat/         chatAI 智能问答（Vue 构建产物）
//   /发布/...       内容发布页面
app.use(express.static(PROJECT_ROOT))

// chatAI 是 Vue 单页应用（history 路由），/chat 下找不到文件时回退到其 index.html
app.get(/^\/chat(?:\/|$)/, (req, res, next) => {
  res.sendFile(path.join(PROJECT_ROOT, 'chat', 'index.html'), (err) => {
    if (err) next()
  })
})

// 启动后端服务
app.listen(PORT, () => {
  console.log(`服务已启动：http://localhost:${PORT}/ （自动打开数据大屏首页）`)
  console.log(`  数据大屏：  http://localhost:${PORT}/数据大屏/index.html`)
  console.log(`  丝绸之路：  http://localhost:${PORT}/丝绸之路/丝绸之路 .html`)
  console.log(`  智能问答页：http://localhost:${PORT}/chat/`)
  console.log(`  发布模块：  http://localhost:${PORT}/发布/page/login/login.html`)
  console.log(`DeepSeek 对接模型：${DEEPSEEK_MODEL}`)
  if (!DEEPSEEK_API_KEY || DEEPSEEK_API_KEY === '在这里填入你的API_KEY') {
    console.warn('⚠️  尚未配置 DEEPSEEK_API_KEY：请在 chat-backend/.env 中填写（参考 .env.example），然后重启服务')
  }
})

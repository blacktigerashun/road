<template>
  <div class="chat-container">
    <!-- 科技感顶部装饰 -->
    <div class="chat-header">
      <div class="header-decoration left"></div>
      <div class="header-title">
        <span>小筑理</span>
        <small>中式建筑智能问答</small>
      </div>
      <div class="header-decoration right"></div>
      <div class="back-btn" onclick="window.location.href='/丝绸之路/丝绸之路 .html'">返回丝路 ←</div>
    </div>

    <!-- 聊天窗口：修复滚动问题 - 关键修改1 -->
    <div class="chat-box-wrapper">
      <div class="chat-box" ref="chatBox">
        <div v-for="(msgGroup, groupIdx) in groupedMessages" :key="groupIdx" class="message-group">
          <div class="time-divider" v-if="msgGroup.showTime">
            {{ formatTime(msgGroup.time) }}
          </div>
          <div
            v-for="(msg, index) in msgGroup.messages"
            :key="index"
            :class="['message-item', msg.sender]"
          >
            <img
              v-if="index === 0"
              :src="msg.sender === 'user' ? userAvatar : botAvatar"
              alt="avatar"
              class="avatar"
            />
            <div class="message-body">
              <div class="nickname" v-if="index === 0">
                {{ msg.sender === 'user' ? '我' : '小筑理' }}
              </div>
              <div class="message-bubble">
                <span v-if="msg.sender === 'bot'">
                  <span
                    v-for="(part, idx) in msg.parsedContent || []"
                    :key="idx"
                    :class="['message-part', part.isThink ? 'think-text' : 'normal-text']"
                  >
                    <span v-html="renderMarkdown(part.displayText)"></span>
                  </span>
                </span>
                <span v-else class="normal-text">{{ msg.content }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- 输入区域 -->
    <div class="input-area-wrapper">
      <div class="input-area">
        <el-upload
          class="upload-btn"
          action="#"
          :before-upload="handleFileUpload"
          :show-file-list="false"
        >
          <el-button type="text" size="small" class="upload-text-btn">
            <span class="icon">📜</span> 上传资料
          </el-button>
        </el-upload>
        <el-input
          v-model="inputMessage"
          placeholder="请输入您的问题，按回车发送..."
          class="message-input"
          @keyup.enter="sendMessage"
          type="textarea"
          :rows="3"
          resize="none"
        ></el-input>
        <el-button
          type="primary"
          size="default"
          @click="sendMessage"
          :disabled="!inputMessage.trim()"
          class="send-btn"
        >
          <span class="icon">✉️</span> 发送
        </el-button>
      </div>
    </div>

    <!-- 中式底部装饰 -->
    <div class="chat-footer">
      <div class="footer-pattern"></div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, onUnmounted, computed } from 'vue'
import axios from 'axios'
import { marked } from 'marked'
// 头像图片通过 import 引入，Vite 构建时会自动处理为正确的部署路径
import userAvatarImg from '../../img/1.jpeg'
import botAvatarImg from '../../img/2.jpeg'

export default {
  name: 'Chat',
  setup() {
    const inputMessage = ref('')
    const messages = ref([])
    const userAvatar = ref(userAvatarImg)
    const botAvatar = ref(botAvatarImg)
    const chatBox = ref(null)
    const typingTimers = ref([])

    const formatTime = (time) => {
      if (!time) return ''
      return new Date(time).toLocaleTimeString('zh-CN', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      })
    }

    const groupedMessages = computed(() => {
      if (messages.value.length === 0) return []

      const groups = []
      let currentGroup = {
        time: messages.value[0].time,
        showTime: true,
        messages: [messages.value[0]],
      }

      for (let i = 1; i < messages.value.length; i++) {
        const prevMsg = messages.value[i - 1]
        const currMsg = messages.value[i]

        const isSameSender = prevMsg.sender === currMsg.sender
        const timeDiff = new Date(currMsg.time) - new Date(prevMsg.time)
        const isSameTimeGroup = timeDiff < 5 * 60 * 1000

        if (isSameSender && isSameTimeGroup) {
          currentGroup.messages.push(currMsg)
        } else {
          groups.push(currentGroup)
          currentGroup = {
            time: currMsg.time,
            showTime: true,
            messages: [currMsg],
          }
        }
      }
      groups.push(currentGroup)
      return groups
    })

    const renderMarkdown = (text) => {
      if (!text || typeof text !== 'string') return ''

      marked.setOptions({
        gfm: true,
        breaks: true,
        sanitize: true,
        smartypants: true,
        highlight: (code, lang) => {
          if (lang) {
            return `<pre class="code-block ${lang}"><code class="language-${lang}">${code}</code></pre>`
          }
          return `<pre class="code-block"><code>${code}</code></pre>`
        },
      })

      let html = marked.parse(text)
      return html
    }

    const parseMessageContent = (content) => {
      const parts = []
      if (!content || typeof content !== 'string') return parts

      let cleanedContent = content
        .replace(/\bpalaces\b/gi, '宫殿')
        .replace(/\bpalace\b/gi, '宫殿')
        .replace(/\bpalace hall\b/gi, '宫殿大殿')
        .replace(/\bwall\b/gi, '城墙')
        .replace(/\bstaircases\b/gi, '台阶')
        .replace(/\bresearch\b/gi, '研究')
        .replace(/\bteaching\b/gi, '教学')
        .replace(/\bcoat-of-arms\b/gi, '国玺')
        .replace(/\bTomb of the Ruler of China's former government\b/gi, '故宫（紫禁城）')
        .replace(/\bthe Chinese government's former residence\b/gi, '故宫（紫禁城）')
        .replace(/政治腐败|据不实之词/g, '')
        .replace(/^#{1,6}\s*(\S+)/gm, (match, title) => {
          const level = match.match(/#/g).length
          return `\n${'#'.repeat(Math.min(level, 3))} ${title}`
        })
        .replace(/#### (\S+)/g, '\n### $1')
        .replace(/- \*/g, ' - ')
        .replace(/\s+-\s+/g, ' - ')
        .replace(/\n{3,}/g, '\n\n')
        .trim()

      let remaining = cleanedContent
      const thinkStart = '「'
      const thinkEnd = '」'

      while (remaining.includes(thinkStart) && remaining.includes(thinkEnd)) {
        const startIdx = remaining.indexOf(thinkStart)
        const endIdx = remaining.indexOf(thinkEnd, startIdx + thinkStart.length)
        if (endIdx === -1) break

        if (startIdx > 0) {
          parts.push({
            text: remaining.substring(0, startIdx),
            isThink: false,
            displayText: '',
          })
        }

        const thinkText = remaining.substring(startIdx + thinkStart.length, endIdx)
        parts.push({
          text: thinkText,
          isThink: true,
          displayText: '',
        })

        remaining = remaining.substring(endIdx + thinkEnd.length)
      }

      if (remaining.trim()) {
        parts.push({
          text: remaining,
          isThink: false,
          displayText: '',
        })
      }

      return parts
    }

    const typingEffect = (msg, speed = 30) => {
      typingTimers.value.forEach((timer) => clearInterval(timer))
      typingTimers.value = []

      if (!msg || !Array.isArray(msg.parsedContent) || msg.parsedContent.length === 0) {
        return
      }

      let totalIndex = 0
      const allChars = []

      msg.parsedContent.forEach((part, partIdx) => {
        if (part.text && typeof part.text === 'string') {
          part.text.split('').forEach((char) => {
            allChars.push({
              partIdx: partIdx,
              char: char,
            })
          })
        }
      })

      const timer = setInterval(() => {
        if (totalIndex >= allChars.length) {
          clearInterval(timer)
          typingTimers.value = typingTimers.value.filter((t) => t !== timer)
          return
        }

        const { partIdx, char } = allChars[totalIndex]
        if (msg.parsedContent[partIdx]) {
          msg.parsedContent[partIdx].displayText += char
        }
        totalIndex++
        scrollToBottom()
      }, speed)

      typingTimers.value.push(timer)
    }

    const handleFileUpload = (file) => {
      console.log('文件上传：', file.name)
      return false
    }

    const sendMessage = async () => {
      const content = inputMessage.value.trim()
      if (!content) return

      const now = new Date()
      messages.value.push({
        sender: 'user',
        content: content,
        time: now,
        parsedContent: [],
      })

      inputMessage.value = ''

      const botMsgIndex =
        messages.value.push({
          sender: 'bot',
          content: '',
          parsedContent: [],
          time: now,
        }) - 1

      try {
        // 相对路径：与页面同源，生产环境由 Express 托管，开发环境由 Vite 代理到 3000
        const res = await axios.post('/api/chat', {
          message: content,
        })
        const botReply = res.data?.reply || ''
        const parsedContent = parseMessageContent(botReply)
        messages.value[botMsgIndex].content = botReply
        messages.value[botMsgIndex].parsedContent = parsedContent
        typingEffect(messages.value[botMsgIndex], 30)
      } catch (err) {
        console.error('发送消息失败：', err)
        const errorMsg = '抱歉，连接后端失败，请检查服务是否启动 😥'
        messages.value[botMsgIndex].content = errorMsg
        messages.value[botMsgIndex].parsedContent = parseMessageContent(errorMsg)
        typingEffect(messages.value[botMsgIndex], 30)
      }

      scrollToBottom()
    }

    // 修复滚动函数 - 关键修改2
    const scrollToBottom = () => {
      if (chatBox.value) {
        // 使用nextTick确保DOM更新后再滚动
        setTimeout(() => {
          chatBox.value.scrollTop = chatBox.value.scrollHeight
        }, 0)
      }
    }

    onMounted(() => {
      scrollToBottom()
    })

    onUnmounted(() => {
      typingTimers.value.forEach((timer) => clearInterval(timer))
      typingTimers.value = []
    })

    return {
      inputMessage,
      messages,
      groupedMessages,
      userAvatar,
      botAvatar,
      chatBox,
      formatTime,
      renderMarkdown,
      parseMessageContent,
      handleFileUpload,
      sendMessage,
    }
  },
}
</script>

<style scoped>
/* 全局重置 */
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "STKaiti", "KaiTi", serif;
}

/* 整体容器：修复高度计算 - 关键修改3 */
.chat-container {
  width: 100%;
  max-width: 1000px;
  height: 90vh;
  min-height: 700px;
  margin: 16px auto;
  border: 2px solid #FFD700;
  border-radius: 8px;
  display: flex;
  flex-direction: column;
  box-shadow: 0 0 20px rgba(255, 215, 0, 0.3);
  background: rgba(139, 69, 19, 0.8);
  position: relative;
  /* 关键：确保容器不会溢出 */
  overflow: hidden;
}

/* 顶部装饰 */
.chat-header {
  height: 60px;
  background: linear-gradient(to right, #8B4513, #A0522D, #8B4513);
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  border-bottom: 2px solid #FFD700;
  /* 关键：固定高度，不参与flex伸缩 */
  flex-shrink: 0;
}
.header-decoration {
  position: absolute;
  width: 40px;
  height: 100%;
  top: 0;
}
.header-decoration.left {
  left: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='60' viewBox='0 0 40 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v60H0z' fill='%238B4513'/%3E%3Cpath d='M5 5l10 10l-10 10v-20zm0 20l10 10l-10 10v-20z' fill='%23FFD700'/%3E%3C/svg%3E");
}
.header-decoration.right {
  right: 0;
  background: url("data:image/svg+xml,%3Csvg width='40' height='60' viewBox='0 0 40 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h40v60H0z' fill='%238B4513'/%3E%3Cpath d='M35 5l-10 10l10 10v-20zm0 20l-10 10l10 10v-20z' fill='%23FFD700'/%3E%3C/svg%3E");
}
.header-title {
  text-align: center;
  color: #FFD700;
}
.header-title span {
  font-size: 20px;
  font-weight: bold;
  font-family: "STXingkai", "华文行楷", "方正行楷", "KaiTi", serif;
  letter-spacing: 4px;
  text-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
}
.header-title small {
  display: block;
  font-size: 12px;
  margin-top: 4px;
  letter-spacing: 2px;
  opacity: 0.8;
  color: #FFE4B5;
}

/* 返回按钮 */
.back-btn {
  position: absolute;
  top: 15px;
  right: 20px;
  padding: 8px 16px;
  background: rgba(255, 215, 0, 0.2);
  border: 1px solid #FFD700;
  border-radius: 4px;
  color: #FFD700;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 1px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
}

.back-btn:hover {
  background: rgba(255, 215, 0, 0.4);
  box-shadow: 0 0 15px rgba(255, 215, 0, 0.5);
  transform: translateY(-2px);
}

/* 聊天窗口：修复滚动核心样式 - 关键修改4 */
.chat-box-wrapper {
  /* 关键：使用flex填充剩余空间，同时限制高度 */
  flex: 1;
  padding: 16px;
  position: relative;
  /* 关键：确保wrapper不会溢出 */
  overflow: hidden;
}
.chat-box-wrapper::before,
.chat-box-wrapper::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  border: 8px solid transparent;
  border-image: url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v20H0z' fill='%23FFD700'/%3E%3Cpath d='M2 2h16v16H2z' fill='%238B4513'/%3E%3C/svg%3E")
    8 repeat;
  pointer-events: none;
}
/* 聊天内容区：核心滚动修复 */
.chat-box {
  width: 100%;
  /* 关键：使用100%高度替代flex，确保滚动容器高度正确 */
  height: 100%;
  padding: 20px;
  /* 关键：仅纵向滚动，隐藏横向滚动 */
  overflow-y: auto;
  overflow-x: hidden;
  background-color: rgba(139, 69, 19, 0.5);
  scrollbar-width: thin;
  scrollbar-color: #FFD700 transparent;
  border: 1px solid rgba(255, 215, 0, 0.2);
  /* 关键：确保内容不会被装饰元素遮挡 */
  position: relative;
  z-index: 1;
}
/* 滚动条美化 */
.chat-box::-webkit-scrollbar {
  width: 8px;
}
.chat-box::-webkit-scrollbar-thumb {
  background-color: #FFD700;
  border-radius: 4px;
  border: 2px solid rgba(139, 69, 19, 0.5);
}
.chat-box::-webkit-scrollbar-track {
  background: transparent;
}

/* 消息样式 */
.message-group {
  margin-bottom: 24px;
  /* 关键：确保消息组不会压缩 */
  display: block;
}
.time-divider {
  text-align: center;
  font-size: 12px;
  color: #FFD700;
  margin: 16px 0;
  position: relative;
  line-height: 1;
  padding: 8px 0;
}
.time-divider::before,
.time-divider::after {
  content: '';
  position: absolute;
  top: 50%;
  width: 35%;
  height: 1px;
  background: linear-gradient(to right, transparent, #FFD700, transparent);
}
.time-divider::before {
  left: 10%;
}
.time-divider::after {
  right: 10%;
}
.message-item {
  display: flex;
  margin-bottom: 16px;
  align-items: flex-start;
  /* 关键：确保消息项换行 */
  flex-wrap: wrap;
}
.avatar {
  width: 44px;
  height: 44px;
  border-radius: 4px;
  margin-right: 16px;
  margin-left: 16px;
  object-fit: cover;
  flex-shrink: 0;
  border: 2px solid #FFD700;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
  background: rgba(139, 69, 19, 0.5);
}
.message-item.user {
  flex-direction: row-reverse;
}
.message-body {
  max-width: 70%;
  /* 关键：确保内容不会溢出容器 */
  word-wrap: break-word;
}
.nickname {
  font-size: 13px;
  color: #FFD700;
  margin-bottom: 8px;
  margin-left: 4px;
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 1px;
  text-shadow: 0 0 5px rgba(255, 215, 0, 0.5);
}
.message-bubble {
  padding: 16px 20px;
  border-radius: 4px;
  word-wrap: break-word;
  line-height: 1.8;
  font-size: 14px;
  box-shadow: 0 0 10px rgba(255, 215, 0, 0.3);
  position: relative;
  letter-spacing: 0.5px;
  /* 关键：确保气泡内文字换行 */
  white-space: pre-wrap;
}
.message-item.bot .message-bubble {
  background-color: rgba(139, 69, 19, 0.8);
  color: #FFE4B5;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-top-left-radius: 0;
}
.message-item.bot .message-bubble::before {
  content: '';
  position: absolute;
  left: -10px;
  top: 0;
  width: 16px;
  height: 16px;
  border-top: 2px solid rgba(255, 215, 0, 0.3);
  border-left: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(139, 69, 19, 0.8);
  border-radius: 0 0 4px 0;
}
.message-item.user .message-bubble {
  background-color: rgba(255, 215, 0, 0.2);
  color: #FFD700;
  border: 1px solid rgba(255, 215, 0, 0.5);
  border-top-right-radius: 0;
}
.message-item.user .message-bubble::after {
  content: '';
  position: absolute;
  right: -10px;
  top: 0;
  width: 16px;
  height: 16px;
  border-top: 2px solid rgba(255, 215, 0, 0.5);
  border-right: 2px solid rgba(255, 215, 0, 0.5);
  background: rgba(255, 215, 0, 0.2);
  border-radius: 0 0 0 4px;
}
.think-text {
  color: #FFD700;
  font-style: italic;
  font-size: 13px;
  margin: 8px 0;
  display: block;
  padding-left: 16px;
  position: relative;
}
.think-text::before {
  content: '「';
  position: absolute;
  left: 0;
  color: #FFD700;
  font-size: 16px;
}
.normal-text {
  line-height: 1.8;
  /* 关键：确保长文本换行 */
  white-space: pre-wrap;
}

/* Markdown 古建筑样式 */
.message-bubble :deep(.code-block) {
  background: rgba(139, 69, 19, 0.8);
  padding: 16px;
  border-radius: 4px;
  margin: 12px 0;
  overflow-x: auto;
  font-family: "STKaiti", "KaiTi", serif;
  font-size: 13px;
  line-height: 1.7;
  border: 1px solid rgba(255, 215, 0, 0.3);
  /* 关键：限制代码块宽度 */
  max-width: 100%;
  color: #FFD700;
}
.message-bubble :deep(h1) {
  font-size: 19px;
  font-weight: bold;
  margin: 16px 0 8px;
  color: #FFD700;
  border-bottom: 2px solid rgba(255, 215, 0, 0.3);
  padding-bottom: 6px;
  font-family: "STXingkai", "华文行楷", "方正行楷", "KaiTi", serif;
  letter-spacing: 1px;
}
.message-bubble :deep(h2) {
  font-size: 17px;
  font-weight: bold;
  margin: 14px 0 7px;
  color: #FFD700;
  font-family: "STXingkai", "华文行楷", "方正行楷", "KaiTi", serif;
  letter-spacing: 1px;
}
.message-bubble :deep(h3) {
  font-size: 15px;
  font-weight: bold;
  margin: 12px 0 6px;
  color: #FFE4B5;
  font-family: "STXingkai", "华文行楷", "方正行楷", "KaiTi", serif;
}
.message-bubble :deep(ul) {
  list-style-type: none;
  padding-left: 20px;
  margin: 8px 0;
}
.message-bubble :deep(ul li) {
  margin: 6px 0;
  position: relative;
  color: #FFE4B5;
}
.message-bubble :deep(ul li)::before {
  content: '●';
  position: absolute;
  left: -20px;
  color: #FFD700;
  font-size: 10px;
  top: 8px;
}
.message-bubble :deep(ol) {
  padding-left: 24px;
  margin: 8px 0;
  list-style-type: none;
  counter-reset: li-counter;
}
.message-bubble :deep(ol li) {
  margin: 6px 0;
  position: relative;
  padding-left: 20px;
  counter-increment: li-counter;
  color: #FFE4B5;
}
.message-bubble :deep(ol li)::before {
  content: counter(li-counter) '、';
  position: absolute;
  left: 0;
  color: #FFD700;
  font-size: 13px;
}
.message-bubble :deep(a) {
  color: #FFD700;
  text-decoration: none;
  border-bottom: 1px dotted #FFD700;
}
.message-bubble :deep(a:hover) {
  color: #FFE4B5;
  border-bottom: 1px solid #FFE4B5;
}
.message-bubble :deep(blockquote) {
  border-left: 4px solid #FFD700;
  padding: 10px 16px;
  color: #FFE4B5;
  margin: 12px 0;
  background: rgba(139, 69, 19, 0.5);
  border-radius: 0 4px 4px 0;
}

/* 输入区域：修复高度 - 关键修改5 */
.input-area-wrapper {
  padding: 16px;
  border-top: 2px solid rgba(255, 215, 0, 0.3);
  background: rgba(139, 69, 19, 0.5);
  /* 关键：固定高度，不参与flex伸缩 */
  flex-shrink: 0;
}
.input-area {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  background: rgba(139, 69, 19, 0.8);
  padding: 12px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  border-radius: 4px;
  box-shadow: inset 0 0 10px rgba(255, 215, 0, 0.1);
  /* 关键：确保输入区域不会溢出 */
  width: 100%;
}
.upload-text-btn {
  color: #FFD700;
  padding: 8px 12px;
  font-family: "STKaiti", "KaiTi", serif;
  display: flex;
  align-items: center;
  gap: 4px;
}
.upload-text-btn:hover {
  color: #fff;
  background: rgba(255, 215, 0, 0.2);
  border-radius: 4px;
}
.upload-text-btn .icon {
  font-size: 14px;
}
.message-input {
  flex: 1;
}
.message-input :deep(.el-textarea__inner) {
  border-radius: 4px;
  border: 1px solid rgba(255, 215, 0, 0.3);
  padding: 12px 16px;
  resize: none;
  line-height: 1.7;
  background: rgba(139, 69, 19, 0.8);
  color: #FFD700;
  letter-spacing: 0.5px;
  font-size: 14px;
  font-family: "STKaiti", "KaiTi", serif;
  /* 关键：确保输入框内文字换行 */
  white-space: pre-wrap;
}
.message-input :deep(.el-textarea__inner):focus {
  border-color: #FFD700;
  box-shadow: 0 0 0 2px rgba(255, 215, 0, 0.2);
  outline: none;
}
.send-btn {
  border-radius: 4px;
  padding: 10px 28px;
  background: rgba(255, 215, 0, 0.3);
  border-color: #FFD700;
  color: #FFD700;
  font-family: "STKaiti", "KaiTi", serif;
  letter-spacing: 2px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.send-btn:hover {
  background: rgba(255, 215, 0, 0.5);
  border-color: #FFD700;
  color: #fff;
}
.send-btn:disabled {
  background-color: rgba(139, 69, 19, 0.5);
  border-color: rgba(255, 215, 0, 0.3);
  color: rgba(255, 215, 0, 0.5);
}
.send-btn .icon {
  font-size: 14px;
}

/* 底部装饰 */
.chat-footer {
  height: 16px;
  background: rgba(139, 69, 19, 0.8);
  border-top: 2px solid rgba(255, 215, 0, 0.3);
  /* 关键：固定高度，不参与flex伸缩 */
  flex-shrink: 0;
}
.footer-pattern {
  width: 100%;
  height: 100%;
  background-image: url("data:image/svg+xml,%3Csvg width='20' height='16' viewBox='0 0 20 16' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M0 0h20v16H0z' fill='%238B4513'/%3E%3Cpath d='M2 2h4v4H2V2zm4 8h4v4H6v-4zm8-8h4v4h-4V2zm4 8h4v4h-4v-4zM2 14h4v4H2v-4zm12 0h4v4h-4v-4zM6 6h4v4H6V6zm8 0h4v4h-4V6z' fill='%23FFD700'/%3E%3C/svg%3E");
  background-size: 20px 16px;
}

/* 响应式适配 */
@media (max-width: 768px) {
  .chat-container {
    width: 96%;
    height: 95vh;
    min-height: unset;
  }
  .message-body {
    max-width: 80%;
  }
  .header-title span {
    font-size: 18px;
    letter-spacing: 2px;
  }
  .input-area {
    flex-direction: column;
    align-items: stretch;
  }
  .upload-btn {
    align-self: flex-start;
  }
  .send-btn {
    width: 100%;
    justify-content: center;
  }
  /* 移动端滚动优化 */
  .chat-box {
    -webkit-overflow-scrolling: touch;
    scroll-behavior: smooth;
  }
}
</style>

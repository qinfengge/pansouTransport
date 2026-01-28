# CloudSync PWA 应用 - 快速开始指南

## 🎯 项目改造完成

你的项目已成功改造为 **PWA（渐进式Web应用）**！

## 🚀 快速开始

### 1️⃣ 安装依赖
```bash
npm install
```

### 2️⃣ 配置API密钥
在项目根目录创建 `.env.local` 文件（参考 `.env.example`）:
```
GEMINI_API_KEY=your_api_key_here
```

### 3️⃣ 开发模式运行
```bash
npm run dev
```
应用将在 http://localhost:3000 启动

### 4️⃣ 构建生产版本
```bash
npm run build
```
生成的文件在 `dist/` 目录中

### 5️⃣ 预览生产构建
```bash
npm run preview
```

## 📱 PWA 核心功能

### ✨ 已启用的功能

| 功能 | 说明 | 状态 |
|------|------|------|
| 离线访问 | Service Worker缓存所有资源 | ✅ 启用 |
| 安装到主屏幕 | 支持iOS和Android | ✅ 启用 |
| 自动更新 | Service Worker自动检查更新 | ✅ 启用 |
| 智能缓存 | 根据资源类型采用不同策略 | ✅ 启用 |
| 响应式设计 | 完美适配所有设备 | ✅ 启用 |

## 🧪 测试 PWA 功能

### 方法1: Chrome/Edge DevTools
```
1. 打开 F12 开发者工具
2. 转到 "Application" 标签
3. 查看:
   - Manifest 标签页 - 验证应用配置
   - Service Workers 标签页 - 验证Service Worker状态
   - Storage > Cache Storage - 查看缓存内容
```

### 方法2: 安装应用
```
1. 访问 http://localhost:3000
2. 在浏览器地址栏右侧点击"安装"按钮
3. 应用会安装到你的主屏幕或应用菜单
```

### 方法3: 离线测试
```
1. 打开 DevTools
2. 进入 "Network" 标签
3. 勾选 "Offline" 复选框
4. 刷新页面 - 应用应该仍然可用
```

## 📊 生成的 PWA 文件

构建后会生成以下文件:

```
dist/
├── sw.js                    # Service Worker脚本 (由vite-plugin-pwa生成)
├── workbox-*.js             # Workbox库文件
├── manifest.webmanifest     # Web App Manifest (自动生成)
├── registerSW.js            # Service Worker注册脚本
└── ... (其他应用文件)
```

## 🔧 配置说明

### Manifest 配置
- 位置: `vite.config.ts` 中的 VitePWA 插件配置
- 功能: 定义应用名称、图标、主题颜色等
- 自动生成: `dist/manifest.webmanifest`

### Service Worker
- 由 `vite-plugin-pwa` 自动生成
- 位置: `dist/sw.js`
- 功能: 缓存资源、离线支持

### 缓存策略
- **Google Fonts**: CacheFirst (1年)
- **Tailwind CDN**: CacheFirst (1周)
- **应用资源**: 自动缓存

## 🌐 部署到生产环境

### ⚠️ 重要要求
- **必须使用 HTTPS** - PWA需要安全连接
- 配置正确的 MIME 类型

### 推荐部署平台

**Vercel** (推荐)
```bash
npm install -g vercel
vercel
```

**Netlify**
```bash
npm run build
# 将 dist/ 文件夹拖放到 Netlify
```

**GitHub Pages**
- 自动配置 HTTPS
- 支持PWA功能

**自托管**
- 需要配置 HTTPS (使用 Let's Encrypt)
- 配置正确的响应头:
  ```
  Content-Type: application/manifest+json
  Cache-Control: max-age=31536000
  ```

## 📚 项目文件结构

```
├── public/
│   ├── logo.png              # PWA应用图标
│   └── manifest.json         # Web App Manifest (可选)
├── services/
│   ├── api.ts                # API服务
│   └── pwa.ts                # ✨ 新增: PWA服务模块
├── components/               # React组件
├── screens/                  # 页面屏幕
├── index.html                # ✨ 已更新: PWA meta标签
├── vite.config.ts            # ✨ 已更新: PWA配置
├── README.md                 # ✨ 已更新: PWA文档
└── PWA_SETUP.md              # ✨ 新增: 详细设置指南
```

## 🎨 自定义配置

### 更改应用主题颜色
编辑 `vite.config.ts` 中的:
```typescript
theme_color: '#2b8cee'      // 更改为你的颜色
background_color: '#ffffff'  // 更改背景色
```

### 更换应用图标
替换 `public/logo.png` 为你的图标

### 修改应用名称
编辑 `vite.config.ts` 中的:
```typescript
name: 'CloudSync - 你的名称'
short_name: 'CloudSync'
```

## 📝 PWA 服务 API

在 `services/pwa.ts` 中提供了便捷的API:

```typescript
import { registerServiceWorker, checkServiceWorkerUpdates } from '@/services/pwa';

// 注册Service Worker
registerServiceWorker();

// 检查更新
checkServiceWorkerUpdates();
```

## 🆘 常见问题

**Q: 为什么看不到"安装"按钮?**
- A: 需要 HTTPS 连接 (localhost 除外)
- A: 确保 manifest.json 正确加载
- A: 不同浏览器显示位置不同

**Q: 离线时app无法使用?**
- A: 检查 Service Worker 是否已注册
- A: 查看 DevTools > Application > Cache Storage
- A: 首次需要在线访问才能缓存资源

**Q: 怎样清除Service Worker缓存?**
- A: DevTools > Application > Clear storage > Clear all
- A: 或在 Service Worker 标签页卸载

## 🔗 有用的链接

- [vite-plugin-pwa 文档](https://vite-plugin-pwa.vitejs.dev/)
- [MDN Web Docs - PWA](https://developer.mozilla.org/en-US/docs/Web/Progressive_web_apps)
- [Web.dev - PWA 指南](https://web.dev/progressive-web-apps/)
- [Workbox 文档](https://developers.google.com/web/tools/workbox)

## ✅ 检查清单

在部署前确保:

- [ ] npm install 已完成
- [ ] .env.local 文件已配置
- [ ] npm run build 构建成功
- [ ] 在 DevTools 中验证 Manifest 加载
- [ ] 在 DevTools 中验证 Service Worker 注册
- [ ] 测试了离线功能
- [ ] 在目标浏览器中测试了安装功能
- [ ] 部署环境已配置 HTTPS

## 🎉 你已准备好!

现在你的应用是一个完整的PWA了！

享受快速、可靠、可安装的Web应用体验吧！ 🚀


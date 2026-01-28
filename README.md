<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# CloudSync - 云资源管理与传输工具

一款快速、安全、智能的云资源管理与传输工具，现已支持PWA（渐进式Web应用）

View your app in AI Studio: https://ai.studio/apps/drive/1yJGRZZi24sF5k3gnmdaasbGbgfO67bGG

## 功能特性

- ✅ **PWA支持** - 支持离线访问、安装到主屏幕
- 🔐 **安全传输** - 使用Gemini API进行智能处理
- 💨 **快速访问** - 优化的缓存策略和Service Worker
- 📱 **响应式设计** - 完美适配各种设备

## 开发指南

### 前置条件

- Node.js (v18 或更高版本)

### 本地运行

1. 安装依赖：
   ```bash
   npm install
   ```

2. 在 [.env.local](.env.local) 中设置 `GEMINI_API_KEY`：
   ```
   GEMINI_API_KEY=your_api_key_here
   ```

3. 启动开发服务器：
   ```bash
   npm run dev
   ```

   应用将在 `http://localhost:3000` 启动

### 生产构建

```bash
npm run build
```

生成的文件将在 `dist/` 目录中

### 预览生产构建

```bash
npm run preview
```

## PWA 功能

该应用已集成 `vite-plugin-pwa`，提供以下PWA功能：

### 离线支持
- Service Worker自动缓存所有静态资源
- 支持离线访问已访问过的页面

### 可安装性
- 可以安装到移动设备主屏幕或桌面
- 支持iOS和Android平台
- 独立窗口模式运行

### 缓存策略
- **Google Fonts**: CacheFirst策略，缓存1年
- **Tailwind CSS CDN**: CacheFirst策略，缓存1周
- **应用资源**: 自动缓存所有JS、CSS、HTML和图片

### Manifest 配置
- 应用名称、图标、主题颜色已在 `public/manifest.json` 配置
- 应用图标位于 `public/logo.png`

## 项目结构

```
├── components/          # React组件
├── screens/            # 页面屏幕
├── services/           # 服务模块（包括PWA服务）
├── public/             # 静态资源（包括PWA图标和manifest）
├── index.html          # HTML入口（包含PWA meta标签）
├── vite.config.ts      # Vite配置（PWA插件配置）
└── package.json        # 项目依赖
```

## 测试PWA功能

### Chrome/Edge开发工具
1. 打开DevTools (F12)
2. 进入 Application > Manifest
3. 验证manifest是否正确加载
4. 检查Service Worker标签页中的Service Worker状态

### 安装应用
1. 在浏览器地址栏右侧查看"安装"按钮
2. 点击安装，应用将添加到主屏幕或应用菜单

### 离线测试
1. 打开DevTools
2. 进入Network标签
3. 勾选"Offline"
4. 刷新页面，应用应该仍然可用

## 部署

该项目可以部署到任何支持静态文件的服务器，包括：
- Vercel
- Netlify  
- GitHub Pages
- AWS S3
- Azure Static Web Apps

确保服务器配置正确的HTTPS（PWA需要HTTPS）和正确的MIME类型。

## 许可证

MIT

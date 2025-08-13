# emby-tools

## 🚀 项目运行方式

本项目支持两种运行方式：**本地开发运行** 和 **Docker 部署运行**

### 一、本地开发运行（推荐开发环境）

#### 前置要求

- Node.js 18+
- pnpm 包管理器

#### 快速启动

```bash
# 1. 安装所有依赖（前端 + 后端）
pnpm install:all

# 2. 启动开发服务（前后端同时启动）
pnpm dev
```

#### 技术实现

- 使用 `concurrently` 同时启动前端和后端服务
- 前端：Vite 开发服务器（端口 5173）
- 后端：Node.js + Express 服务（端口 3001）

#### 访问地址

- **前端页面**: http://localhost:5173
- **后端 API**: http://localhost:3001
- **API 文档**: http://localhost:3001/rename

### 二、Docker 部署运行（推荐生产环境）

#### 方式一：本地构建镜像

```bash
# 1. 构建镜像
docker build -t dfannn/emby-tools-allinone .

# 2. 运行容器
docker run -d -p 3001:3001 --name emby-tools dfannn/emby-tools-allinone

# 3. 访问服务
# 打开浏览器访问 http://localhost:3001
```

#### 方式二：拉取远程镜像

```bash
# 1. 拉取镜像
docker pull dfannn/emby-tools-allinone

# 2. 运行容器
docker run -d -p 3001:3001 --name emby-tools dfannn/emby-tools-allinone

# 3. 访问服务
# 打开浏览器访问 http://localhost:3001
```

#### 技术特点

- **一体化部署**：前端打包产物自动集成到后端服务
- **自动构建**：Dockerfile 自动完成前端构建和文件复制
- **生产就绪**：优化后的生产环境配置

## 📁 项目结构

```
emby-tools/
├── frontend/          # Vue3 + Vite 前端项目
├── backend/           # Node.js + Express 后端项目
├── package.json       # 根目录脚本配置
├── Dockerfile         # Docker 构建配置
└── README.md          # 项目说明文档
```

## 🔧 开发说明

### 本地开发流程

1. **安装依赖**: `pnpm install:all`
2. **启动服务**: `pnpm dev`
3. **前端开发**: 修改 `frontend/src/` 下的文件
4. **后端开发**: 修改 `backend/src/` 下的文件
5. **热重载**: 前后端都支持热重载，修改后自动重启

### Docker 部署流程

1. **构建镜像**: `docker build -t dfannn/emby-tools-allinone .`
2. **运行容器**: `docker run -d -p 3001:3001 --name emby-tools dfannn/emby-tools-allinone`
3. **访问服务**: 浏览器访问对应端口

## 🌟 特性

- **前后端分离开发**：支持独立开发和调试
- **一体化部署**：Docker 环境下前后端集成部署
- **跨平台支持**：Windows、Linux、macOS 全平台兼容
- **热重载开发**：前后端都支持开发时热重载
- **生产就绪**：Docker 部署优化，开箱即用

## 📝 注意事项

- 本地开发时前端运行在 5173 端口，后端运行在 3001 端口
- Docker 部署时所有服务都通过 3001 端口访问
- 如需修改端口，请同时修改 Dockerfile 和后端配置
- 本地开发需要先运行 `pnpm install:all` 安装所有依赖

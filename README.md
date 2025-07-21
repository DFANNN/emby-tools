# emby-tools

## 🚀 一体化部署与开发说明

### 一、前后端一体化 Docker 部署（推荐生产环境）

1. 构建镜像：
   ```bash
   docker build -t dfannn/emby-tools-allinone .
   ```
2. 运行容器：
   ```bash
   docker run -d -p 3001:3001 --name emby-tools dfannn/emby-tools-allinone
   ```
3. 访问服务：
   打开浏览器访问 http://<你的 NAS 地址>:3001

> Dockerfile 会自动完成前端打包并将产物复制到后端 public 目录，无需手动操作。

### 二、本地开发流程

1. 安装依赖
   ```bash
   cd frontend && pnpm install
   cd ../backend && pnpm install
   ```
2. 前端打包
   ```bash
   cd frontend
   pnpm build
   ```
3. 复制前端产物到后端（自动脚本）
   ```bash
   ./copy-frontend.sh
   ```
4. 启动后端服务
   ```bash
   cd backend
   pnpm start
   ```
5. 访问服务
   打开浏览器访问 http://localhost:3001

### 三、注意事项

- 后端静态资源目录为 `backend/src/public`，前端 build 产物会自动复制到此目录。
- 如需修改端口或其他配置，请根据实际需求调整 Dockerfile 和后端代码。
- 后端需有如下静态资源服务代码（以 Express 为例）：
  ```js
  app.use(express.static(path.join(__dirname, 'public')))
  ```

---

### 自动化脚本说明

- `copy-frontend.sh`：自动将前端 build 产物复制到后端 public 目录，适合本地开发使用。
- Docker 部署时无需手动复制，镜像构建过程会自动完成。

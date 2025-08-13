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

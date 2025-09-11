# 1. 构建前端
FROM node:20 AS frontend-build
WORKDIR /app/frontend
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY frontend .
RUN pnpm build

# 2. 构建后端
FROM node:20 AS backend-build
WORKDIR /app/backend
COPY backend/package.json backend/pnpm-lock.yaml ./
RUN npm install -g pnpm && pnpm install
COPY backend .
# 复制前端产物到后端 public 目录
COPY --from=frontend-build /app/frontend/dist ./src/public

# 3. 运行
EXPOSE 3001
CMD ["pnpm", "start"]
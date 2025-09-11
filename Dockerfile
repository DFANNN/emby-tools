# 1. 前端构建（体积小的 base）
FROM node:20-alpine AS frontend-build
WORKDIR /app/frontend
RUN corepack enable
COPY frontend/package.json frontend/pnpm-lock.yaml ./
RUN pnpm install --frozen-lockfile
COPY frontend .
RUN pnpm build

# 2. 后端依赖（生产依赖）
FROM node:20-alpine AS backend-deps
WORKDIR /app/backend
RUN corepack enable
COPY backend/package.json backend/pnpm-lock.yaml ./
# 仅生产依赖
RUN pnpm install --frozen-lockfile --prod

# 3. 后端打包（拷资源）
FROM node:20-alpine AS backend-build
WORKDIR /app/backend
COPY --from=backend-deps /app/backend/node_modules ./node_modules
COPY backend .
# 拷贝前端产物到后端静态目录
COPY --from=frontend-build /app/frontend/dist ./src/public

# 4. 运行时镜像（最小化）
FROM node:20-alpine
ENV NODE_ENV=production
WORKDIR /app/backend
COPY --from=backend-build /app/backend ./
EXPOSE 3001
CMD ["node", "src/app.js"]
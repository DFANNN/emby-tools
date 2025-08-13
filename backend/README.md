# emby-tools 后端服务

## 依赖包说明

- **express**: Web 应用框架，提供 HTTP 服务器和路由功能
- **cors**: 跨域资源共享中间件，解决前后端分离的跨域问题
- **systeminformation**: 系统信息获取库，跨平台兼容，获取系统中所有磁盘的详细信息
- **cross-env**: 跨平台环境变量设置，确保在不同操作系统上都能正确设置 NODE_ENV

## 启动方式

```bash
# 开发模式
pnpm run dev

# 生产模式
pnpm run start
```

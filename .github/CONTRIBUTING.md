# Contributing Guide

## 分支策略

```
main          ← 生产环境（只接受来自 dev 的 PR）
  └── dev     ← 集成/联调分支
        ├── back-end   ← 后端开发
        └── front-end  ← 前端开发
```

## 开发流程

### 后端开发
1. 在 `back-end` 分支开发
2. 本地测试通过后，开 PR: `back-end → dev`
3. CI 通过后合并
4. Railway Staging 自动部署 `dev` 分支

### 前端开发
1. 在 `front-end` 分支开发
2. 本地测试通过后，开 PR: `front-end → dev`
3. CI 通过后合并
4. Netlify 自动部署 `dev` 分支预览

### 发布到生产
1. 在 `dev` 联调测试通过
2. 开 PR: `dev → main`
3. 合并后 Railway + Netlify 自动部署到生产环境

## 环境变量

### 后端 (Railway)
| 变量 | 说明 |
|---|---|
| `DATABASE_URL` | PostgreSQL 连接字符串 |
| `JWT_SECRET` | JWT 签名密钥 |
| `FRONTEND_URL` | 前端域名（用于 CORS） |
| `NODE_ENV` | `production` |

### 前端 (Netlify)
| 变量 | 说明 |
|---|---|
| `VITE_API_URL` | 后端 API 地址 |

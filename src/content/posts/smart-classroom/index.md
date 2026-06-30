---
title: "Smart Classroom — 智能教室管理系统"
description: "现代化的班级管理系统，支持积分管理、作业管理、卫生管理、随机抽号、数据大屏等功能。"
published: 2026-04-06
image: "https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=smart%20classroom%20management%20system%20dashboard%2C%20student%20score%20leaderboard%2C%20homework%20tracking%2C%20modern%20UI%20with%20blue%20and%20cyan%20colors%2C%20data%20visualization%2C%20clean%20educational%20design&image_size=landscape_16_9"
tags: ["教室管理", "教育", "Node.js", "Express", "Web应用"]
category: "开源项目"
pinned: false
sourceLink: "https://github.com/monologue82/smart-classroom"
licenseName: "Apache-2.0"
licenseUrl: "https://github.com/monologue82/smart-classroom/blob/main/LICENSE"
---

## 项目简介

**Smart Classroom（智能教室管理系统）** 是一个现代化、功能丰富的班级管理系统，提供学生积分管理、作业管理、卫生管理、随机抽号等功能。

无论是班主任、任课老师还是班委，都能通过这个系统高效管理班级日常事务，让班级管理变得简单、透明、有趣。

## 功能特性

| 模块 | 描述 |
|------|------|
| **积分管理** | 学生积分统计、排行榜、加分/扣分操作 |
| **作业管理** | 作业发布、上交情况追踪、历史记录 |
| **卫生管理** | 值日安排、清洁状态管理、历史记录 |
| **随机抽号** | 课堂随机提问功能，抽取范围可设置 |
| **规则管理** | 班级规则自定义 |
| **数据大屏** | 实时数据可视化展示 |
| **系统监控** | 服务器状态监控 |
| **数据备份** | 自动备份与恢复 |

## 技术栈

| 类别 | 技术 |
|------|------|
| **后端** | Node.js + Express + HTTP/2 |
| **前端** | 原生 JavaScript + CSS3 |
| **UI 框架** | LuminaUI |
| **数据存储** | LocalStorage + JSON 文件 |
| **构建工具** | Webpack |

## 快速开始

### 前置要求

- Node.js 14+
- npm 或 yarn

### 安装

```bash
# 克隆仓库
git clone https://github.com/monologue82/smart-classroom.git
cd smart-classroom5.1

# 安装依赖
npm install
```

### 运行

```bash
# 开发模式
npm start

# HTTP/2 模式
npm run start:http2

# HTTPS 模式（需先生成证书）
npm run generate-ssl
npm run start:http2-ssl
```

### 访问

打开浏览器访问：`http://localhost:3000`

> 💡 **注意**：首次使用系统时，请先注册管理员账号并初始化系统数据。

## 功能模块详解

### 登录认证

- 用户登录/登出
- Session 会话管理
- 权限控制

### 控制台

- 功能导航
- 快捷入口
- 系统概览

### 积分管理

- 学生积分查询
- 积分排行榜
- 加分/扣分操作
- 操作记录查看

### 作业管理

- 作业发布
- 上交状态追踪
- 历史记录查询

### 卫生管理

- 值日安排
- 清洁状态标记
- 历史记录

### 随机抽号

- 随机抽取学生
- 抽取范围设置
- 历史记录

### 数据大屏

- 实时数据展示
- 统计图表
- 关键指标监控

## 目录结构

```
smart-classroom5.1/
├── public/                 # 前端资源
│   ├── css/               # 样式文件
│   ├── js/                # JavaScript 文件
│   ├── assets/            # 静态资源
│   ├── LuminaUI/          # UI 组件库
│   └── *.html             # 页面文件
├── src/                   # 后端源码
│   ├── server-http2.js    # HTTP/2 服务器
│   └── generate-ssl.js    # SSL 证书生成
├── data/                  # 数据存储
│   └── backups/           # 数据备份
├── ssl/                   # SSL 证书
├── docs/                  # 文档
├── scripts/               # 脚本
├── package.json           # 项目配置
├── LICENSE                # 开源协议
└── README.md              # 项目说明
```

## 配置说明

### 端口配置

默认端口：3000，可在 `src/server-http2.js` 中修改

### SSL 配置

```bash
# 生成 SSL 证书
npm run generate-ssl
```

### 环境变量

- `USE_SSL=true`：启用 HTTPS

## 部署

### 生产环境部署

```bash
# 构建项目
npm run build

# 启动服务
npm start
```

### 使用 PM2 守护进程

```bash
npm install -g pm2
pm2 start src/server-http2.js --name smart-classroom
```

## 开发指南

### 项目结构说明

- `public/`：所有前端资源
- `src/`：后端服务代码
- `data/`：数据文件存储

### 添加新功能

1. 在 `public/` 中创建对应的 HTML 页面
2. 在 `public/js/` 中添加业务逻辑
3. 在 `public/css/` 中添加样式
4. 如需要后端支持，在 `src/` 中添加 API

### 代码规范

- 使用 ES6+ 语法
- 遵循模块化开发
- 保持代码清晰简洁

## 许可证

本项目采用 **Apache License 2.0** 许可证。

## 联系方式

- 项目主页：[GitHub Repository](https://github.com/monologue82/smart-classroom)
- 问题反馈：[Issues](https://github.com/monologue82/smart-classroom/issues)
- 邮箱：[2627641908@QQ.com](mailto:2627641908@QQ.com)
- B站：[骄傲的狼W0R](https://space.bilibili.com/1741551557)

---

[![Star History Chart](https://api.star-history.com/svg?repos=monologue82/smart-classroom&type=Date)](https://star-history.com/#monologue82/smart-classroom&Date)

欢迎贡献代码！如果觉得项目不错，给个 Star ⭐ 支持一下吧~

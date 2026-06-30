---
title: "MikaScore — MMD 动作评分系统"
description: "基于 MediaPipe 姿态识别的 MMD 动作评分系统，支持实时姿态检测、MMD 模型播放和动作评分可视化。"
published: 2026-04-26
image: "./cover.png"
tags: ["MMD", "动作捕捉", "姿态识别", "MediaPipe", "Python", "Flask", "Three.js"]
category: "开源项目"
pinned: false
sourceLink: "https://github.com/monologue82/MikaScore"
licenseName: "Apache-2.0"
licenseUrl: "https://github.com/monologue82/MikaScore/blob/main/LICENSE"
---

## 项目简介

**MikaScore** 是一个基于 Python 和 Web 技术的 MMD（MikuMikuDance）评分系统。使用 MediaPipe 进行实时姿态识别，支持 MMD 模型加载、动画播放和动作评分，通过 Web 界面进行可视化展示。

想要练习 MMD 舞蹈动作，又不知道自己跳得准不准？MikaScore 可以帮你实时对比动作相似度，给出评分反馈。

## 功能特性

- 🎯 **实时姿态识别**：使用 MediaPipe 进行实时人体姿态检测
- 💃 **MMD 模型支持**：支持加载 MMD 模型并播放动画
- 📊 **动作评分系统**：实时对比并计算动作相似度评分
- 🖥️ **Web 界面**：可视化展示，操作直观
- ⚡ **实时反馈**：即时评分结果和姿态可视化
- 🎨 **3D 渲染**：基于 Reze Engine（Three.js）的高质量渲染

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | Python + Flask |
| **前端** | HTML + CSS + JavaScript |
| **姿态识别** | MediaPipe |
| **3D 渲染** | Reze Engine（基于 Three.js） |

## 第三方依赖

本项目使用了 [Reze Engine](https://github.com/reze-engine/reze-engine) 作为 3D 渲染引擎。该引擎基于 Three.js，用于 MMD 模型的加载和动画渲染。

## 快速开始

### 环境要求

- Python 3.7+
- Node.js（用于前端构建）

### 安装依赖

```bash
# 安装 Python 依赖
pip install -r requirements.txt

# 安装前端依赖
npm install
```

### 启动服务

```bash
# 运行启动脚本
./start.bat

# 或手动启动
python app.py
```

### 访问系统

打开浏览器访问：`http://localhost:5000`

## 项目结构

```
MiKaScore/
├── app/                # 主应用目录
│   ├── routes/         # 路由定义
│   ├── static/         # 静态文件
│   ├── templates/      # HTML 模板
│   └── utils/          # 工具函数
├── mmd/                # MMD 模型和动作文件
│   ├── models/         # MMD 模型
│   └── motion/         # MMD 动作数据
├── models/             # 姿态识别模型
├── reze-engine/        # 3D 渲染引擎
├── app.py              # 应用入口
├── requirements.txt    # Python 依赖
├── start.bat           # 启动脚本
├── LICENSE             # Apache 2.0 许可证
└── README.md           # 项目说明
```

## 使用流程

1. **加载 MMD 模型**：在系统中加载目标 MMD 模型和参考动作
2. **开启摄像头**：启动摄像头捕捉你的动作
3. **实时对比**：系统实时检测你的姿态并与参考动作对比
4. **查看评分**：实时显示动作相似度评分和可视化反馈
5. **改进练习**：根据评分反馈调整动作，不断提高准确度

## 许可证

本项目采用 **Apache 2.0** 许可证，详见 LICENSE 文件。

---

欢迎提交 Issue 和 Pull Request 来改进这个项目！如果觉得有用，给个 Star ⭐ 吧~

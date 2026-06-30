---
title: "AuraMotion — 高精度 MMD 动作捕捉系统"
description: "基于 MediaPipe 的高精度 MMD 动作捕捉系统，支持全身/半身/手部/面部捕捉，直接导出 VMD 动作文件。"
published: 2026-04-26
image: "./cover.png"
tags: ["MMD", "动作捕捉", "MediaPipe", "VMD", "Python", "Flask", "OpenCV"]
category: "开源项目"
pinned: false
sourceLink: "https://github.com/monologue82/AuraMotion"
licenseName: "MIT"
licenseUrl: "https://github.com/monologue82/AuraMotion/blob/main/LICENSE"
---

## 项目简介

**AuraMotion** 是一个功能强大的 MMD（MikuMikuDance）动作捕捉系统，支持高精度的全身、半身、手部和面部表情捕捉。

从图片、视频到摄像头录制，从姿态检测到 VMD 导出，AuraMotion 提供了一站式的 MMD 动作生成解决方案。配合 Reze Engine 实时预览，捕捉结果一目了然。

## 功能特性

| 特性 | 说明 |
|------|------|
| **高精度捕捉** | 使用 MediaPipe 实现高精度的姿势、手部和面部捕捉 |
| **多种输入源** | 支持图片、视频和摄像头录制 |
| **VMD 导出** | 直接导出 MMD 兼容的 VMD 姿势/动作文件 |
| **滑步修复** | 内置滑步修复算法，提升动作质量 |
| **WebUI 界面** | 高端清新风格的 Web 界面 |
| **Reze Engine 预览** | 实时预览捕捉结果 |
| **FFmpeg 集成** | 支持多种视频格式处理 |
| **性能优化** | 针对 i5-13400F、32GB 内存、RTX 5060 配置优化 |

## 系统要求

- Python 3.8+
- Windows 10/11 或 Linux/macOS
- 摄像头（如需摄像头录制）

**推荐配置：**
- CPU: i5-13400F 或更高
- 内存: 32GB DDR4
- GPU: RTX 5060 8GB 或更高

## 快速开始

### Windows 系统

1. 双击运行 `start.bat`
2. 等待依赖安装完成
3. 在浏览器中打开 <http://localhost:5000>

### Linux/macOS 系统

```bash
chmod +x start.sh
./start.sh
```

### 手动安装

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# Linux/macOS:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 启动服务器
cd src
python app.py
```

## 使用说明

### 1. 选择捕捉模式

- **全身捕捉**：捕捉全身动作
- **半身捕捉**：专注于上半身动作

### 2. 选择输入源

**上传文件：**
- 支持格式：JPG、PNG、MP4、AVI、MOV 等
- 拖拽或点击上传区域选择文件

**摄像头录制：**
- 点击「开启摄像头」
- 点击「开始录制」录制动作
- 点击「停止录制」完成

### 3. 配置选项

- **修复滑步问题**：启用滑步修复算法
- **手部捕捉**：启用高精度手部关键点检测
- **面部表情捕捉**：启用面部表情捕捉

### 4. 开始捕捉

点击「开始捕捉」按钮，系统将：

1. 分析输入内容
2. 检测关键点
3. 生成 VMD 文件
4. 显示预览

### 5. 预览和下载

- 使用播放控制查看捕捉结果
- 点击「下载 VMD 文件」获取结果

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | Flask |
| **计算机视觉** | MediaPipe、OpenCV |
| **视频处理** | FFmpeg |
| **深度学习** | PyTorch（预留） |
| **前端** | 原生 HTML/CSS/JS |

## 核心模块

### PoseDetector（姿势检测）

使用 MediaPipe 的三个模型协同工作：

- **Pose**：身体姿势检测（33 个关键点）
- **Hands**：手部关键点检测（每只手 21 个关键点）
- **FaceMesh**：面部表情捕捉（468 个面部关键点）

### VMDExporter（VMD 导出）

- 支持单帧姿势导出
- 支持多帧动作导出
- 内置滑步修复算法
- MediaPipe 到 MMD 骨骼映射

### VideoProcessor（视频处理）

- 支持多种视频格式
- 自动格式转换
- 视频信息提取
- 帧提取和预览生成

## 项目结构

```
AuraMotion/
├── src/
│   ├── __init__.py
│   ├── app.py              # Flask 后端
│   ├── pose_detector.py    # 姿势检测模块
│   ├── vmd_exporter.py     # VMD 导出模块
│   └── video_processor.py  # 视频处理模块
├── static/
│   ├── css/style.css       # 样式文件
│   ├── js/app.js           # 前端逻辑
│   └── reze/               # Reze Engine 资源
├── templates/
│   └── index.html          # 前端页面
├── uploads/                # 上传文件目录
├── outputs/                # 输出文件目录
├── models/                 # 模型目录
├── example/                # 示例目录
├── requirements.txt        # Python 依赖
├── start.bat              # Windows 启动脚本
├── start.sh               # Linux/macOS 启动脚本
└── README.md
```

## 常见问题

**Q: 支持哪些 MMD 模型？**

A: 理论上支持所有标准骨骼结构的 MMD 模型。

**Q: 滑步修复是如何工作的？**

A: 通过分析脚部运动速度，检测脚部接触地面状态，并保持位置稳定。

**Q: 可以实时捕捉吗？**

A: 当前版本专注于高精度非实时捕捉，未来可能添加实时功能。

## 未来规划

- [ ] 支持更多 MMD 骨骼映射
- [ ] 添加动作编辑功能
- [ ] 实现实时捕捉预览
- [ ] 支持更多导出格式
- [ ] 添加动作库功能
- [ ] 优化手部捕捉精度

## 参考项目

- FreeMoCap
- MiKaPo
- OpenMMD

## 许可证

**MIT License**

---

欢迎提交 Issue 和 Pull Request！如果项目对你有帮助，欢迎 Star ⭐ 支持~

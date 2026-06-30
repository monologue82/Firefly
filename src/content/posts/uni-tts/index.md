---
title: "Uni-TTS — 一站式多引擎语音合成平台"
description: "集成 GPT-SoVITS、CosyVoice、Qwen3-TTS 等 8 大 TTS 引擎的统一管理平台，一键安装、统一界面、模型内置下载。"
published: 2026-06-27
image: "./cover.png"
tags: ["TTS", "语音合成", "AI", "Python", "Vue", "自托管"]
category: "开源项目"
pinned: true
sourceLink: "https://github.com/monologue82/Uni-TTS"
licenseName: "CC BY-NC-SA 4.0"
licenseUrl: "https://github.com/monologue82/Uni-TTS/blob/main/LICENSE"
---

## 项目简介

**Uni-TTS** 是一个一站式多引擎语音合成平台，将当前主流的 8 大 TTS 引擎整合到同一个 Web 界面中，一键安装、统一管理、灵活切换。

不再需要为每个 TTS 引擎单独配置环境，不再需要在不同的 Gradio 界面之间反复切换。Uni-TTS 让所有引擎在同一个平台上共存，各取所长。

## 核心特性

- 🚀 **一键安装**：每个引擎独立虚拟环境，自动安装，无依赖冲突
- 🎯 **统一界面**：所有引擎在同一个 Web 界面中管理，切换便捷
- 📦 **模型管理**：内置模型下载管理，支持 ModelScope / HuggingFace 源
- 🔧 **灵活配置**：支持 GPU / CPU 切换，Flash Attention 可选
- 🎨 **美观界面**：现代化 Vue 3 + Element Plus 前端，操作直观
- 🔊 **ASR 集成**：内置语音识别，自动填充参考音频文本
- ⚡ **并行加载**：多引擎可同时加载，互不干扰

## 支持的引擎

| 引擎 | 描述 | 最小显存 |
|------|------|----------|
| **GPT-SoVITS** | 1分钟语音数据即可训练高质量 TTS 模型 | 4 GB |
| **CosyVoice** | 阿里多语言大语音生成模型 | 4 GB |
| **Qwen3-TTS** | 通义千问 3 秒语音克隆，支持 10 种语言 | 6 GB |
| **IndexTTS-2** | B站情感丰富、时长可控的零样本 TTS | 4 GB |
| **LuxTTS** | 轻量高速，1GB 显存即可 150 倍实时 | 1 GB |
| **VoxCPM 2** | 清华无分词器 TTS，30 种语言 48kHz | 8 GB |
| **MOSS-TTS** | 复旦开源语音全家桶，高保真长文本 | 4 GB |
| **Fish Audio S2 Pro** | 15000+ 情感标签，80+ 语言，100ms 首帧 | 8 GB |

## 快速开始

### 环境要求

- Python 3.10+
- Node.js 18+
- （可选）NVIDIA GPU + CUDA 12.1+

### 安装与启动

```bash
# 克隆仓库
git clone https://github.com/monologue82/Uni-TTS.git
cd Uni-TTS

# 推荐使用虚拟环境
python -m venv .venv
.venv\Scripts\activate  # Windows
# source .venv/bin/activate  # Linux/Mac

# 安装后端依赖
pip install -r requirements.txt

# 启动（会自动安装前端依赖）
python start.py
```

启动后访问：

- 前端界面：<http://localhost:5173>
- 后端 API：<http://localhost:8000>

## 使用流程

### 1. 安装引擎

进入「引擎管理」页面，点击需要的引擎卡片上的「安装」按钮，等待自动安装完成。

每个引擎都有独立的虚拟环境，完全隔离，不会出现依赖冲突。

### 2. 下载模型

进入「模型管理」页面，选择引擎后点击「下载」按钮下载对应模型。

支持 ModelScope 和 HuggingFace 双源下载，国内访问更流畅。

### 3. 启动推理

回到主页，点击引擎卡片，选择「启动推理」或「Gradio 界面」，等待模型加载完成即可使用。

## 项目结构

```
Uni-TTS/
├── backend/          # 后端 (FastAPI)
│   ├── api/          # API 路由
│   ├── engines/      # 推理服务器
│   └── db/           # 数据库
├── frontend/         # 前端 (Vue 3 + Element Plus)
│   └── src/
├── engines/          # 各引擎源码（安装后生成）
├── venvs/            # 各引擎虚拟环境（安装后生成）
├── models/           # 模型文件（下载后生成）
└── start.py          # 启动脚本
```

## 技术栈

| 层级 | 技术 |
|------|------|
| **后端** | FastAPI + Python |
| **前端** | Vue 3 + Element Plus + Vite |
| **TTS 引擎** | GPT-SoVITS、CosyVoice、Qwen3-TTS、IndexTTS-2 等 |
| **ASR** | 内置语音识别 |
| **模型源** | ModelScope、HuggingFace |

## 许可证

本项目采用 **Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)** 许可证。

**简要说明（非法律建议，仅供参考）：**

- ✅ **允许**：复制、分发、修改、改编本作品
- ✅ **要求**：必须署名、以相同协议发布、注明修改
- ❌ **禁止**：不得用于商业用途

各子引擎遵循其各自的开源协议，请在使用时遵守对应协议。

---

> ⚠️ **免责声明**：本项目仅供学习研究使用，请勿用于任何非法用途。使用本项目生成的音频内容，使用者自行承担相关责任。

如果觉得项目不错，欢迎给个 ⭐ Star

---
title: "Vox Engine Framework — 实时语音识别与翻译系统"
description: "基于 FunASR/SenseVoice 的流式实时语音识别系统，支持多引擎翻译、流式 TTS 输出、Web 界面管理。"
published: 2026-04-05
image: "./cover.png"
tags: ["ASR", "语音识别", "翻译", "TTS", "Python", "Flask", "AI"]
category: "开源项目"
pinned: false
sourceLink: "https://github.com/monologue82/Vox-Engine-Framework"
licenseName: "MIT"
licenseUrl: "https://github.com/monologue82/Vox-Engine-Framework/blob/main/LICENSE"
---

## 项目简介

**Vox Engine Framework** 是一个实时语音识别与翻译系统，支持流式输出。由 FunASR/SenseVoice 驱动高性能离线 ASR，配合多种 AI 翻译引擎后端，打造从语音到文字、从原文到译文、再到语音播报的完整流水线。

无论是实时字幕生成、视频会议翻译，还是外语学习辅助，Vox Engine 都能胜任。

## 核心特性

| 特性 | 说明 |
|------|------|
| **实时语音识别** | FunASR + SenseVoiceSmall 模型，GPU 加速流式 ASR |
| **多引擎翻译** | 支持 LPS、vLLM、Ollama、LM Studio 四种翻译后端 |
| **流式输出** | 识别和翻译结果均支持实时流式显示 |
| **语音合成** | GSV-TTS-Lite 驱动，支持流式播放 |
| **流式 TTS** | 翻译片段到达即播放，支持自动朗读 |
| **麦克风管理** | 多设备选择与切换 |
| **智能分批翻译** | 累积 ASR 文本，根据内容长度智能分批 |
| **有序翻译** | 服务端序号机制，防止翻译结果乱序 |
| **ASR 缓存持久化** | 跨分片 FunASR 缓存，保持流式上下文 |
| **实时监控** | 识别置信度、翻译延迟、音频电平、字符计数 |
| **Web 界面** | 现代化响应式 UI，支持亮/暗主题 |

## 系统架构

### 后端技术栈

| 组件 | 技术 |
|------|------|
| Web 框架 | Flask + Flask-SocketIO |
| ASR 引擎 | FunASR + SenseVoiceSmall |
| 翻译 | LPS (llama.cpp / OpenAI 兼容)、vLLM、Ollama、LM Studio |
| TTS 引擎 | GSV-TTS-Lite（基于嵌入的声音克隆） |
| 异步运行时 | eventlet + threading |
| 音频处理 | PyAudio + Web Audio API |
| 缓存 | LRU Cache with TTL |

### 前端技术栈

| 组件 | 技术 |
|------|------|
| 核心 | HTML5 + CSS3 + JavaScript |
| 实时通信 | Socket.IO |
| 音频采集 | Web Audio API (MediaStream) |
| 音频处理 | AudioWorklet + ScriptProcessor |
| 设计系统 | 温暖色调的定制化编辑设计 |

## 系统要求

### 最低配置

- **操作系统**: Windows 10/11
- **Python**: 3.11+
- **内存**: 8GB
- **存储**: 10GB 可用空间
- **GPU**: 推荐（NVIDIA + CUDA）

### 推荐配置

- **操作系统**: Windows 11
- **Python**: 3.13
- **内存**: 16GB+
- **GPU**: NVIDIA GPU + CUDA 12+
- **存储**: 50GB+ SSD

## 快速开始

### 1. 克隆仓库

```bash
git clone https://github.com/monologue82/Vox-Engine-Framework.git
cd Vox-Engine-Framework
```

### 2. 安装依赖

#### 方案 A：使用安装脚本（推荐）

```bash
setup.bat
```

#### 方案 B：手动安装

```bash
# 创建虚拟环境
python -m venv venv

# 激活虚拟环境
.\venv\Scripts\activate

# 安装依赖
pip install -r requirements.txt
```

> **注意**：如需 CUDA 12+ GPU 支持，请单独安装 PyTorch：
> ```bash
> pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu132
> ```

### 3. 启动系统

```bash
start.bat
```

或手动启动：

```bash
.\venv\Scripts\activate
python app.py
```

### 4. 访问界面

打开浏览器访问：

- **主页面**: <http://localhost:5000/app>
- **设置页**: <http://localhost:5000/settings>

## Web 界面一览

系统提供现代化的 Web 界面，包含以下页面：

| 路由 | 页面 | 描述 |
|------|------|------|
| `/app` | 主应用 | 实时 ASR、翻译、TTS 界面 |
| `/settings` | 设置 | 麦克风、翻译引擎、TTS、主题配置 |
| `/start` | 启动页 | 系统启动与状态概览 |
| `/loading` | 加载页 | 模型加载进度显示 |
| `/asr_debug` | ASR 调试 | 原始 ASR 输出检查器 |
| `/translation_debug` | 翻译调试 | 翻译流检查器 |
| `/tts_debug` | TTS 调试 | TTS 音频块调试 |
| `/tts_only_debug` | 纯 TTS 测试 | 独立 TTS 测试页面 |

## 翻译引擎配置

### LPS（本地处理系统）— 默认

系统默认使用 LPS 作为翻译提供者，支持两种后端：

**OpenAI 兼容**（推荐）：连接任何 OpenAI 兼容服务器（LM Studio、llama-server、Ollama、vLLM）

```json
{
  "lps": {
    "backend": "openai_compatible",
    "openai_url": "http://localhost:8080/v1"
  }
}
```

**llama.cpp**：直接使用本地 GGUF 模型

```json
{
  "lps": {
    "backend": "llama_cpp",
    "models_dir": "models/translate",
    "default_model": "models/translate/your-model.gguf"
  }
}
```

### vLLM

```bash
pip install vllm
# 系统会自动启动 vLLM 服务
```

### Ollama

1. 下载并安装 [Ollama](https://ollama.com/)
2. 启动服务：`ollama serve`
3. 拉取模型：`ollama pull qwen2.5:3b`

### LM Studio

1. 下载 [LM Studio](https://lmstudio.ai/)
2. 加载模型并启动本地推理服务器
3. 在 Web 界面设置中设置 API URL

## TTS 配置

系统支持流式 TTS，具备以下特性：

- **音色选择**：多种预设音色（Jenny、晓晓、小艺等）
- **流式播放**：翻译片段到达即播放 TTS 音频
- **自动朗读**：自动朗读翻译后的文本
- **语速控制**：可调节语音速度

## 项目结构

```
Vox-Engine-Framework/
├── app.py                         # 主应用入口 (Flask + SocketIO)
├── funasr_asr.py                  # FunASR 流式 ASR 接口
├── api_engine_routes.py           # API 引擎路由
├── config.json                    # 系统配置
├── settings.json                  # 用户设置
├── requirements.txt               # Python 依赖
├── LICENSE                        # MIT 许可证
├── DESIGN.md                      # 设计系统文档
├── README.md                      # 英文文档
├── README-CN.md                   # 中文文档
│
├── config/                        # 配置文件
│   ├── engines.json              # 翻译引擎定义
│   ├── languages.json            # 支持的语言
│   ├── translation_styles.json   # 翻译风格预设
│   ├── vllm_models.json          # vLLM 模型注册表
│   └── user_presets/             # 用户自定义预设
│
├── static/                        # 静态资源
│   ├── css/style.css             # 主样式表
│   ├── js/main.js                # 主应用 JavaScript
│   ├── audio-processor.js        # 音频处理管线
│   └── icons/                    # 服务商图标
│
├── templates/                     # HTML 模板
│   ├── index.html                # 主应用页面
│   ├── settings.html             # 设置页面
│   ├── start.html                # 启动页面
│   ├── loading.html              # 加载页面
│   └── *_debug.html              # 各类调试页面
│
├── test/                          # 测试套件
│   ├── test_asr_baseline.py      # ASR 基线测试
│   ├── test_full_pipeline.py     # 端到端流水线测试
│   └── test_streaming_asr.py     # 流式 ASR 测试
│
├── models/                        # 模型文件（单独下载）
│   ├── stt/                      # 语音识别模型
│   ├── translate/                # 翻译模型
│   └── tts/                      # TTS 模型
│
├── setup.bat                      # 安装脚本
├── start.bat                      # 启动脚本
├── stop.bat                       # 停止脚本
└── repair.bat                     # 修复脚本
```

## 性能优化建议

1. **使用 SSD 存储** — 模型加载速度显著提升
2. **GPU 加速** — NVIDIA GPU + CUDA 12+ 可加速 FunASR 和翻译
3. **调整分片大小** — 更小的分片（2048）降低延迟，更大的分片（8192）提升识别准确率
4. **本地翻译** — 本地运行 LPS 消除网络延迟
5. **线程池调优** — 在 config.json 中调整 `performance.max_threads`

## 许可证

本项目采用 **MIT License** 许可证。

---

> 📝 **注意**：本项目仅供学习研究使用。使用各 AI 模型时，请遵守相应的许可协议。

如果项目对你有帮助，欢迎给个 Star ⭐

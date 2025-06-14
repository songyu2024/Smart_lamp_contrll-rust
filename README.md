# Lamp 🌟

<div align="center">
  <img src="https://img.shields.io/badge/Tauri-2.0-blue?style=for-the-badge&logo=tauri" alt="Tauri">
  <img src="https://img.shields.io/badge/Rust-1.70+-orange?style=for-the-badge&logo=rust" alt="Rust">
  <img src="https://img.shields.io/badge/JavaScript-ES6-yellow?style=for-the-badge&logo=javascript" alt="JavaScript">
  <img src="https://img.shields.io/badge/CSS3-Flexbox-blue?style=for-the-badge&logo=css3" alt="CSS3">
</div>

<!-- Language Switch -->
<div align="center">
  <a href="#english">English</a> | 
  <a href="#中文">中文</a> | 
  <a href="#日本語">日本語</a>
</div>

---

## English

### 🎨 Design Inspiration
Inspired by **Apple's WWDC 2025** fluid glass design language, featuring mesmerizing liquid glass effects with advanced backdrop blur and dynamic distortion filters.

### ✨ Features
- 🕐 **Digital Clock** - Elegant DS-Digital font display with real-time updates
- 🌈 **Dynamic Backgrounds** - Random beautiful images via API integration
- 💡 **Brightness Control** - Hardware PWM control with glass-morphism slider
- ⏱️ **Countdown Timer** - 2026 Gaokao exam countdown with motivational quotes
- 🌤️ **Weather Widget** - Real-time weather information display
- 🎭 **Fluid Glass UI** - Apple-inspired liquid glass morphism effects
- 🖱️ **Interactive Gestures** - Long press navigation, click to refresh
- 📱 **Responsive Design** - Optimized for various screen sizes

### 🛠️ Technology Stack
- **Frontend**: Vanilla JavaScript, CSS3, HTML5
- **Backend**: Rust with Tauri framework
- **Hardware**: Raspberry Pi GPIO control (RPi compatible)
- **APIs**: Weather API, Hitokoto quotes, Random image APIs

### 🚀 Quick Start

#### Prerequisites
- Rust 1.70+
- Node.js 16+
- Tauri CLI

#### Installation
```bash
# Clone the repository
git clone https://github.com/yourusername/lamp.git
cd lamp

# Install dependencies
npm install

# Development mode
npm run tauri dev

# Build for production
npm run tauri build
```

#### Hardware Setup (Raspberry Pi)
```bash
# Enable GPIO and PWM
sudo raspi-config

# Install additional dependencies
sudo apt update
sudo apt install build-essential
```

### 🎮 Usage
- **Single Click Clock**: Change background image
- **Long Press Clock**: Navigate to countdown page
- **Brightness Slider**: Adjust hardware brightness (0-100%)
- **Weather Card**: Click to switch to anime backgrounds
- **Quote Card**: Click to refresh motivational quotes

### 📁 Project Structure
```
lamp/
├── src/                    # Frontend source
│   ├── index.html         # Main clock page
│   ├── countdown.html     # Countdown page
│   ├── styles.css         # Main styles
│   ├── countdown.css      # Countdown styles
│   ├── script.js          # Main logic
│   └── countdown.js       # Countdown logic
├── src-tauri/             # Rust backend
│   ├── src/
│   │   ├── main.rs        # Entry point
│   │   └── lib.rs         # Core logic & GPIO
│   ├── Cargo.toml         # Rust dependencies
│   └── tauri.conf.json    # Tauri configuration
└── front/                 # Fonts and assets
```

### 🤝 Contributing
1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### 📄 License
This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 中文

### 🎨 设计灵感
受 **Apple WWDC 2025** 流体玻璃设计语言启发，采用迷人的液态玻璃效果，配合先进的背景模糊和动态扭曲滤镜。

### ✨ 功能特性
- 🕐 **数字时钟** - 优雅的 DS-Digital 字体显示，实时更新
- 🌈 **动态背景** - 通过 API 集成随机精美图片
- 💡 **亮度控制** - 硬件 PWM 控制，配合玻璃拟态滑块
- ⏱️ **倒计时器** - 2026年高考倒计时，附带励志语录
- 🌤️ **天气组件** - 实时天气信息显示
- 🎭 **流体玻璃界面** - Apple 风格液态玻璃拟态效果
- 🖱️ **交互手势** - 长按导航，点击刷新
- 📱 **响应式设计** - 适配各种屏幕尺寸

### 🛠️ 技术栈
- **前端**: 原生 JavaScript, CSS3, HTML5
- **后端**: Rust + Tauri 框架
- **硬件**: 树莓派 GPIO 控制（兼容 RPi）
- **接口**: 天气 API、一言 API、随机图片 API

### 🚀 快速开始

#### 环境要求
- Rust 1.70+
- Node.js 16+
- Tauri CLI

#### 安装步骤
```bash
# 克隆仓库
git clone https://github.com/yourusername/lamp.git
cd lamp

# 安装依赖
npm install

# 开发模式
npm run tauri dev

# 生产构建
npm run tauri build
```

#### 硬件设置（树莓派）
```bash
# 启用 GPIO 和 PWM
sudo raspi-config

# 安装额外依赖
sudo apt update
sudo apt install build-essential
```

### 🎮 使用方法
- **单击时钟**: 更换背景图片
- **长按时钟**: 导航到倒计时页面
- **亮度滑块**: 调节硬件亮度（0-100%）
- **天气卡片**: 点击切换到动漫背景
- **语录卡片**: 点击刷新励志语录

### 🤝 贡献指南
1. Fork 本仓库
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

### 📄 开源协议
本项目基于 MIT 协议开源 - 查看 [LICENSE](LICENSE) 文件了解详情。

---

## 日本語

### 🎨 デザインインスピレーション
**Apple WWDC 2025** の流体ガラスデザイン言語からインスパイアされ、魅惑的な液体ガラス効果と高度な背景ぼかし・動的歪みフィルターを特徴としています。

### ✨ 機能
- 🕐 **デジタル時計** - DS-Digitalフォントでエレガントな表示、リアルタイム更新
- 🌈 **動的背景** - API統合による美しいランダム画像
- 💡 **明度制御** - ハードウェアPWM制御とガラスモーフィズムスライダー
- ⏱️ **カウントダウンタイマー** - 2026年高考試験カウントダウンと励志的な名言
- 🌤️ **天気ウィジェット** - リアルタイム天気情報表示
- 🎭 **流体ガラスUI** - Apple風液体ガラスモーフィズム効果
- 🖱️ **インタラクティブジェスチャー** - 長押しナビゲーション、クリックで更新
- 📱 **レスポンシブデザイン** - 様々な画面サイズに最適化

### 🛠️ 技術スタック
- **フロントエンド**: バニラJavaScript, CSS3, HTML5
- **バックエンド**: Rust + Tauriフレームワーク
- **ハードウェア**: Raspberry Pi GPIO制御（RPi対応）
- **API**: 天気API、一言API、ランダム画像API

### 🚀 クイックスタート

#### 前提条件
- Rust 1.70+
- Node.js 16+
- Tauri CLI

#### インストール
```bash
# リポジトリをクローン
git clone https://github.com/yourusername/lamp.git
cd lamp

# 依存関係をインストール
npm install

# 開発モード
npm run tauri dev

# 本番ビルド
npm run tauri build
```

#### ハードウェア設定（Raspberry Pi）
```bash
# GPIOとPWMを有効化
sudo raspi-config

# 追加依存関係をインストール
sudo apt update
sudo apt install build-essential
```

### 🎮 使用方法
- **時計をシングルクリック**: 背景画像を変更
- **時計を長押し**: カウントダウンページへナビゲート
- **明度スライダー**: ハードウェア明度調整（0-100%）
- **天気カード**: クリックでアニメ背景に切り替え
- **名言カード**: クリックで励みになる名言を更新

### 🤝 コントリビューション
1. リポジトリをフォーク
2. 機能ブランチを作成 (`git checkout -b feature/AmazingFeature`)
3. 変更をコミット (`git commit -m 'Add some AmazingFeature'`)
4. ブランチにプッシュ (`git push origin feature/AmazingFeature`)
5. プルリクエストを開く

### 📄 ライセンス
このプロジェクトはMITライセンスの下でライセンスされています - 詳細は[LICENSE](LICENSE)ファイルをご覧ください。

---

<div align="center">
  <p>Made with ❤️ and inspired by Apple's design philosophy</p>
  <p>Apple デザイン哲学にインスパイアされ、❤️ で作成</p>
  <p>Apple設計理念に啓発され、❤️で製作</p>
</div>

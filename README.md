# NetScope - Network Request Monitor | 网络请求监控工具

[English](#english) | [中文](#chinese)

<a name="english"></a>
## NetScope - Network Request Monitor

A powerful tool for monitoring and analyzing network requests in real-time, providing comprehensive domain statistics and export capabilities.

### ✨ Features

- 🔍 **Real-time Monitoring** - Capture all network requests including resources and API calls
- 📊 **Domain Statistics** - Automatic domain deduplication and request counting
- 🎯 **Smart Filtering** - Filter and analyze requests by domain
- 📋 **Export Options** - Export domain lists in JSON format with clipboard support
- 🌐 **Bilingual Support** - Full English and Chinese language support
- 🎨 **Modern UI** - Clean and intuitive user interface

### 🚀 Quick Start

#### Option 1: Chrome Extension (Recommended)

The Chrome extension provides comprehensive network monitoring without cross-origin limitations.

**Installation:**
1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" in the top right
3. Click "Load unpacked"
4. Select the `chrome-extension` folder
5. The NetScope icon will appear in your browser toolbar

**Usage:**
1. Visit any website you want to monitor
2. Click the NetScope extension icon
3. Click "Start Monitoring Current Tab"
4. Browse the website - all requests will be captured
5. Click "Export Domain List" to get deduplicated domains
6. Data is automatically copied to clipboard

#### Option 2: Standalone HTML

A standalone version with limited functionality due to browser security policies.

1. Open `netscope.html` in your browser
2. Enter the URL to monitor
3. Click "Start Monitoring"
4. The tool will load the site in an iframe and monitor requests

**Note:** Due to same-origin policy, this version has limitations.

### 📁 File Structure

```
netscope/
├── chrome-extension/          # Chrome extension files
│   ├── manifest.json         # Extension manifest
│   ├── background.js         # Background service worker
│   ├── popup.html/js         # Extension popup UI
│   └── _locales/            # Language files
├── netscope.html             # Standalone HTML version
└── README.md                 # Documentation
```

### 📊 Output Format

The exported JSON includes:

```json
{
  "domains": ["example.com", "api.example.com"],
  "statistics": {
    "totalDomains": 2,
    "totalRequests": 45,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "details": [
    {
      "domain": "example.com",
      "count": 30
    }
  ]
}
```

### 🔧 Technical Details

- **Chrome Extension**: Uses WebRequest API for comprehensive monitoring
- **Standalone Version**: Uses Performance Observer API and request interception
- Automatic domain deduplication (same domain, different paths count as one)
- Real-time statistics updates

### 📝 License

MIT License

---

<a name="chinese"></a>
## NetScope - 网络请求监控工具

一款功能强大的网络请求实时监控和分析工具，提供全面的域名统计和导出功能。

### ✨ 功能特点

- 🔍 **实时监控** - 捕获所有网络请求，包括资源和API调用
- 📊 **域名统计** - 自动域名去重和请求计数
- 🎯 **智能过滤** - 按域名过滤和分析请求
- 📋 **导出选项** - 支持JSON格式导出域名列表，支持剪贴板复制
- 🌐 **双语支持** - 完整的中英文语言支持
- 🎨 **现代界面** - 清晰直观的用户界面

### 🚀 快速开始

#### 方案一：Chrome扩展（推荐）

Chrome扩展提供全面的网络监控，不受跨域限制。

**安装步骤：**
1. 打开Chrome浏览器，访问 `chrome://extensions/`
2. 开启右上角的"开发者模式"
3. 点击"加载已解压的扩展程序"
4. 选择 `chrome-extension` 文件夹
5. NetScope图标将出现在浏览器工具栏

**使用方法：**
1. 访问要监控的网站
2. 点击NetScope扩展图标
3. 点击"开始监控当前标签页"
4. 浏览网站 - 所有请求将被捕获
5. 点击"导出域名列表"获取去重后的域名
6. 数据自动复制到剪贴板

#### 方案二：独立HTML版本

独立版本由于浏览器安全策略功能有限。

1. 在浏览器中打开 `netscope.html`
2. 输入要监控的URL
3. 点击"开始监控"
4. 工具将在iframe中加载网站并监控请求

**注意：** 由于同源策略，此版本有一定限制。

### 📁 文件结构

```
netscope/
├── chrome-extension/          # Chrome扩展文件
│   ├── manifest.json         # 扩展清单
│   ├── background.js         # 后台服务脚本
│   ├── popup.html/js         # 扩展弹窗界面
│   └── _locales/            # 语言文件
├── netscope.html             # 独立HTML版本
└── README.md                 # 文档说明
```

### 📊 输出格式

导出的JSON包含：

```json
{
  "domains": ["example.com", "api.example.com"],
  "statistics": {
    "totalDomains": 2,
    "totalRequests": 45,
    "timestamp": "2024-01-01T12:00:00.000Z"
  },
  "details": [
    {
      "domain": "example.com",
      "count": 30
    }
  ]
}
```

### 🔧 技术细节

- **Chrome扩展**：使用WebRequest API进行全面监控
- **独立版本**：使用Performance Observer API和请求拦截
- 自动域名去重（相同域名不同路径算作一个）
- 实时统计更新

### 📝 许可证

MIT许可证

---

## Author | 作者

Built with ❤️ by NetScope Team

## Support | 支持

If you find this tool helpful, please give it a ⭐ on GitHub!
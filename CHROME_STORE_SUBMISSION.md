# 📋 Chrome Web Store 发布完整指南

## ✅ 准备工作已完成

1. ✅ **扩展已优化** - manifest.json已更新，支持国际化
2. ✅ **隐私政策** - PRIVACY_POLICY.md已创建
3. ✅ **商店描述** - 中英文描述已准备（见store-assets/STORE_LISTING.md）
4. ✅ **扩展打包** - netscope-extension.zip (7.5KB)
5. ✅ **宣传图片生成器** - store-assets/generate-promo-images.html

---

## 🚀 发布步骤指南

### 步骤 1：注册开发者账户

1. 访问 [Chrome Web Store Developer Dashboard](https://chrome.google.com/webstore/devconsole)
2. 使用Google账号登录
3. 支付一次性注册费 **$5 USD**
4. 填写开发者信息：
   - 开发者名称
   - 邮箱地址
   - 国家/地区

### 步骤 2：生成宣传图片

1. 在浏览器中打开：`store-assets/generate-promo-images.html`
2. 下载以下图片：
   - **Small Promo Tile** (440x280px) - 必需
   - **Screenshots 1-5** - 至少需要1张，建议5张
   - Large Promo Tile (920x680px) - 可选，用于推荐展示
   - Marquee Promo (1400x560px) - 可选，用于特别推广

### 步骤 3：创建新项目

1. 在Developer Dashboard中点击 **"New Item"**
2. 上传 `netscope-extension.zip`
3. 等待文件验证完成

### 步骤 4：填写商店列表信息

#### 基本信息
- **扩展名称**: NetScope - Network Request Monitor
- **简短描述**: Monitor and analyze all network requests in real-time. Track domains, filter requests, and export comprehensive statistics.
- **类别**: Developer Tools
- **语言**: English (主要), Chinese Simplified

#### 详细描述
从 `store-assets/STORE_LISTING.md` 复制详细描述

#### 图片资源
上传之前生成的图片：
- Small Promo Tile ✅ (必需)
- Screenshots ✅ (至少1张，最多5张)

### 步骤 5：隐私设置

#### 权限说明
在"Privacy practices"部分，说明每个权限的用途：
- **webRequest**: Monitor network requests for analysis
- **tabs**: Identify which tab to monitor
- **activeTab**: Only monitor the currently active tab
- **storage**: Save user language preference
- **<all_urls>**: Capture requests from any website when monitoring is active

#### 数据使用声明
选择以下选项：
- ❌ This extension does NOT collect user data
- ✅ This extension handles user data locally only
- ❌ This extension does NOT sell user data

#### 隐私政策
1. 将 `PRIVACY_POLICY.md` 上传到GitHub
2. 使用链接：`https://github.com/channely/netscope/blob/main/PRIVACY_POLICY.md`

### 步骤 6：定价和分发

- **定价**: Free
- **可见性**: Public
- **国家/地区**: All regions (所有地区)

### 步骤 7：提交审核

1. 检查所有必填项 ✅
2. 预览商店页面
3. 点击 **"Submit for Review"**

### 步骤 8：等待审核

- 通常需要 **1-3个工作日**
- 复杂扩展可能需要更长时间
- 会通过邮件收到审核结果

---

## 📝 审核可能遇到的问题

### 常见拒绝原因及解决方案：

1. **权限过度**
   - 我们的权限都是必需的，已在隐私政策中说明

2. **描述不准确**
   - 确保描述与实际功能一致

3. **隐私政策缺失**
   - 使用提供的PRIVACY_POLICY.md

4. **图标/截图质量**
   - 使用生成器创建高质量图片

---

## 📊 发布后维护

### 更新版本
1. 修改 `manifest.json` 中的version
2. 重新打包zip文件
3. 在Dashboard上传新版本
4. 等待审核（通常比初审快）

### 监控指标
- 安装数量
- 用户评分
- 评论反馈
- 崩溃报告

### 用户支持
- GitHub Issues: https://github.com/channely/netscope
- 及时回复用户评论
- 定期更新修复bug

---

## 🎯 发布检查清单

- [ ] 开发者账户已注册（$5）
- [ ] netscope-extension.zip 已准备
- [ ] 宣传图片已生成（至少Small Promo + 1张截图）
- [ ] 商店描述已准备（中英文）
- [ ] 隐私政策已上传到GitHub
- [ ] 权限说明已准备
- [ ] 测试扩展功能正常

---

## 💡 提示

1. **第一次提交**通常审核较严格，耐心等待
2. **节假日期间**审核可能延迟
3. **保持更新**以维持用户信任
4. **回复评论**提高用户满意度
5. **监控崩溃报告**及时修复问题

---

## 🆘 需要帮助？

- Chrome Web Store帮助中心：https://support.google.com/chrome_webstore
- 开发者论坛：https://groups.google.com/a/chromium.org/g/chromium-extensions
- 我们的GitHub：https://github.com/channely/netscope/issues

祝发布顺利！🚀
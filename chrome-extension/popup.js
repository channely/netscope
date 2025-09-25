let isMonitoring = false;
let currentTabId = null;
let currentLang = 'en';

// Language messages (fallback for direct access)
const messages = {
    en: {
        headerTitle: "Network Monitor",
        statusReady: "Ready",
        statusMonitoring: "Monitoring...",
        statusStopped: "Monitoring stopped",
        statusDataCleared: "Data cleared",
        statusCopied: "Domain list copied to clipboard",
        btnStartMonitor: "Start Monitoring Current Tab",
        btnStopMonitor: "Stop Monitoring",
        btnExport: "Export Domain List",
        btnClear: "Clear Data",
        statRequests: "Total Requests",
        statDomains: "Domains",
        emptyState: "No data available",
        confirmClear: "Are you sure you want to clear all data?",
        noDataExport: "No data to export"
    },
    zh_CN: {
        headerTitle: "网络监控",
        statusReady: "准备就绪",
        statusMonitoring: "正在监控...",
        statusStopped: "监控已停止",
        statusDataCleared: "数据已清除",
        statusCopied: "域名列表已复制到剪贴板",
        btnStartMonitor: "开始监控当前标签页",
        btnStopMonitor: "停止监控",
        btnExport: "导出域名列表",
        btnClear: "清除数据",
        statRequests: "总请求数",
        statDomains: "域名数量",
        emptyState: "暂无数据",
        confirmClear: "确定要清除所有数据吗？",
        noDataExport: "暂无数据可导出"
    }
};

// Get message with fallback
function getMessage(key) {
    // Try Chrome i18n first
    let message = chrome.i18n.getMessage(key);
    if (message) return message;
    
    // Fallback to local messages
    return messages[currentLang][key] || messages.en[key] || key;
}

// i18n localization
function localizeUI() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        element.textContent = getMessage(messageKey);
    });
}

// Switch language
async function switchLanguage(lang) {
    currentLang = lang;
    
    // Save language preference
    await chrome.storage.local.set({ language: lang });
    
    // Update UI language
    localizeUI();
    updateUI();
    
    // Update language switcher buttons
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === lang);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
    // Load saved language preference
    const result = await chrome.storage.local.get('language');
    currentLang = result.language || chrome.i18n.getUILanguage().replace('-', '_') || 'en';
    
    // Ensure valid language
    if (!['en', 'zh_CN'].includes(currentLang)) {
        currentLang = 'en';
    }
    
    // Set initial language button state
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.classList.toggle('active', btn.getAttribute('data-lang') === currentLang);
    });
    
    // Localize UI
    localizeUI();
    
    // 获取当前标签页
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    currentTabId = tab.id;
    
    // 初始化UI
    updateUI();
    loadData();
    
    // 绑定事件
    document.getElementById('startBtn').addEventListener('click', startMonitoring);
    document.getElementById('stopBtn').addEventListener('click', stopMonitoring);
    document.getElementById('exportBtn').addEventListener('click', exportDomains);
    document.getElementById('clearBtn').addEventListener('click', clearData);
    
    // Language switcher
    document.querySelectorAll('.lang-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const lang = btn.getAttribute('data-lang');
            switchLanguage(lang);
        });
    });
    
    // 监听数据更新
    chrome.runtime.onMessage.addListener((request) => {
        if (request.action === 'dataUpdated') {
            loadData();
        }
    });
});

async function startMonitoring() {
    await chrome.runtime.sendMessage({
        action: 'startMonitoring',
        tabId: currentTabId
    });
    
    isMonitoring = true;
    updateUI();
    showStatus(getMessage('statusMonitoring'), 'monitoring');
}

async function stopMonitoring() {
    await chrome.runtime.sendMessage({
        action: 'stopMonitoring'
    });
    
    isMonitoring = false;
    updateUI();
    showStatus(getMessage('statusStopped'), 'idle');
}

async function loadData() {
    const response = await chrome.runtime.sendMessage({ action: 'getData' });
    
    isMonitoring = response.isMonitoring;
    
    // 更新统计
    document.getElementById('totalRequests').textContent = response.requests.length;
    document.getElementById('domainCount').textContent = response.domains.length;
    
    // 更新域名列表
    const domainList = document.getElementById('domainList');
    if (response.domains.length > 0) {
        // 按请求数量排序
        const sortedDomains = response.domains.sort((a, b) => b.count - a.count);
        
        domainList.innerHTML = sortedDomains.map(item => `
            <div class="domain-item">
                <span class="domain-name">${item.domain}</span>
                <span class="domain-count">${item.count}</span>
            </div>
        `).join('');
    } else {
        domainList.innerHTML = `<div class="empty-state">${getMessage('emptyState')}</div>`;
    }
    
    updateUI();
}

async function exportDomains() {
    const response = await chrome.runtime.sendMessage({ action: 'getData' });
    
    if (response.domains.length === 0) {
        alert(getMessage('noDataExport'));
        return;
    }
    
    const exportText = document.getElementById('exportText');
    const domainList = document.getElementById('domainList');
    
    // 获取去重后的域名列表
    const domains = response.domains.map(item => item.domain).sort();
    const exportData = {
        domains: domains,
        statistics: {
            totalDomains: domains.length,
            totalRequests: response.requests.length,
            timestamp: new Date().toISOString()
        },
        details: response.domains.map(item => ({
            domain: item.domain,
            count: item.count
        }))
    };
    
    // 显示导出文本
    exportText.style.display = 'block';
    domainList.style.display = 'none';
    exportText.value = JSON.stringify(exportData, null, 2);
    exportText.select();
    
    // 复制到剪贴板
    document.execCommand('copy');
    showStatus(getMessage('statusCopied'), 'monitoring');
    
    // 3秒后恢复
    setTimeout(() => {
        exportText.style.display = 'none';
        domainList.style.display = 'block';
        updateUI();
    }, 3000);
}

async function clearData() {
    if (confirm(getMessage('confirmClear'))) {
        await chrome.runtime.sendMessage({ action: 'clearData' });
        loadData();
        showStatus(getMessage('statusDataCleared'), 'idle');
    }
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const status = document.getElementById('status');
    
    if (isMonitoring) {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        status.textContent = getMessage('statusMonitoring');
        status.className = 'status monitoring';
    } else {
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        status.textContent = getMessage('statusReady');
        status.className = 'status idle';
    }
}

function showStatus(message, type = 'idle') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
}
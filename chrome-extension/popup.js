let isMonitoring = false;
let currentTabId = null;

// i18n localization
function localizeUI() {
    document.querySelectorAll('[data-i18n]').forEach(element => {
        const messageKey = element.getAttribute('data-i18n');
        element.textContent = chrome.i18n.getMessage(messageKey);
    });
}

document.addEventListener('DOMContentLoaded', async () => {
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
    showStatus(chrome.i18n.getMessage('statusMonitoring'), 'monitoring');
}

async function stopMonitoring() {
    await chrome.runtime.sendMessage({
        action: 'stopMonitoring'
    });
    
    isMonitoring = false;
    updateUI();
    showStatus(chrome.i18n.getMessage('statusStopped'), 'idle');
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
        domainList.innerHTML = `<div class="empty-state">${chrome.i18n.getMessage('emptyState')}</div>`;
    }
    
    updateUI();
}

async function exportDomains() {
    const response = await chrome.runtime.sendMessage({ action: 'getData' });
    
    if (response.domains.length === 0) {
        alert(chrome.i18n.getMessage('noDataExport'));
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
    showStatus(chrome.i18n.getMessage('statusCopied'), 'monitoring');
    
    // 3秒后恢复
    setTimeout(() => {
        exportText.style.display = 'none';
        domainList.style.display = 'block';
        updateUI();
    }, 3000);
}

async function clearData() {
    if (confirm(chrome.i18n.getMessage('confirmClear'))) {
        await chrome.runtime.sendMessage({ action: 'clearData' });
        loadData();
        showStatus(chrome.i18n.getMessage('statusDataCleared'), 'idle');
    }
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const status = document.getElementById('status');
    
    if (isMonitoring) {
        startBtn.style.display = 'none';
        stopBtn.style.display = 'block';
        status.textContent = chrome.i18n.getMessage('statusMonitoring');
        status.className = 'status monitoring';
    } else {
        startBtn.style.display = 'block';
        stopBtn.style.display = 'none';
        status.textContent = chrome.i18n.getMessage('statusReady');
        status.className = 'status idle';
    }
}

function showStatus(message, type = 'idle') {
    const status = document.getElementById('status');
    status.textContent = message;
    status.className = `status ${type}`;
}
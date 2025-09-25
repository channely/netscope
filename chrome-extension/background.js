let monitoringTabId = null;
let requests = [];
let domains = new Map();

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startMonitoring':
      startMonitoring(request.tabId);
      sendResponse({ success: true });
      break;
    case 'stopMonitoring':
      stopMonitoring();
      sendResponse({ success: true });
      break;
    case 'getData':
      sendResponse({
        requests: requests,
        domains: Array.from(domains.entries()).map(([domain, reqs]) => ({
          domain: domain,
          count: reqs.length,
          requests: reqs
        })),
        isMonitoring: monitoringTabId !== null
      });
      break;
    case 'clearData':
      clearData();
      sendResponse({ success: true });
      break;
  }
  return true;
});

function startMonitoring(tabId) {
  monitoringTabId = tabId;
  requests = [];
  domains.clear();
  
  // 监听网络请求
  chrome.webRequest.onBeforeRequest.addListener(
    captureRequest,
    { tabId: monitoringTabId, urls: ["<all_urls>"] },
    ["requestBody"]
  );
  
  chrome.webRequest.onCompleted.addListener(
    captureResponse,
    { tabId: monitoringTabId, urls: ["<all_urls>"] }
  );
}

function stopMonitoring() {
  monitoringTabId = null;
  chrome.webRequest.onBeforeRequest.removeListener(captureRequest);
  chrome.webRequest.onCompleted.removeListener(captureResponse);
}

function captureRequest(details) {
  if (details.tabId !== monitoringTabId) return;
  
  try {
    const url = new URL(details.url);
    const domain = url.hostname;
    
    const requestData = {
      url: details.url,
      domain: domain,
      type: details.type,
      method: details.method,
      timestamp: details.timeStamp,
      requestId: details.requestId
    };
    
    requests.push(requestData);
    
    // 更新域名统计
    if (!domains.has(domain)) {
      domains.set(domain, []);
    }
    domains.get(domain).push(requestData);
    
    // 通知popup更新
    chrome.runtime.sendMessage({
      action: 'dataUpdated',
      data: {
        totalRequests: requests.length,
        domainCount: domains.size
      }
    }).catch(() => {
      // Popup可能未打开，忽略错误
    });
  } catch (e) {
    console.error('Error capturing request:', e);
  }
}

function captureResponse(details) {
  // 可以在这里处理响应信息
  const request = requests.find(r => r.requestId === details.requestId);
  if (request) {
    request.statusCode = details.statusCode;
    request.responseTime = details.timeStamp - request.timestamp;
  }
}

function clearData() {
  requests = [];
  domains.clear();
}
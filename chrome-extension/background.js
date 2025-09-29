let isMonitoring = false;
let requests = [];
let domains = new Map();

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  switch (request.action) {
    case 'startMonitoring':
      startMonitoring();
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
        isMonitoring: isMonitoring
      });
      break;
    case 'clearData':
      clearData();
      sendResponse({ success: true });
      break;
  }
  return true;
});

function startMonitoring() {
  isMonitoring = true;
  requests = [];
  domains.clear();
  
  // 监听所有网络请求（不限制特定标签页）
  chrome.webRequest.onBeforeRequest.addListener(
    captureRequest,
    { urls: ["<all_urls>"] },
    ["requestBody"]
  );
  
  chrome.webRequest.onCompleted.addListener(
    captureResponse,
    { urls: ["<all_urls>"] }
  );
}

function stopMonitoring() {
  isMonitoring = false;
  chrome.webRequest.onBeforeRequest.removeListener(captureRequest);
  chrome.webRequest.onCompleted.removeListener(captureResponse);
}

function captureRequest(details) {
  try {
    const url = new URL(details.url);
    const domain = url.hostname;
    
    const requestData = {
      url: details.url,
      domain: domain,
      type: details.type,
      method: details.method,
      timestamp: details.timeStamp,
      requestId: details.requestId,
      tabId: details.tabId
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
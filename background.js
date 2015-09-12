
(function() {
	// 爱奇艺视频播放页面伪装成Nexus5的chrome浏览器
	chrome.webRequest.onBeforeSendHeaders.addListener(
		function(details) {
			for (var key in details.requestHeaders) {
				if (details.requestHeaders[key].name == 'User-Agent') {
					details.requestHeaders[key].value = 'Mozilla/5.0 (Linux; Android 4.4.4; Nexus 5 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.114 Mobile Safari/537.36';
				}
			}
			return {requestHeaders: details.requestHeaders};
		},
		{urls: ['http://*.iqiyi.com/v_*.html*']},
		['blocking', 'requestHeaders']
	);
})();


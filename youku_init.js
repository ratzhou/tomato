
function onVideoInfoReady() {
	for (var lang in window._langs) {
		if (lang == 'ready') {
			continue;
		}
		$('#language-selector').append('<option value="' + lang + '">' + lang + '</option>');
	}
	$('#language-selector').change();
}

(function() {
	// 初始化页面消息监听器
	window._langs = {};
	window.addEventListener('message', function(event) {
		if (event.source != window) {
			return;
		}

		var message = event.data;
		if (message.type == 'videoinfo') {
			var videoinfo = message.videoinfo;
			var allowed_types = {'3gphd': 1, 'mp4': 1};
			for (var lang in videoinfo._videoSegsDic.streams) {
				var streams = videoinfo._videoSegsDic.streams;
				window._langs[lang] = {};
				for (var type in streams[lang]) {
					if (allowed_types[type]) {
						window._langs[lang][type] = [];
						for (var index = 0; index < streams[lang][type].length; ++index) {
							window._langs[lang][type][index] = streams[lang][type][index].src;
						}
					}
				}
			}
			window._langs.ready = true;

			if ($('#language-selector').length > 0) {
				onVideoInfoReady();
			}
		}
	});
})();

(function() {
	var func = function() {
		(function() {
			var console = window.console;
			var log = console.log;

			var setter = HTMLScriptElement.prototype.__lookupSetter__('src');
			Object.defineProperty(HTMLScriptElement.prototype, 'src', {
				set: function(url) {
					if (url.indexOf('http://play.youku.com/play/get.json') === 0) {
						window.console = console;
						window.console.log = log;
						if (!BuildVideoInfo.old_response) {
							BuildVideoInfo.old_response = BuildVideoInfo.response;
							BuildVideoInfo.response = function (a) {
								if (a.data.stream[a.data.stream.length - 1].stream_type.indexOf('flv') == -1) {
									a.data.trial = {
										type: 'episodes',
										time: 999999
									};
								}

								var ret = BuildVideoInfo.old_response(a);
								if (checkSrc) {
									checkSrc = function(){};
								}

								// 发送视频信息给扩展
								window.postMessage({type: 'videoinfo', videoinfo: BuildVideoInfo._videoInfo}, '*');
								return ret;
							}
						}
					}
					setter.apply(this, Array.prototype.slice.call(arguments));
				}
			});
		})();

		(function() {
			Object.defineProperty(window.navigator, 'userAgent', {
				value: 'Mozilla/5.0 (Linux; Android 4.4.4; Nexus 5 Build/KTU84P) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/38.0.2125.114 Mobile Safari/537.36'
			});
		})();
	};
	
	var observer = new MutationObserver(function(mutations, observer) {
		mutations.forEach(function(mutation) {
			for (var index = 0; index < mutation.addedNodes.length; ++index) {
				var node = mutation.addedNodes.item(index);
				if (node.tagName == 'HEAD') {
					var script = document.createElement('script');
					script.innerHTML = '(' + func.toString() + ')()';
					if (node.firstChild) {
						node.insertBefore(script, node.firstChild);
					} else {
						node.appendChild(script);
					}
					observer.disconnect();
					break;
				}
			}
		});
	});

	observer.observe(document.documentElement, {childList: true, subtree: true});
})();


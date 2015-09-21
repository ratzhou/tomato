
// 修改script element行为
(function() {
	var func = function() {
		var setter = HTMLScriptElement.prototype.__lookupSetter__('src');
		Object.defineProperty(HTMLScriptElement.prototype, 'src', {
			set: function(url) {
				if (url.indexOf('http://cache.m.iqiyi.com/jp/tmts/') === 0) {
					var match = /callback=([^&]+)/.exec(url);
					if (match) {
						var callback = match[1];
						if (!window['_' + callback] && window[callback]) {
							window['_' + callback] = window[callback];
							window[callback] = function(data) {
								if (data.data) {
									data.status = 'A00015';
									data.data.ds = 'A00015';
								}
								return window['_' + callback](data);
							};
						}
					}
				}
				setter.apply(this, Array.prototype.slice.call(arguments));
			}
		});
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


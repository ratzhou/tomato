
// 修改script element行为
(function() {
	var func = function() {
		var setter = HTMLScriptElement.prototype.__lookupSetter__('src');
		Object.defineProperty(HTMLScriptElement.prototype, 'src', {
			set: function(url) {
				if (url.indexOf('http://cache.m.iqiyi.com/jp/tmts/') === 0) {
					if (!window._jsonp1) {
						window._jsonp1 = window.jsonp1;
						window.jsonp1 = function(data) {
							if (data.data && data.data.vipInfo) {
								data.status = 'A00015';
								data.data.ds = 'A00015';
								console.log(data);
							}
							return window._jsonp1(data);
						};
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


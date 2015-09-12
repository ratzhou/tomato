
// 修改script element行为
(function() {
	var func = function() {
		var setter = HTMLScriptElement.prototype.__lookupSetter__('src');
		Object.defineProperty(HTMLScriptElement.prototype, 'src', {
			set: function(url) {
				if (url.indexOf('http://cache.m.iqiyi.com/jp/tmts/') === 0) {
					if (document['tmts'] == undefined) {
						// 第一次请求
						document['tmts'] = 1;
						var xhr = new XMLHttpRequest;
						xhr.open('GET', url);
						xhr.onreadystatechange = function() {
							if (this.readyState == 4) {
								var regexp = /(\({.*}\))/;
								var data = eval(regexp.exec(this.responseText)[1]);
								var url = data.data.m3u;
								var video = document.getElementById('video');
								video.src = url;
								video.play();
							}
						};
						xhr.send();
					}
					return;
				}
				setter.apply(this, Array.prototype.slice.call(arguments));
			}
		});
	};

	document.documentElement.setAttribute('onreset', '(' + func + ')()');
	document.documentElement.dispatchEvent(new Event('reset'));
	document.documentElement.removeAttribute('onreset');
})();


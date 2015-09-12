
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

	document.documentElement.setAttribute('onreset', '(' + func + ')()');
	document.documentElement.dispatchEvent(new Event('reset'));
	document.documentElement.removeAttribute('onreset');
})();


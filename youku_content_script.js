
(function() {
	// 在页面上保存扩展id
	$('body').append('<div id="__tomato__"></div>');
	$('#__tomato__').attr('extension_id', chrome.runtime.id);

	// 修改页面样式
	$('body').css('width', '1024px').css('margin', 'auto');
	$('#player').css('width', '1024px').css('height', '630px');

	// 创建视频选择控件
	var selector = $('<div id="video-selector"></div>');
	selector.css('height', '30px');
	selector.append('<span>选择语言：<select id="language-selector"></select></span> <span>选择类型：<select id="type-selector"></select></span> <span>章节<select id="section-selector"></select></span>');

	// 创建视频容器
	var container = $('<div id="video-container"></div>');
	container.css('height', '600px').css('width', '100%');

	// 创建视频
	var video = $('<video id="video-player"></video>');
	video.css('width', '100%').css('height', '100%').attr('controls', 'true');
	container.append(video);

	var parent = $('#player').parent();
	parent.children().remove();
	parent.append('<div id="player-wrapper"></div>');
	$('#player-wrapper').append(selector).append(container);

	// 播放视频
	function playVideo(src) {
		$('#video-player').attr('src', src);
		$('#video-player').get()[0].load();
		$('#video-player').get()[0].play();
	}

	// 注册视频事件处理
	$('#video-player').bind('ended', function(e) {
		var lang = $('#language-selector').val();
		var type = $('#type-selector').val();
		var section = $('#section-selector').val();
		var next_section = parseInt(section) + 1;

		if ($('#section-selector').find('[value=' + next_section + ']').length > 0) {
			// 还有下一个章节
			$('#section-selector').val(next_section);
			$('#section-selector').change();
		}
	});

	$('#section-selector').change(function() {
		var lang = $('#language-selector').val();
		var type = $('#type-selector').val();
		var section = $('#section-selector').val();
		var src = window._langs[lang][type][section];
		playVideo(src);
	});
	$('#type-selector').change(function() {
		var lang = $('#language-selector').val();
		var type = $('#type-selector').val();

		$('#section-selector').children().remove();
		for (var section = 0; section < window._langs[lang][type].length; ++section) {
			$('#section-selector').append('<option value="' + section + '">' + section + '</option>');
		}
		$('#section-selector').change();
	});
	$('#language-selector').change(function() {
		var lang = $(this).val();

		$('#type-selector').children().remove();
		for (var type in window._langs[lang]) {
			$('#type-selector').append('<option value="' + type + '">' + type + '</option>');
		}
		$('#type-selector').change();
	});

	if (window._langs.ready) {
		onVideoInfoReady();
	}
})();


(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				if (manifest[i].id === 'snd01') {
					api.initSound(manifest[i].src, callback, endCallback, onPauseCallback);
				} else {
					api.initSound(manifest[i].src, callback, defaultEndCallback);
				}
            }
        }
        init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';
    var eMove = touchDevice ? 'touchmove' : 'mousemove';
	
	var callback = {
        onSoundCreated: function (sound, src) {
            var sndID = _.findWhere(manifest, {src: src}).id;
            sounds[sndID] = sound;
        }
    };
	var defaultEndCallback = {
		onEnd: function () {
        }
	};
	var endCallback = {
		onEnd: function () {
			isPlaying = false;
			$('#playBtn').attr('class', 'button');
        }
	};
	var onPauseCallback = {
		onPause: function () {
			isPlaying = false;
			$('#playBtn').attr('class', 'button');
		}
	};
	var sounds = {};
	var currentSound;
	var isPlaying = false;
	var sentences = [];
	var todo = 0;
    
	function init() {
		
		$('#resetBtn').on(eDown, function(e) {
			e.preventDefault();
			$('#resetBtn').attr('class', 'over');
			setTimeout(function() { 
				resetSim();
			}, 100);
		});
		
		$('#playBtn').on(eDown, function(e) {
			e.preventDefault();
			isPlaying = !isPlaying;
			if (isPlaying) {
				sounds.snd01.play();
				$('#playBtn').attr('class', 'button-pressed');
			} else {
				sounds.snd01.stop();
				$('#playBtn').attr('class', 'button');
			}
		});
		
		for(var i=0;i<texts.length;i++){
			var arr = [];
			var txtArr = texts[i].split(" ");
			for(var j=0;j<txtArr.length;j++){
				if (txtArr[j].indexOf("#") != -1)
					txtArr[j] = txtArr[j].split("#").join(" ");
					
				var hidden = (txtArr[j].indexOf("(") != -1);
				if (hidden) {
					var prevSylabee = arr[arr.length - 1];
					prevSylabee.good = true;
					todo++;
				}
				
				var clickable = (nonClickable.indexOf(txtArr[j]) == -1);
				if (!clickable)
					arr.push( {txt:"#"} );
	
				var obj = { txt:txtArr[j], clickable:clickable, hidden:hidden };
				arr.push(obj);
			}
			sentences.push(arr);
		}
		
		
		var str = '';
		
		for(var i=0;i<sentences.length;i++){
			var tArr = sentences[i];

			for(var j=0;j<tArr.length;j++){
				var obj = tArr[j]
				var txt = obj.txt;
				if (txt != "#") {
					var ok = (obj.good) ? true : false;
					var pressed = false;
					var hidden = (obj.hidden) ? true : false;
					var cls = [(hidden ? 'el-hidden' : ''), (obj.clickable ? 'el-clickable' : ''), (hidden ? 'el-good' : 'el-default')];
					var tf;
					
					if (cls.join('') === 'el-default') {
						// ! , . ?
						tf = '<span class="el-default">' + txt + '</span>';
						str += tf + ' ';
					} else {
						if (hidden) {
							txt = (j ? ' ' : '') + txt;
						}
						tf = '<span class="' + cls.join(' ') + '" data-ok="' + ok + '" data-pressed="false" data-hidden="' + hidden + '" data-row="' + i + '" data-col="' + j + '">' + txt + '</span>';
						if (j < tArr.length - 2) {
							var nextObj = tArr[j+1];
							str += tf + (nextObj.clickable && !ok ? ' ' : '');
						} else {
							str += tf;
						}
					}
				}
			}
			str += '<br/>';
		}
		
		$('#txt')
			.html(str)
			.css({
				left: position.x + 'px',
				top: position.y + 'px'
			});
		
		$('.el-clickable').on(eDown, sylaPress);
		
	}
	
	function sylaPress(e) {
		e.preventDefault();
		
		var sylabeeMC = $(e.target);
		var isOk = null;
		var pressed = !(sylabeeMC.attr('data-pressed') === 'true');
		var ok = (sylabeeMC.attr('data-ok') === 'true');
		var row = parseInt(sylabeeMC.attr('data-row'));
		var col = parseInt(sylabeeMC.attr('data-col'));
		var sylabeeMC2 = $('#txt').find('span[data-row=' + row + '][data-col=' + (col + 1) + ']');
		
		sylabeeMC.attr('data-pressed', pressed ? 'true' : 'false');
		
		if (pressed) {
			if (ok) {
				sylabeeMC.addClass('el-stroked');
				sylabeeMC2.css('display', 'inline');
				isOk = true;
			} else {
				sylabeeMC.addClass('el-wrong');
				isOk = false;
			}
		} else {
			sylabeeMC.removeClass('el-wrong');
			sylabeeMC.removeClass('el-stroked');
			if (sylabeeMC2 && sylabeeMC2.hasClass('el-hidden')) {
				sylabeeMC2.hide();
			}
		};
		
		check(true, isOk);
	}
	
	function check(playFeed, isOk) {
		var done = 0;
		var errors = 0;
		
		for(var i=0;i<sentences.length;i++){
			var tArr = sentences[i];
			for(var j=0;j<tArr.length;j++){
				var sylabeeMC = $('#txt').find('span[data-row=' + i + '][data-col=' + j + ']');
				var pressed = (sylabeeMC.attr('data-pressed') === 'true');
				var ok = (sylabeeMC.attr('data-ok') === 'true');
				if (ok && pressed)
					done++;
				else if ((!ok && pressed) || (ok && !pressed))
					errors++;
			}
		}

		if (done === todo && !errors) {
			isPlaying = false;
			sounds.snd01.stop();
			$('#playBtn').attr('class', 'button');
			
			if (playFeed) {
				sounds.allOk.play();
			}
			$('.el-clickable').off(eDown).addClass('inactive');
			$('#allOk').css('visibility', 'visible');
		} else if (isOk === true && playFeed) {
			sounds.ok.play();
		} else if (isOk === false && playFeed) {
			sounds.wrong.play();
		}
	}
	
	function resetSim() {
		isPlaying = false;
		sounds.snd01.stop();
		$('#playBtn').attr('class', 'button');
		$('#resetBtn').attr('class', 'button');
		$('#allOk').css('visibility', 'hidden');
		$('.el-hidden').hide();
		$('.el-wrong').removeClass('el-wrong');
		$('.el-stroked').removeClass('el-stroked');
		
		$('.el-clickable')
			.off(eDown)
			.removeClass('inactive')
			.on(eDown, sylaPress)
			.attr('data-pressed', 'false');
	}
	
    p.reset = function () {
		
	};
	
    p.loadState = function (obj) {
		var arr = obj.pressedArr;
		for(var i=0;i<sentences.length;i++){
			var tArr = sentences[i];
			for(var j=0;j<tArr.length;j++){
				var sylabeeMC = $('#txt').find('span[data-row=' + i + '][data-col=' + j + ']');
				var ok = (sylabeeMC.attr('data-ok') === 'true');
				var pressed = arr[i][j];
				if (pressed) {
					sylabeeMC.attr('data-pressed', 'true');
					var sylabeeMC2 = $('#txt').find('span[data-row=' + i + '][data-col=' + (j + 1) + ']');
					if (ok) {
						sylabeeMC.addClass('el-stroked');
						sylabeeMC2.css('display', 'inline');
					} else {
						sylabeeMC.addClass('el-wrong');
					}
				}
			}
		}
		check(false, null);
	};
	
    p.saveState = function () {
		var arr = [];
		for(var i=0;i<sentences.length;i++){
			var tArr = sentences[i];
			arr[i] = [];
			for(var j=0;j<tArr.length;j++){
				var sylabeeMC = $('#txt').find('span[data-row=' + i + '][data-col=' + j + ']');
				var pressed = (sylabeeMC.attr('data-pressed') === 'true');
				arr[i][j] = pressed;
			}
		}
        return {
			pressedArr: arr
		};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);
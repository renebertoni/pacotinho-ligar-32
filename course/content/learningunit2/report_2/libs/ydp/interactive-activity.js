(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < audios.length; i++) {
			api.initSound(audios[i].src, audios[i].onLoad, audios[i].onEnd, audios[i].onPause);
		}
        init();
    };

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp = touchDevice ? 'touchend' : 'mouseup';
    var eMove = touchDevice ? 'touchmove' : 'mousemove';
	
	var todo = [{timefrom:68000, timeto:70000, done:false},
				{timefrom:85000, timeto:87000, done:false},
				{timefrom:110000, timeto:112000, done:false}];
		
	//---
	var onFinishCurrAudio = null;
	var innerDisrupt;
	var soundsPreloaded = 0;
	var soundsToPreload = 0;
	var sounds = {};
	var callbackOnLoad = {
		onSoundCreated: function (sound, src) {
			var sndID = _.findWhere(audios, {src: src}).id;
			sounds[sndID] = sound;
		}
	};
	var callbackOnEnd = {
		onEnd: function () {
			console.log('end');
			if(onFinishCurrAudio != null){
				onFinishCurrAudio();
			}
		}
	};
	var callbackOnEnd2 = {
		onEnd: function () {
			console.log('end');
			innerDisrupt = true;
			setTimeout(function() {
				innerDisrupt = false;
			}, 10);
			finish();
		}
	};
	var callbackOnPause = {
		onPause: function () {
			console.log('pause');
			if(soundsPreloaded < soundsToPreload){
				soundsPreloaded += 1;
				return;
			}
		}
	};
	var callbackOnPause2 = {
		onPause: function () {
			console.log('pause2', innerDisrupt, soundsPreloaded, soundsToPreload);
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			if(soundsPreloaded < soundsToPreload){
				soundsPreloaded += 1;
				return;
			}
			
			$('.button-start').removeClass('button-start-on');
			if(interval != null){
				clearInterval(interval);
			}
			timeSaved = timeSaved + timePlayed;
			timePlayed = 0;
			$('.button-bzzz').css('pointer-events', 'none');
		}
	};
	var audios = [{id:'lector', src: './sounds/y10_u79_p2_008au.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd2, onPause:callbackOnPause2},
				{id:'bzzz', src: './sounds/bzzz.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'ok', src: './sounds/ok.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'wrong', src: './sounds/wrong.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause},
				{id:'allok', src: './sounds/allOk.mp3', onLoad:callbackOnLoad, onEnd:callbackOnEnd, onPause:callbackOnPause}];
	var audiosPreloaded = false;
	var isStarted = false;
	//---
	
	var timeStart;
	var interval;
	var timePlayed;
	var timeSaved;
	var timeTotal = 129478;
	
	p.resizeDiv = function(scale) {
		var scl = 'scale(' + scale + ')';
		$('.ia-container').find('.ia-incont').css({
			'transform': scl,
			'-webkit-transform': scl,
			'-moz-transform': scl,
			'-o-transform': scl,
			'transform-origin': '0 0',
			'-webkit-transform-origin': '0 0',
			'-moz-transform-origin': '0 0',
			'-o-transform-origin': '0 0'
		});
	}
	
    function init() {
		localReset();
		
		$('.button-reset').on(eDown, function(e){
			e.preventDefault();
			preloadSounds()
			localReset();
			$('.button-reset').addClass('button-reset-on');
			
			$(document).on(eUp, function(e){
				e.preventDefault();
				$('.button-reset').removeClass('button-reset-on');
				$(document).off(eUp);
			});
		});
		
		$('.button-start').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			
			if($('.button-start').hasClass('button-start-on')){
				$('.button-start').removeClass('button-start-on');
				audios[0].snd.pause();
				if(interval != null){
					clearInterval(interval);
				}
				timeSaved = timeSaved + timePlayed;
				timePlayed = 0;
				$('.button-bzzz').css('pointer-events', 'none');
			}
			else{
				$('.button-start').addClass('button-start-on');
				
				if(isStarted){
					audios[0].snd.resume();
					timePlayed = 0;
				}
				else{
					isStarted = true;
					setAudio(0, 0, null);
					timePlayed = 0;
					timeSaved = 0;
				}
				
				var d = new Date();
				timeStart = d.getTime();
				interval = setInterval(updateTime, 100);
				$('.button-bzzz').css('pointer-events', 'auto');
			}
		});
		
		$('.button-bzzz').on(eDown, function(e){
			e.preventDefault();
			preloadSounds();
			$('.button-bzzz').addClass('button-bzzz-on');
			
			var bool = false;
			for(var i=0; i<todo.length; i++){
				var t = timePlayed + timeSaved;
				if(t >= todo[i].timefrom && t <= todo[i].timeto && !todo[i].done){
					todo[i].done = true;
					update();
					setAudio(2, 1, null);
					bool = true;
				}
			}
			if(!bool){
				setAudio(1, 1, null);
			}
				
			$(document).on(eUp, function(e){
				e.preventDefault();
				$('.button-bzzz').removeClass('button-bzzz-on');
				$(document).off(eUp);
			});
		});
    }
	
	function preloadSounds(){
		if(!audiosPreloaded){
			for(var i=0; i<audios.length; i++){
				setAudio(i);
				audios[i].snd.stop();
				soundsToPreload += 1;
			}
			audiosPreloaded = true;
		}
	}
	
	function finish(){
		$('.button-start').removeClass('button-start-on');
		$('.button-start').css('pointer-events', 'none');
		$('.button-bzzz').css('pointer-events', 'none');
		isStarted = false;
		if(interval != null){
			clearInterval(interval);
		}
		$('.allok').removeClass('tryagain');
		for(var i=0; i<todo.length; i++){
			if(!todo[i].done && !$('.allok').hasClass('tryagain')){
				$('.allok').addClass('tryagain');
			}
		}
		$('.allok').show();
		
		if($('.allok').hasClass('tryagain')){
			setAudio(3, 1, null);
		}
		else{
			setAudio(4, 1, null);
		}
		isfinished = true;
	}
	
	function printTime(t){
		var seconds = Math.floor(t / 1000);
		var minutes = Math.floor(seconds / 60);
		seconds = seconds % 60;
				
		console.log(minutes, seconds, t);
		
		var tmp = Math.min((t / timeTotal) * 848, 848);
		$('.progress-bar').css('width', tmp + 'px');
		
				
		strMinutes = minutes.toString();
		if(minutes < 10) strMinutes = '0' + minutes;
		strSeconds = seconds.toString();
		if(seconds < 10) strSeconds = '0' + seconds;
		
		$('.timer').html(strMinutes + ':' + strSeconds);
	}
	
	function updateTime() {
		if(timeStart != null && timeStart != undefined && timeStart != 0){
			var d = new Date();
			timePlayed = d.getTime() - timeStart;
			$('.progress-bar').show();
		}
		else{
			$('.progress-bar').hide();
		}
		
		printTime(timePlayed + timeSaved);
	}
	
	function update() {
		$('.tick').removeClass('tick-on');
		var done = 0;
		for(var i=0; i<todo.length; i++){
			if(todo[i].done){
				done += 1;
			}
		}
		for(i=0; i<done; i++){
			$('#tick-' + i).addClass('tick-on');
		}
	}
	
	function setAudio(id, typ, onFinish) {
		onFinishCurrAudio = onFinish;
		if(id == null){
			for(var i=0; i<audios.length; i++){
				if(audios[i].snd != null && audios[i].typ == typ){
					audios[i].snd.stop();
					audios[i].snd = null;
				}
			}
		}
		else{
			audios[id].snd = sounds[audios[id].id];
			audios[id].typ = typ;
			audios[id].snd.play();
		}
	}
	
	function localReset() {
		$('.button-start').removeClass('button-start-on');
		$('.button-start').css('pointer-events', 'auto');
		$('.allok').hide();
		setAudio(null, 0);
		setAudio(null, 1);
		isStarted = false;
		if(interval != null){
			clearInterval(interval);
		}
		for(var i=0; i<todo.length; i++){
			todo[i].done = false;
		}
		timePlayed = 0;
		timeSaved = 0;
		timeStart = null;
		updateTime();
		update();
		$('.button-bzzz').css('pointer-events', 'none');
		isfinished = false;
	}
	
    p.reset = function() {
		
    };

    p.loadState = function (obj) {
		var done = 0;
		for(var i=0; i<todo.length; i++){
			todo[i].done = obj['done' + i];
			if(todo[i].done){
				done += 1;
			}
		}
		update();
		isfinished = obj.isfinished;
		if(isfinished){
			$('.allok').show();
			if(done < todo.length){
				$('.allok').addClass('tryagain');
			}
			$('.button-start').css('pointer-events', 'none');
			printTime(timeTotal);
			$('.progress-bar').css('width', '848px');
			$('.progress-bar').show();
		}
    };

    p.saveState = function () {
        var obj = {};
		for(var i=0; i<todo.length; i++){
			obj['done' + i] = todo[i].done;
		}
		obj.isfinished = isfinished;
        return obj;
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);
(function (wnd) {

    var InteractiveActivity = function (api) {
		for (var i = 0; i < manifest.length; i++) {
            if (manifest[i].src.indexOf('.mp3') !== -1) {
				if (manifest[i].id === 'allOk' || manifest[i].id === 'ok' || manifest[i].id === 'wrong') {
					api.initSound(manifest[i].src, callback, defaultEndCallback);
				} else {
					api.initSound(manifest[i].src, callback, endCallback, pauseCallback);
				}
            }
        }
        init();
	};

    var p = InteractiveActivity.prototype;
    var touchDevice = /ipad|iphone|android|windows phone|blackberry/i.test(navigator.userAgent.toLowerCase());
    var eDown = touchDevice ? 'touchstart' : 'mousedown';
    var eUp =   touchDevice ? 'touchend'   : 'mouseup';
    var eMove = touchDevice ? 'touchmove'  : 'mousemove';
    var eOver = touchDevice ? 'touchover'  : 'mouseover';
    var eOut =  touchDevice ? 'touchout'   : 'mouseout';
	
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
        }
	};
	var pauseCallback = {
		onPause: function () {
			if (innerDisrupt) {
				innerDisrupt = false;
				return;
			}
			stopAudio();
        }
	};
	var sounds = {};
	var currentSound, innerDisrupt, isPlaying = false;
	var currentQuestion = 0;
	var questionObj;
	var currentChance = 0;
	var maxChances = 10;
	var done, todo;
	var gameState = '';
	var userAnswer, feedID;
	
	var getAbsoluteUrl = (function() {
		var a;
		return function(url) {
			if(!a) a = document.createElement('a');
			a.href = url;
			return a.href;
		};
	})();
	
	function init() {
		
		var imgPath = getAbsoluteUrl().replace('undefined', '');
		
		todo = questions.length;
		done = 0;
		
		//powiększenia obrazków w lightboxie
		if (imagesIncluded) {
			myLightboxOptions = new window.parent.LightboxOptions();
			if (myLightboxOptions) {
				myLightboxOptions.labelImage = "";
				myLightboxOptions.labelOf = "";
				
				myLightBox = new window.parent.Lightbox(myLightboxOptions);
				
				if (myLightBox) 
					for (var i=0; i<questions.length; i++) 
						myLightBox.add(imgPath + questions[i].imageBig, "" );
			}
		}
		
		if (buttonAudioVisible) {
			$('#audioBtn').css('display', 'inline-block').on(eDown, function(e) {
				e.preventDefault();
				if (gameState === '')
					return;
				playAudio();
			});
		}
		
		if (imagesIncluded) {
			$('#tipImg').css({
				'left': posX + 'px',
				'top': posY + 'px',
				'width': width + 'px',
				'height': height + 'px'
			}).show().on(eDown, openBigImage);
		}
		
		$('#resetBtn').on(eDown, function(e) {
			e.preventDefault();
			resetGame();
		});
		
		$('#startBtn').on(eDown, function(e) {
			e.preventDefault();
			if (gameState !== '') {
				return;
			}
			$('#startBtn').addClass('button-pressed');
			$('.letter').removeClass('disabled');
			if (buttonAudioVisible) {
				$('#audioBtn').removeClass('disabled');
			}
			if (!touchDevice) {
				$('.letter').addClass('non-mobile');
				if (buttonAudioVisible) {
					$('#audioBtn').addClass('non-mobile');
				}
			}
			if (questionObj.audio && buttonAudioVisible) {
				playAudio();
			}
			gameState = 'PLAY';
		});
		
		$('#nextBtn').on(eDown, function(e) {
			e.preventDefault();
			currentQuestion++;
			showQuestion();
			$('#welldone').hide();
			$('#nextBtn').hide();
			$('.letter').removeClass('disabled').css('visibility', 'visible');
			if (questionObj.audio && buttonAudioVisible) {
				if (currentSound) {
					innerDisrupt = true;
					currentSound.stop();
				}
				playAudio();
			}
			gameState = 'PLAY';
		});
		
		$('.letter').on(eDown, letterPress);

		if (!touchDevice) {
			$('#resetBtn').addClass('non-mobile');
			$('#startBtn').addClass('non-mobile');
			$('#nextBtn').addClass('non-mobile');
		}
		
		showQuestion();
	}

	function openBigImage(e) {
		e.preventDefault();
		if (myLightBox) {
			myLightBox.disableKeyboardNav();
			for (var i=1; i<=3125; i+=500) {
				setTimeout(function() {
					myLightBox.disableKeyboardNav();
				}, i);
			}
			
			myLightBox.overrideHandlers(myLightBox);			
			$(window.parent).on("resize", myLightBox.sizeOverlay);
			$('select, object, embed', parent.document).css({
				visibility: "hidden"
			});
			$('#lightboxOverlay').width($(window.parent).width()).height($(window.parent).height()).fadeIn(myLightBox.options.fadeDuration);
			$('.lightboxOverlay').css({ overflow: "scroll" });

			myLightBox.prepareView();
			myLightBox.changeImage(currentQuestion);
			
			$('.lb-nav, .lb-prev, .lb-next, .lb-number', parent.document).css({
				visibility: "hidden"
			});
		}
	}
	
	function playAudio() {
		currentSound = sounds[questionObj.audio];
		isPlaying = !isPlaying;
		if (isPlaying) {
			currentSound.play();
			$('#audioBtn').addClass('button-pressed');
		} else {
			stopAudio();
		}
	}
	
	function stopAudio() {
		if (currentSound) {
			$('#audioBtn').removeClass('button-pressed');
			currentSound.stop();
			currentSound = null;
			isPlaying = false;
		}
	}
	
	function showQuestion() {
		questionObj = questions[currentQuestion];
		questionObj.missing = [];
		userAnswer = questionObj.quest;
		lettersGood = 0;
		currentChance = 0;
		
		// text tip
		if (questionObj.tipText && questionObj.tipText !== '') {
			$('#tipTxt').html(questionObj.tipText.split('\n').join('<br/>'));
		} else {
			$('#tipTxt').html('');
		}
		
		//img tip
		if (imagesIncluded) {
			$('#tipImg').html('<img id="pic" src="' + questionObj.image + '" width="' + width + '" height="' + height + '" /><img id="zoom" src="images/zoom.png" width="64" height="64"/>');
			$('#zoom').css({
				'left': (width-64) + 'px',
				'top': (height-64) + 'px'
			});
		}
		
		// question
		$('#questionTxt').html(questionObj.quest.split('\n').join('<br/>'));
		if (buttonAudioVisible) {
			$('#audioBtn').css('left', $('#questionTxt').width() + 25 + 'px');
		}
		
		// missing letters
		for(var i=0;i<questionObj.quest.length;i++) {
			if (questionObj.quest.charAt(i) === '_') {
				questionObj.missing.push( { letter:questionObj.answer.charAt(i), indx:i, answered:false } );
			}
		}
		
		$('#qCntr').text((currentQuestion + 1) + '/' + todo);
		$('#spider').css({
			'-webkit-transform': 'none',
			'transform': 'none'
		}).show();
		$('#feed0').show();
		$('#feed1').hide();
		$('#feed2').hide();
		showButtons(true);
	}
	
	function letterPress(e) {
		e.preventDefault()
		
		if (gameState !== 'PLAY')
			return;
		
		var lBtn = $(this);
		if (lBtn.hasClass('disabled'))
			return;
		var letter = lBtn.find('span').text();
		var ok = false;
		
		for(var i=0;i<questionObj.missing.length;i++) {
			var lObj = questionObj.missing[i];
			if (letter === lObj.letter) {
				var temp = userAnswer.split('');
				temp[lObj.indx] = letter;
				userAnswer = temp.join('');
				lettersGood++;
				ok = true;
				lObj.answered = true;
			}
		}
		
		if (userAnswer.indexOf('_') === -1) {
			showButtons(false);
			sounds.allOk.play();
			$('#spider').css({
				'-webkit-transform': 'translate(0px, 100px)',
				'transform': 'translate(0px, 100px)'
			});
			done++;
			updateProgress();
			gameState = 'NEXT';
			$('#questionTxt').html(questionObj.answer.split('\n').join('<br/>'));
			feedID = setTimeout(function() {
				onAllOk();
			}, 500);
		} else if (ok) {
			sounds.ok.play();
			var step = 100 * (lettersGood / questionObj.missing.length);
			$('#spider').css({
				'-webkit-transform': 'translate(0px, ' + step + 'px)',
				'transform': 'translate(0px, ' + step + 'px)'
			});
			$('#questionTxt').html(userAnswer.split('\n').join('<br/>'));
		} else {
			sounds.wrong.play();
			currentChance++;
			showFeedback();
			if (currentChance === maxChances) {
				showButtons(false);
				gameState = 'FAIL';
				$('#questionTxt').html(questionObj.answer.split('\n').join('<br/>'));
			}
		}
		
		lBtn.css('visibility', 'hidden').addClass('disabled');
	}
	
	function showButtons(b) {
		b ? $('#lettersMC').show() : $('#lettersMC').hide();
	}
	
	function showFeedback() {
		if (currentChance < 10) {
			$('#spider').css({
				'-webkit-transform': 'translate(0px, ' + (-currentChance * 10) + 'px)',
				'transform': 'translate(0px, ' + (-currentChance * 10) + 'px)'
			});
		} else {
			$('#spider').css({
				'-webkit-transform': 'translate(0px, -180px)',
				'transform': 'translate(0px, -180px)'
			});
			feedID = setTimeout(function() {
				onAllWrong();
			}, 500);
		}
	}
	
	function onAllOk() {
		$('#feed0').hide();
		$('#feed1').show();
		$('#feed2').hide();
		$('#spider').hide();
		$('#welldone').show();
		if (currentQuestion < todo - 1)
			$('#nextBtn').show();
	}
	
	function onAllWrong() {
		$('#feed0').hide();
		$('#feed1').hide();
		$('#feed2').show();
		$('#spider').hide();
		if (currentQuestion < todo - 1)
			$('#nextBtn').show();
	}
	
	function updateProgress() {
		if (!done) {
			$('#progres').find('div').css('width', '0');
		} else {
			var w = Math.ceil(110 * (done / todo));
			$('#progres').find('div').css('width', w+'px');
		}
	}
	
    function resetGame() {
		clearTimeout(feedID);
		stopAudio();
		gameState = '';
		done = 0;
		currentQuestion = 0;
		currentChance = 0;
		lettersGood = 0;
		userAnswer = '';
		showQuestion();
		updateProgress();
		$('.letter').addClass('disabled').css('visibility', 'visible');
		$('#startBtn').removeClass('button-pressed');
		$('#welldone').hide();
		$('#nextBtn').hide();
		if (!touchDevice) {
			$('.letter').removeClass('non-mobile');
		}
		if (buttonAudioVisible) {
			$('#audioBtn').addClass('disabled');
			if (!touchDevice)
				$('#audioBtn').removeClass('non-mobile');
		}
	};

    p.reset = function () {
		
	};

    p.loadState = function (obj) {
		gameState = obj.gameState;
		done = obj.done;
		currentQuestion = obj.currentQuestion;
		questionObj = obj.questionObj;
		currentChance = obj.currentChance;
		lettersGood = obj.lettersGood;
		userAnswer = obj.userAnswer;
		
		if (gameState !== '') {
			$('#startBtn').addClass('button-pressed');
			$('.letter').removeClass('disabled');
			if (!touchDevice) {
				$('.letter').addClass('non-mobile');
				if (buttonAudioVisible) {
					$('#audioBtn').addClass('non-mobile');
				}
			}
			updateProgress();
			$('#qCntr').text((currentQuestion + 1) + '/' + todo);
			$('#spider').css({
				'-webkit-transform': obj.spiderT,
				'transform': obj.spiderWKT
			});
			
			// txt tip
			if (questionObj.tipText && questionObj.tipText !== '') {
				$('#tipTxt').html(questionObj.tipText.split('\n').join('<br/>'));
			} else {
				$('#tipTxt').html('');
			}
			
			//img tip
			if (imagesIncluded) {
				$('#tipImg').html('<img id="pic" src="' + questionObj.image + '" width="' + width + '" height="' + height + '" /><img id="zoom" src="images/zoom.png" width="64" height="64"/>');
				$('#zoom').css({
					'left': (width-64) + 'px',
					'top': (height-64) + 'px'
				});
			}
			
			// question
			$('#questionTxt').html(questionObj.quest.split('\n').join('<br/>'));
			if (buttonAudioVisible) {
				$('#audioBtn').css('left', $('#questionTxt').width() + 25 + 'px');
			}
			
			if (gameState === 'NEXT' || gameState === 'FAIL') {
				showButtons(false);
				$('#questionTxt').html(questionObj.answer.split('\n').join('<br/>'));
				(gameState === 'NEXT') ? onAllOk() : onAllWrong();
			} else {
				$('#questionTxt').html(userAnswer.split('\n').join('<br/>'));
				for(var i=0;i<questionObj.missing.length;i++) {
					var lObj = questionObj.missing[i];
					if (lObj.answered) {
						var lBtn = $('.letter').find('span:contains(' + lObj.letter + ')').parent();
						$(lBtn).css('visibility', 'hidden').addClass('disabled');
					}
				}
			}
		}
    };

    p.saveState = function () {
		clearTimeout(feedID);
		stopAudio();
        return {
			gameState: gameState,
			done: done,
			questionObj: questionObj,
			currentQuestion: currentQuestion,
			currentChance: currentChance,
			lettersGood: lettersGood,
			userAnswer: userAnswer,
			spiderT: $('#spider').css('transform'),
			spiderWKT: $('#spider').css('-webkit-transform')
		};
    };

    wnd.InteractiveActivity = InteractiveActivity;

})(window);
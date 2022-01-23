/**
* SoundJS
* Visit http://createjs.com/ for documentation, updates and examples.
*
* Copyright (c) 2011 gskinner.com, inc.
* 
* Distributed under the terms of the MIT license.
* http://www.opensource.org/licenses/mit-license.html
*
* This notice shall be included in all copies or substantial portions of the Software.
*
* ver. 1.2.0-90 created from release_v0.2.0
**/
(function(c){function a(){throw"SoundJS cannot be instantiated";}a.DELIMITER="|";a.activePlugin=null;a.idHash={};a.registerPlugins=function(b){for(var e=0,d=b.length;e<d;e++){var f=b[e];if(f!=null&&f.isSupported())return a.activePlugin=new f,true}return false};a.registerPlugin=function(b){return b.isSupported()?(a.activePlugin=new b,true):false};a.isReady=function(){return a.activePlugin!=null};a.getCapabilities=function(){return a.activePlugin?a.activePlugin.capabilities:null};a.getCapability=function(b){return a.activePlugin==
null?null:a.activePlugin.capabilities[b]};a.getPreloadHandlers=function(){return{callback:a.proxy(a.initLoad,a),types:["sound"],extensions:["mp3","ogg","wav"]}};a.initLoad=function(b,e,d,f){if(!a.checkPlugin(true))return false;b=a.parsePath(b,e,d,f);if(b==null)return false;if(d!=null)a.idHash[d]=b.src;d=a.activePlugin.register(b.src,f);if(d!=null&&d.src)b.src=d.src;return b};a.parsePath=function(b,e,d,f){for(var b=b.split(a.DELIMITER),e={type:e||"sound",id:d,data:f},d=false,f=a.getCapabilities(),
c=0,g=b.length;c<g;c++){var h=b[c],i=h.lastIndexOf("."),k=h.substr(i+1).toLowerCase(),i=h.substr(0,i).split("/").pop();switch(k){case "mp3":f.mp3&&(d=true);break;case "ogg":f.ogg&&(d=true);break;case "wav":f.wav&&(d=true)}if(d)return e.name=i,e.src=h,e.extension=k,e}return null};a.checkPlugin=function(){return a.activePlugin==null&&(a.registerPlugin(a.DefaultAudioPlugin),a.activePlugin==null)?false:true};a.getSrcFromId=function(b){return a.idHash[b]==null?b:a.idHash[b]};a.tellAllInstances=function(a,
e){var d=c.empiriaSoundJsGetSoundInstances();if(this.activePlugin==null)return false;for(var f=this.getSrcFromId(e),j=d.length-1;j>=0;j--){var g=d[j];if(!(f!=null&&g.src!=f))switch(a){case "pause":g.pause();break;case "resume":g.resume();break;case "stop":g.stop()}}return true};a.proxy=function(a,e){return function(){return a.apply(e,arguments)}};a.play=function(b,e,d,f,c){b=a.getSrcFromId(b);b=a.activePlugin.create(b);b.play(null,d,f,c);return b};a.pause=function(b){return a.tellAllInstances("pause",
b)};a.resume=function(b){return a.tellAllInstances("resume",b)};a.stop=function(b){return a.tellAllInstances("stop",b)};c.SoundJS=a})(window);(function(c){function a(){this.init()}function b(a){this.init(a)}function e(a,b){b!==0?c.empiriaSoundJsPlayLooped(a):c.empiriaSoundJsPlay(a)}a.capabilities={mp3:true,ogg:true,mpeg:true,wav:true};a.isSupported=function(){return true};a.prototype={capabilities:null,init:function(){this.capabilities=a.capabilities},register:function(a){var f=new b(a);c.empiriaSoundJsInit(f,a);return f},create:function(a){return c.empiriaSoundJsGetSoundInstance(a)},toString:function(){return"[DefaultAudioPlugin]"}};c.SoundJS.DefaultAudioPlugin=
a;b.prototype={src:null,onComplete:null,init:function(a){this.src=a},play:function(a,b,c,g){var h=this.src;c==null&&(c=0);b==null&&(b=0);g==null&&(g=0);this.setPosition(c);b&&b>0?setTimeout(function(){e(h,g)},b):e(h,g)},pause:function(){c.empiriaSoundJsPause(this.src);return true},resume:function(){c.empiriaSoundJsResume(this.src);return true},stop:function(){c.empiriaSoundJsStop(this.src)},getPosition:function(){var a=c.empiriaSoundJsGetCurrentTime(this.src);a*=1E3;return a},setPosition:function(a){c.empiriaSoundJsSetCurrentTime(this.src,
a*0.001);return true},toString:function(){return"[DefaultAudio SoundInstance]"}}})(window);
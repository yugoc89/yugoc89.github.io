define([
	'jquery',
	'underscore',
	'backbone',
	'classie',
	'app/router',
], function($, _, Backbone, classie, AppRouter){


	var decodeHtmlEntity = function(str) {
		return str.replace(/&#(\d+);/g, function(match, dec) {
			return String.fromCharCode(dec);
		});
	};

	function imageError() {
		$('img').error(function(){
			$(this).attr({
				'src': '/assets/images/common/no-data.jpg'
			});
			console.log('image error');
			return false;
		});
	}

	function mobilecheck() {
		var check = false;
		(function(a){if(/(android|ipad|playbook|silk|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4)))check = true})(navigator.userAgent||navigator.vendor||window.opera);
		return check;
	}

	function getSize() {
		var windowWidth = $(window).width(),
			windowHeight = $(window).height();
		$('.container').css({
			height: windowHeight
		});
	}

	function splitItems(a, n) {
		var len = a.length,
			out = [],
			i = 0;
			
		while (i < len) {
			var size = Math.ceil((len - i) / n--);
			out.push(a.slice(i, i + size));
			i += size;
		}
		return out;
	}

	function lazyLoad(el){
		var archiveData = [],
			loopData = [];
		var n = 0;
		var dataLength = Math.floor(el.length/100);
		el.forEach(function(data, i){
			loopData.push(data);
			if ((i+1) % 100 === 0) {
				archiveData[n] = loopData;
				n++;
				loopData = [];
			} else if(i+1 > dataLength*100) {
				archiveData[n] = loopData;
			}
		});

		return archiveData;
	}

	function navigationMenu() {

		var nav = document.getElementById('navigation'),
			header = document.getElementById('header'),
			trigger = document.getElementById('navigation-trigger'),
			menulink = nav.getElementsByTagName('a'),
			eventtype = mobilecheck() ? 'touchstart' : 'click';

		var resetMenu = function() {
			TweenLite.to(nav, 0.3, {
				y: '-200%',
				alpha: 0,
				onComplete: function(){
					classie.remove(trigger, 'active');
					classie.remove(nav, 'navigation--show');
					TweenLite.to('.home-button', 0.4, {alpha: 1});
				}
			});
			//document.body.style.overflowY = 'inherit';
		},
		closeClickFn = function () {
			resetMenu();
		};
		$(document).on('click', '.navigation a, .ajax-trigger', function(){
			event.preventDefault();

			var href = $(this).attr('href'),
				path = href.replace('/', '');

			if (Backbone.history.getFragment() === path) {
				resetMenu();
			} else {
				var AppRouter = require('app/router'),
					router = new AppRouter();

				router.navigate(href, true);
				resetMenu();
			}

		});

		trigger.addEventListener( eventtype, function(event) {
			event.preventDefault();

			if (classie.has(trigger, 'active')) {
				resetMenu();
			} else {
				classie.add(trigger, 'active');
				classie.add(nav, 'navigation--show');
				TweenLite.to(nav, 0.3, { y: '0%', alpha: 1 });
				TweenLite.to('.home-button', 0.4, {alpha: 0});
			}
		});
	}
	function historyBack() {
		$(document).on('click', '.button--back-history', function(event) {
			event.preventDefault();

			var AppRouter = require('app/router'),
				router = new AppRouter();

			router.previous();
		});
	}

	function buttonsEffect(){
		var canvas = {},
			centerX = 0,
			centerY = 0,
			color = '',
			containers = document.getElementsByTagName('label'),
			context = {},
			element = {},
			radius = 0,

		requestAnimFrame = function () {
			return (
				window.requestAnimationFrame       ||
				window.mozRequestAnimationFrame    ||
				window.oRequestAnimationFrame      ||
				window.msRequestAnimationFrame     ||
				function (callback) {
					window.setTimeout(callback, 1000 / 60);
				}
			);
		} (),

		init = function () {
			containers = Array.prototype.slice.call(containers);
			for (var i = 0; i < containers.length; i += 1) {
				canvas = document.createElement('canvas');
				canvas.addEventListener('click', press, false);
				containers[i].appendChild(canvas);
				canvas.style.width ='100%';
				canvas.style.height='100%';
				canvas.width  = canvas.offsetWidth;
				canvas.height = canvas.offsetHeight;
			}
		},

		press = function (event) {
			color = event.toElement.parentElement.dataset.color;
			element = event.toElement;
			context = element.getContext('2d');
			radius = 0;
			centerX = event.offsetX;
			centerY = event.offsetY;
			context.clearRect(0, 0, element.width, element.height);
			draw();
		},

		draw = function () {
			context.beginPath();
			context.arc(centerX, centerY, radius, 0, 2 * Math.PI, false);
			context.fillStyle = color;
			context.fill();
			radius += 2;
			if (radius < element.width) {
				requestAnimFrame(draw);
			}
		};

		init();
	}

	function getUrlVars() {
		var vars = [], hash;
		var hashes = window.location.href.slice(window.location.href.indexOf('?') + 1).split('&');
		for(var i = 0; i < hashes.length; i++) {
			hash = hashes[i].split('=');
			vars.push(hash[0]);
			vars[hash[0]] = hash[1];
		}
		return vars;
	}

	$.fn.cssHide = function(value, callback){
		var amount = (value) ? value : 0;
		TweenLite.to(this, amount, {
			css: {
				opacity: 0,
				visibility: 'hidden'
			},
			onComplete: function(){
				if (callback) {
					callback();
				}
			}
		});
		return false;
	};

	$.fn.cssShow = function(value, callback){
		var amount = (value) ? value : 0;
		TweenLite.to(this, amount, {
			css: {
				opacity: 1,
				visibility: 'inherit'
			},
			onComplete: function(){
				if (callback) {
					callback();
				}
			}
		});
		return false;
	};

	navigator.sayswho= (function(){
	    var ua= navigator.userAgent, tem,
	    M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
	    if(/trident/i.test(M[1])){
	        tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
	        return 'IE '+(tem[1] || '');
	    }
	    if(M[1]=== 'Chrome'){
	        tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
	        if(tem!== null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
	    }
	    M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
	    if((tem= ua.match(/version\/(\d+)/i))!== null) M.splice(1, 1, tem[1]);
	    return M.join(' ');
	})();

	var browserName = navigator.sayswho.toLowerCase();
	document.body.className = document.body.className + ' ' + browserName;

	getSize();
	navigationMenu();
	historyBack();
	$(window).resize(function(){
		getSize();
	});

	return {
		decodeHtmlEntity: decodeHtmlEntity,
		imageError: imageError,
		mobilecheck: mobilecheck,
		getUrlVars: getUrlVars,
		splitItems: splitItems,
		lazyLoad: lazyLoad,
	};
});
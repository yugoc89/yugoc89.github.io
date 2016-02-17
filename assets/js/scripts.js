require.config({

	paths: {
		'classie': '/assets/js/components/classie',
		'jquery': '/assets/js/vendor/jquery-1.10.2.min',
		'underscore': '/assets/js/vendor/underscore-min',
		'backbone': '/assets/js/vendor/backbone-min',
		'TweenLite': '/assets/js/components/TweenMax.min',
		'TimelineLite':'/assets/js/components/TimelineLite.min',
		'MixItUp':'/assets/js/components/jquery.mixitup.min'
	},

	shim: {
		'underscore': {
			exports: '_'
		},
		'backbone': {
			deps: [
				'underscore',
				'jquery',
			],
			exports: 'Backbone'
		},
		'TweenLite': {
			exports: 'TweenLite'
		}
	}
});

require([
	'jquery',
	'classie',
	'backbone',
	'TweenLite',
	'TimelineLite',
	'app/router',
], function($, classie, Backbone, TweenLite, TimelineLite, AppRouter) {

	'use strict';

	$(document).on('click', '.navigation-main-menu a, .ajax-trigger', function(event) {
		event.preventDefault();
	});

	new AppRouter();
	Backbone.emulateHTTP = true;
	Backbone.emulateJSON = true;
	Backbone.history.start({pushState: true});
});
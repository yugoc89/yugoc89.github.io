// Router
// -------------
define([
	'jquery',
	'underscore',
	'backbone',
	'classie',
	'app/views'
], function($, _, Backbone, classie, Views){
	var currentView = null,
		mainLoader = document.getElementById('loader');

	var AppRouter = Backbone.Router.extend({
		url: '/',
		routes: {
			'': 'homeAction',
			'services/': 'servicesAction',
			'*default': 'pageAction',
		},
		start: null,
		history: [],
		initialize: function(pass){
			if (Backbone.history.fragment === undefined) {
				$(mainLoader).removeClass('show');
				this.start = true;
			}

			this.on('all', this.storeRoute);
			this.on('all', this.ga);
		},
		storeRoute: function() {
			return this.history.push(Backbone.history.fragment);
		},
		previous: function(){
			if (this.history.length > 3) {
				this.navigate('/' + this.history[this.history.length - 3], true);
			} else {
				this.navigate('/', true);
			}
		},
		ga: function(){
			var path = Backbone.history.getFragment();
			ga('send', 'pageview', {page: "/" + path});
		},
		homeAction: function( slug ) {
			var restfulPageUrl = '/';
			this.switchView({
				'url': restfulPageUrl
			});
			console.log('homeAction');
		},
		archiveAction: function( id ) {
			var restfulPageUrl = id;
			var slug = id.split('/')[0];
			this.switchView({
				'url': restfulPageUrl,
				'slug': slug
			});
			console.log('archiveAction');
		},
		servicesAction: function(id) {
			var restfulPageUrl = id;
			this.switchView({
				'url': restfulPageUrl,
				'slug': 'services'
			});
		},
		pageAction: function(slug) {
			var restfulPageUrl = '/' + slug;
			this.switchView({
				'url': restfulPageUrl,
				'slug': slug,
				'page': true
			});
			console.log('pageAction');
		},
		switchView: function(arg) {
			var that = this;

			mainLoader.removeAttribute('style');
			classie.add( mainLoader, 'show' );

			//if Views exisits, reset them
			if (currentView) {
				currentView.remove();
			}

			//if it's an initial load
			if (this.start === true) {
				switchAct('.main');
			} else {
				ajaxContent();
			}

			function switchAct(e, ajax) {
				if (ajax) {
					//if Ajax content has been fired
					$('.container').append(e);
					initialise();
					currentView = new Views.MainView({el:e, id: arg.slug, category: arg.category, page: arg.page, start: true});
				} else {
					currentView = new Views.MainView({el:e, id: arg.slug, category: arg.category, page: arg.page });
				}
				//go back to the page top
				function initialise(){
					$('html,body').animate({ scrollTop: 0 }, 'slow');
				}
			}
			//load page via Ajax
			function ajaxContent() {
				$.ajax({
					url: arg.url,
					cache: false,
				})
				.done (function(html){
					var element = $('.main', $(html));
					switchAct(element, true);
				})
				.fail(function() {
					alert("error");
					classie.remove( mainLoader, 'show' );
				});
			}
		}
	});

	return AppRouter;
});
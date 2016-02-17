// View
// -------------
define([
	'jquery',
	'underscore',
	'backbone',
	'classie',
	'TweenLite',
	'TimelineLite',
	'MixItUp',
	'app/router',
	'app/collections',
	'app/models',
	'app/globals',
	], function($, _, Backbone, classie, TweenLite, TimelineLite, MixItUp, Router, Collections, Models, Globals){

	var mainLoader = document.getElementById('loader');
	var loadAnim = function(colour){

		var el = document.getElementById('square');
		var spans = el.getElementsByTagName('span');
		for (var i = spans.length - 1; i >= 0; i--) {
			spans[i].style.backgroundColor = colour;
		}
		TweenLite.set(el, {autoAlpha: 1});

		var tl = new TimelineLite({ onComplete: Loader() });
		tl.fromTo(".l1", 1, {height:0}, {height:'100%'})
		.fromTo(".l2", 1, {width:0}, {width:'100%'})
		.fromTo(".l3", 1, {height:0}, {height:'100%'})
		.fromTo(".l4", 1, {width:0}, {width:'100%'});

		tl.timeScale(3);

		function Loader(){
			TweenLite.to(mainLoader, 1, {
				alpha: 0,
				ease: Sine.easeInOut,
				delay: 1.5,
				onComplete: function(){
					classie.remove( mainLoader, 'show' );
					TweenLite.to(el, 0.4, {autoAlpha: 0});
				}
			});
		}
	};

	var MainView = Backbone.View.extend({
		el: $('#main'),
		initialize: function(options, categoryId) {
			var that = this;

			$(this.el).unbind();
			_.bindAll(this, 'render');

			this.category = options.category;
			this.page = options.page;
			this.start = options.start;

			this.render();

			// this.template = _.template($('#template--index').html());
			// this.collection = new Collections.BasicCollection([], { id: this.id, category: this.category });

			// this.collection.fetch({
			// 	success: function (collection, response) {
			// 		console.log(response);
			// 		that.render(response);
			// 	},
			// 	error: function (errorResponse) {
			// 		console.log(errorResponse);
			// 	},
			// 	complete: function(xhr, textStatus) {
			// 		console.log(textStatus);
			// 	}
			// });
		},
		render: function() {
			if(this.id === 'works' || this.id === 'works/'){
				// var datums = this.collection.toJSON()[0].data,
				// 	lazyLoad = Globals.lazyLoad(datums);

				// $('.content-inner').append(this.template({ datums: lazyLoad[0]}));

				new ArchiveView({
					el: this.el,
					id: this.id,
					category: this.category,
					//collection: this.collection,
					//lazyLoad: lazyLoad,
				});

			} else if (this.id === 'services' || this.id === 'services/'){
				new ServicesView({
					el: this.el,
					id: this.id
				});
			} else if(this.page === true){
				new PageView();
			} else {
				// if browser was Ajaxed
				if (this.start === true){
					new BasicView({
						el: this.el,
					});
				} else {
					new BasicView ({
						el: this.el,
						start: true,
					});
				}
			}
		},
	});

	//--------------
	// Home
	//--------------
	var BasicView = Backbone.View.extend({
		//el: $('#main'),
		events: {
			'click .main-menu a': 'transitionEffect',
		},
		initialize: function(options, categoryId) {
			console.log('home!!');

			this.start = options.start;

			$(this.el).unbind();
			_.bindAll(this, 'render', 'transitionEffect', 'mainAnim', 'subAnim');

			this.render();

			//var that = this;

			// this.collection = new Collections.BasicCollection([], { id: this.id, category: this.category });
			// this.collection.fetch({
			// 	success: function (collection, response) {
			// 		console.log(response);
			// 		that.render(response);
			// 	},
			// 	error: function (errorResponse) {
			// 		console.log(errorResponse);
			// 	},
			// 	complete: function(xhr, textStatus) {
			// 		console.log(textStatus);
			// 	}
			// });

		},
		render: function() {
			var self = this;

			this.delegateEvents();
			loadAnim('#504f4f');
			this.mainAnim();

			setInterval(function(){
				self.subAnim();
			}, 6000);

			return this;
		},
		transitionEffect: function(event){
			event.preventDefault();

			var AppRouter = require('app/router'),
				router = new AppRouter(),
				href = $(event.currentTarget).attr('href');

			router.navigate(href, true);
		},
		mainAnim: function(){
			var self = this;
			
			$(this.el).find('.main-text').each(function(i, el){
				TweenLite.to(this, 1, {
					alpha: 1,
					delay: 0.5*i,
					repeat: -1,
					yoyo: true,
					ease: Circ.easeInOut
				});
			});

		},
		subAnim: function(){
			var randomz = Math.floor(Math.random() * $(this.el).find('.main-text').length);
			console.log(randomz);
			var randomEl = '.main-text-' + randomz;
			var randomEl2 = '.main-text-' + (randomz-2);
			var randomEl3 = '.main-text-' + (randomz+2);
			var elz = randomEl + ', ' + randomEl2 + ', ' + randomEl3;
			$('.main-text.active').removeClass('active');
			$(elz).addClass('active');
		}
	});

	var ServicesView = Backbone.View.extend({
		el: $('.main'),
		initialize: function(){
			console.log('service page');
			this.render();
		},
		render: function(){
			TweenLite.set('.content--services.bottom', {autoAlpha:0, y: '10%'});
			this.setImageSize();
			this.parallax();

			loadAnim('#f6f4f4');
			$(this.el).on('scroll', this.parallax);
			$(window).on('resize', this.setImageSize);
		},
		setImageSize: function(){
			var imageWidth = $('.section--title').width();
			$('.section--title').css({
				height: imageWidth*0.69
			});
		},
		parallax: function(){
			var scrolled = $('.main').scrollTop(),
				secondContent = $('.content--services.bottom'),
				secondContentOffset = secondContent.offset().top;

			$('.services-headline').css('top',80.5 + -(scrolled*0.1)+'%');
			$('.bg--business').css('top',4 + -(scrolled*0.02)+'%');
			$('.white-wall').css('top',70 + -(scrolled*0.05)+'%');

			if (scrolled > secondContentOffset) {
				TweenLite.to(secondContent, 1.5, {
					autoAlpha: 1,
					y: '0%',
					//ease: Sine.easeIn,
				});
				TweenLite.to('.storyline', 2, {
					height: '100%'
				});
			}
		}
	});

	var ArchiveView = Backbone.View.extend({
		el: $('.main'),
		events: {
			'click .ajax-trigger--single': 'singleAjax',
			'click .category-nav a': 'cateFilter'
		},
		initialize: function(){
			$(this.el).unbind();
			_.bindAll(this, 'render', 'singleAjax');

			this.render();
		},
		render: function(){
			this.delegateEvents();

			console.log('archiveview');
			loadAnim('#fff');
			$('.work-list').mixItUp();
		},
		singleAjax: function(event){
			event.preventDefault();

			var href = $(event.currentTarget).attr('href'),
				path = href.replace('/', '').split('/')[1];

			console.log(path);

			var post = new SingleView({
				el: this.el,
				slug: path,
			});
		},
		cateFilter: function(event){
			event.preventDefault();
			$('.category-nav a').removeClass('active');
			classie.add(event.currentTarget, 'active');
		}
	});

	var SingleView = Backbone.View.extend({
		el: $('.main'),
		events: {
			'click .single-post__close': 'closeContent'
		},
		initialize: function(options){

			var self = this;

			this.id = options.id;
			this.slug = options.slug;

			this.template = _.template($('#template--post').html());
			this.collection = new Collections.SingleCollection([], { id: this.id, slug: this.slug });

			this.collection.fetch({
				success: function (collection, response) {
					self.render(response);
				},
				error: function (errorResponse) {
					console.log(errorResponse);
				},
				complete: function(xhr, textStatus) {
					console.log(textStatus);
				}
			});
		},
		render: function(){

			var post = document.getElementById('single-post'),
				inner = document.getElementById('single-post-inner');

			var datums = this.collection.toJSON()[0].posts;

			$('.single-post-inner').html(this.template({ datums: datums }));
			TweenLite.to('#button--close', 0.3, { autoAlpha: 0});
			
			TweenLite.to(post, 0.3, { autoAlpha: 1, height: '100%', onComplete: function(){
					TweenLite.to('.overlay--single', 0.2, { width: '100%', onComplete: function(){
							TweenLite.to('.overlay--single', 0.2, { x: '100%' })
							classie.add(post, 'show');
						}
					});
				}
			})
		},
		closeContent: function(event){
			event.preventDefault();
			var post = document.getElementById('single-post'),
				inner = document.getElementById('single-post-inner');

			TweenLite.to('.overlay--single', 0.2, { x: '0%', onComplete: function(){
					TweenLite.to('.overlay--single', 0.2, { width: '0%' })
				}
			});

			TweenLite.to('#button--close', 0.1, { autoAlpha: 1, onComplete: function(){
				$(inner).empty();
				classie.remove(post, 'show');
			}});

			TweenLite.to(post, 0.6, { autoAlpha: 0, delay: 0.6, onComplete:function(){
				TweenLite.set(post, { height: '0%' });
			}});

		}
	});

	var PageView = Backbone.View.extend({
		el: $('.main'),
		initialize: function(){
			this.render();
		},
		render: function(){
			console.log('pageview');
			loadAnim('#504f4f');
		}
	});

	//--------------
	// Return the view classies
	//--------------
	return {
		MainView: MainView
	};
});
// View
// -------------
define([
	'jquery',
	'underscore',
	'backbone',
	'classie',
	'TweenLite',
	'TimelineLite',
	'app/router',
	'app/collections',
	'app/models',
	'app/globals',
	], function($, _, Backbone, classie, TweenLite, TimelineLite, Router, Collections, Models, Globals){

	var mainLoader = document.getElementById('loader');
	var loadAnim = function(){

		var el = document.getElementById('square');
		TweenLite.defaultEase = Linear.easeNone;
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

			if(this.id === 'works'){
				var datums = this.collection.toJSON()[0].data,
					lazyLoad = Globals.lazyLoad(datums);

				$('.content-inner').append(this.template({ datums: lazyLoad[0]}));

				new ArchiveView({
					el: this.el,
					id: this.id,
					category: this.category,
					collection: this.collection,
					lazyLoad: lazyLoad,
				});

			} else if (this.id === 'services'){
				new ServicesView({
					el: this.el,
					id: this.id
				});
			} else {
				//$('.content-inner').html(this.template({ datums: this.slideBG() }));
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
			'click h1': 'test'
		},
		initialize: function(options, categoryId) {
			console.log('home!!');

			this.start = options.start;

			$(this.el).unbind();
			_.bindAll(this, 'render', 'transitionEffect', 'mainAnim');

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
			loadAnim();
			this.mainAnim();

			setInterval(function(){
				self.subAnim();
			}, 6000);

			return this;
		},
		transitionEffect: function(event){
			event.preventDefault();
			$(event.currentTarget).addClass('clicked');

			setTimeout(function(){
				var AppRouter = require('app/router'),
					router = new AppRouter(),
					href = $(event.currentTarget).attr('href');

				router.navigate(href, true);
			}, 400);
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
			TweenLite.set('.content--services.bottom', {autoAlpha:0, y: '20%'});
			this.setImageSize();
			this.parallax();
			loadAnim();
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
				TweenLite.to(secondContent, 0.4, {
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

	//--------------
	// Return the view classies
	//--------------
	return {
		MainView: MainView
	};
});
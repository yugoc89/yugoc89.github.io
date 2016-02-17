// Collection
// -------------
define([
		'jquery',
		'backbone',
		'app/models',
	], function($, Backbone, Models) {

	//--------------
	// Collection[home]
	//--------------
	var BasicCollection = Backbone.Collection.extend({
		model: Models.BasicModel,
		url: function(){
			if (this.options.id  === 'personal') {
				//personal or feeling page
				return '/api/get_profile';
			} else {
				//home用
				return '/api/get_profile';
			}
		},
		initialize: function(models, options){
			this.options = options;
			this.url_querystring = '&slug=' + this.options.id;
		}
	});

	//--------------
	// Collection[each person]
	//--------------
	var SingleCollection = Backbone.Collection.extend({
		model: Models.SingleModel,
		url: function(){
			return '/api/get_post.json';
		},
		initialize: function(models, options){
			this.options = options;
		},
	});

	// //--------------
	// // Collection[local storage data]
	// //--------------
	// var FavouriteList = Backbone.Collection.extend({
	// 	model: Models.SingleModel,
	// 	localStorage: new Backbone.LocalStorage('id'),
	// });

	//--------------
	// Return collection classes
	//--------------
	return {
		BasicCollection: BasicCollection,
		SingleCollection: SingleCollection,
	};

});
// Model
// -------------
define([
	'underscore',
	'backbone'
	], function(_, Backbone){

	var BasicModel = Backbone.Model.extend({
		urlRoot: '/',
		idAttribute: 'cid',
	});

	var SingleModel = Backbone.Model.extend({
		urlRoot: '/',
		initialize: function(){
		},
		destroy: function(id){
			localStorage.removeItem(id);
		}
	});

	// var SPModel = Backbone.Model.extend({
	// 	urlRoot: '/'
	// });
	
	//--------------
	// Return the model classes
	//--------------
	return {
		BasicModel: BasicModel,
		SingleModel: SingleModel,
	};
});
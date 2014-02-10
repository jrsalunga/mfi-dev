//MFI = (function(Backbone, $){ 

var App = new (Backbone.View.extend({
	el: 'body',
		className: 'state-nav',
		initialize: function(){
			console.log(this);
		},
		start: function(){

		},
		//template: _.template($('#body-template').html()),
		template: _.template('<h1>It Works!</h1>'),
		render: function(){
			console.log('trace');
			console.log(this.el);
			this.$el.html(this.template());
		}
	}))({el: document.body});


PRISM = {
		Models: {},
		Views: {},
		Collections: {},
		loadTemplates: function(views, callback) {

	        var deferreds = [];

	        $.each(views, function(index, view) {
	        	console.log(PRISM);
	            if (PRISM.Views[view]) {
	                deferreds.push($.get('../js2/tpl/' + view + '.html', function(data) {
	                    PRISM.Views[view].prototype.template = _.template(data);
	                }, 'html'));
	            } else {
	                alert(view + " not found");
	            }
	        });

	        $.when.apply(null, deferreds).done(callback);
    	}
}

PRISM.Models.AppSettings = Backbone.Model.extend({});

PRISM.Views.AppMainView = Backbone.View.extend({
	
});



PRISM.Views.test = Backbone.View.extend({
	initialize: function(){
		
		console.log(this.template);

		if(!this.template){
			console.log('load template');
		} else {
			console.log('template loaded');
		}
	},

	
});

PRISM.loadTemplates(['test'], function(){});



App.test = new PRISM.Views.test();

PRISM.util = (function (PRISM) {
    var util = {},
        foo; // private variable

    // public
    util.someFunction = function () {};

    // private
    function someOther() {}

    return util;
}(PRISM));


var x = (function(Backbone, $){ 
	console.log($);	
})(Backbone, jQuery);




	

	/*
	return {
		init: function(){
			App.render();
			App.start();
      	
    }
  };

})(Backbone, jQuery);
*/


$(function(){
	
	
	//MFI.init();
	App.render();
	App.start();
})






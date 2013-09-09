

	Menu = Backbone.Model.extend({
		initialize : function(){
				
			},
			toggleClass: function(){
				this.get('class') === 'active' ? this.set({'class': 'deactive'}) : this.set({'class': 'active'});
			}
	});


	var menu = new Menu();


	Menus = Backbone.Collection.extend({
			model: Menu,
			url: '../api/nav.json'
	});


	MenuView = Backbone.View.extend({
		tagName: "div",
		attributes: {
//			id: "menu"
		},
		initialize: function(){
			//this.model.on('change:class', this.render, this); // uncomment to render
			this.template = _.template($('#menu-tpl').html());
		},
		events: {
			'click .bb': 'navChangeClass',
			'click .fd li': 'selectSubNav',
			'click .fd li a': 'selectSubNavA'
		},
		render: function(){
			this.$el.html(this.template(this.model.toJSON()));
			var cls = "nav "+ this.model.get('class');
			var mID = "menu" + this.model.collection.indexOf(this.model);
			this.$el.attr({'id': mID, 'class':cls});
			return this;
		},
		navChangeClass: function(e){
			e.preventDefault();
			this.model.toggleClass();
			this.toggleMenus(e);
		},
		toggleMenus: function(e){
			e.preventDefault();

			var nav = $(e.currentTarget).parent();
			var fd = $(e.currentTarget).next();

			if((fd.is('.fd')) && (fd.is(':visible'))) {
				fd.slideUp('normal');
				nav.removeClass('active'); 
        		return false;
        	}
     	
			if((fd.is('.fd')) && (!fd.is(':visible'))) {
				$('nav .fd:visible').slideUp('normal');
				$('nav .fd:visible').parent().removeClass('active'); 
				nav.addClass('active');
				fd.slideDown('normal');
		        return false;
	        }
		},
		selectSubNav: function(e){
			e.preventDefault();
			
			console.log($(e.currentTarget));
		},
		selectSubNavA: function(e){
			
		}


	});

	MenusView = Backbone.View.extend({
		tagName: "nav",
		attributes: {
			class: "main-nav"
		},
		initialize: function(){
			//this.collection.on('change', this.addAll, this);
			this.collection.on('add', this.addOne, this);
			//this.render();
		},
		render: function(){
			this.addAll;
			return this;
		},
		addOne: function(menu){
			var menuView = new MenuView({model: menu});
			this.$el.append(menuView.render().el);
		},
		addAll: function(){
			this.collection.forEach(this.addOne, this);
		}
	});
	
	
$(document).ready(function(e) {
    //append the menu
				
});
	




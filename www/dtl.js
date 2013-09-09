	/****** Model ******/
    Item = Backbone.Model.extend({
		urlRoot: '/prism/www/api/t/item',
	});
    var item = new Item();

    Apvdtl = Backbone.Model.extend({});
	var apvdtl = new Apvdtl();
    
    /****** Collection ******/
    Apvdtls = Backbone.Collection.extend({
		model: Apvdtl,
		initialize: function(){
			this.on('add', this.onAddModel, this);
		},
		onAddModel: function(model, collection, options){	
			//model.set({'apvhdrid': apvhdr.get('id')});
		}
	});
	var apvdtls = new Apvdtls();


    /****** View ******/
    ApvdtlsView = Backbone.View.extend({
		el: '.view',
		initialize: function(){
			this.collection.on('reset', this.addAll, this);
			this.collection.on('add', this.addOne, this);
		},
		render: function(){
			this.addAll();
			return this;
		},
		addOne: function(apvdtl){
			
			var apvdtlView = new ApvdtlView({model: apvdtl});
			this.$el.append(apvdtlView.render().el);

		},
		addAll: function(){
			this.collection.forEach(this.addOne, this);
		}
	});



    ApvdtlView = Backbone.View.extend({
		tagName: 'tr',
		initialize: function(){

			this.model.on('change', this.render, this);
			this.template = _.template('<td> <%=itemid%> </td>'+
				'<td><%=qty%></td>');
		},
		render: function(){	

			item.set({'id': this.model.get('itemid')});
			item.fetch();
			console.log(item.toJSON());

			//build new render data
			var data = {
				"itemid": item.get('descriptor'),
				"qty": this.model.get('qty')
			}

			this.$el.html(this.template(data));
			//this.$el.html(this.template(this.model.toJSON()));
			return this;
		}
	});




$(document).ready(function() {

	var apvdtlsView = new ApvdtlsView({collection: apvdtls});
	apvdtlsView.render().el;
    
    
	apvdtls.add([
		{
			itemid: 'c4676cef679a11e28b7a3085a942bd8e',
			qty: 10
		},
		{
			itemid: '1da17339690f11e285d63085a942bd8e',
			qty: 5
		}

	]);
});

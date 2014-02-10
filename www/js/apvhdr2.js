
	

	var Apvhdr = Backbone.Model.extend({
		urlRoot: "../api/s/apvhdr",
		initialize: function(){
			// on init set id for apvdtls
			this.set({id: guid()}, {silent:true});
		},
		defaults: {
			refno: '',
			date: '',
			supplierid: '',
			supprefno: '',
			porefno: '',
			terms: '',
			totamount: '',
			balance: '',
			notes: '',
			posted: '',
			cancelled: '',
			printctr: '',
			totline: ''
		}, 
		validation: {
			apvhdr: {
		    	required: true,
				msg: 'Please enter a value'
		   	},
		   	itemid: {
		    	required: true,
				msg: 'Please enter a account number'
		   	}	
		},
		blank: function(){
			this.clear();
			return this.defaults;
		}
	});
	var apvhdr = new Apvhdr();


	var Apvdtl = Backbone.Model.extend({
		urlRoot: '../api/t/apvdtl',
		defaults: { amount: 0.00 }
		/* moved to View
		toHTML: function(){
			var attrs = { }, k;
	        for(k in this.attributes) {
	            attrs[k] = this.attributes[k];
	            if(k === 'amount')
	               //attrs[k] = attrs[k].toFixed(2);
	           		//console.log(attrs[k]);
	           		attrs[k] = accounting.toFixed(attrs[k],2);
	        }
	        //console.log(attrs);
        	return attrs;
		}
		*/
	});
	var apvdtl = new Apvdtl();


	var Apvdtls = Backbone.Collection.extend({
		model: Apvdtl,
		initialize: function(){
			this.on('add', this.setApvhdrid, this);
		},
		setApvhdrid: function(model){
			
			model.set({'apvhdrid': apvhdr.get('id')});
		},
		getTotalField: function(field){
			return this.reduce(function(memo,value){
				//console.log(memo);
				return memo + value.get(field)
			}, 0)
		}
	});
	var apvdtls = new Apvdtls();


	var ApvdtlView = Backbone.View.extend({
		tagName: 'tr',
		initialize: function(){

			this.index;
			this.model.on('destroy', this.render, this);
			this.model.on('change', this.render, this);
			this.template = _.template('<td> <%=item%> '+
				'<div class="tb-data-action">'+
				'<a class="row-delete" data-id="" href="#">&nbsp;</a>'+
				'<a class="row-edit" data-id="" href="#">&nbsp;</a>'+
				'</div></td>'+
				'<td><%=itemcat%></td>'+
				'<td class="currency"><%=amount%></td>');
		},
		events: {
			'dblclick' : "clickMe",
			'click .row-edit': "editMe",
			'click .row-delete': "removeMe"
		},
		render: function(){
			
			var that = this;
			//item.url = '../api/s/item/'+  this.model.get('itemid');
			item.set({id: this.model.get('itemid')});
			item.fetch({
				success: function(model, respone){
					//console.log(JSON.stringify(model));
					var data = {
		                "item": model.get('code'), //or descritor
		                "itemcat": model.get('itemcat'),
		                "amount": accounting.formatMoney(that.model.get('amount'),{symbol:""})
		            }
		            that.$el.html(that.template(data));
				}
			});

			//console.log(item.toJSON());
		
			//this.model.toHTML();
			//console.log(JSON.stringify(this.templateData()));
			//this.$el.html(this.template(this.templateData()));
			//this.$el.html(this.template(this.model.toJSON()));
			return this;
		},
		clickMe: function(e){
			console.log("dsfsafsdadfafafa");
		},
		removeMe: function(e){
			e.preventDefault();
			console.log(this.model);
			this.model.destroy();
			//this.collection.remove(this.model);
			this.$el.remove();
		},
		editMe: function(e){
			$("#mdl-detail-save-item").text('Save Changes');

			this.index;
			//var index = this.collection.indexOf(this.model);
			this.index = $(e.currentTarget).closest('tr').index();
			console.log(this.model.toJSON());

			$('.table-detail .collection-index').val(this.index);
		},
		templateData: function(){
			// rewrite model to render for view
			var attrs = { }, k;
	        for(k in this.model.attributes) {
	            attrs[k] = this.model.attributes[k];
	            if(k === 'amount') {
	            	attrs[k] = accounting.formatMoney(attrs[k],{symbol:""});
	            } else if(k==='itemid'){
	            	//i = new Item({id: attrs[k]});
	            	item.set({id: attrs[k]});
	            	item.fetch({
	            		success: function(model, respone){
	            			//console.log(respone.descriptor);
	            			//var d = respone.descriptor;
	            		}
	            	});	

	            	
	            }
	        }
	        //console.log(attrs);
        	return attrs;
		}
	});


	var ApvdtlsView = Backbone.View.extend({
		el: '.items-tbody',
		initialize: function(){
			//console.log(this.collection);
			this.collection.on('remove', function(){
				//alert('remove');
			}, this);
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
			return this;
		},
		addAll: function(){
			this.collection.forEach(this.addOne, this);
		}
	});



	


	ModalDetailView = Backbone.View.extend({
		el: '.modal-tb-detail',
		initialize: function(){

			this.setDataId();
			this.model.on('change:id', this.setDataId, this);
			this.collection.on('add', this.computeTotal, this);
		},
		render: function(){

			var apvdtlsView = new ApvdtlsView({collection: apvdtls});
			apvdtlsView.render();
			
			return this;
		},
		setDataId: function(){
			this.$el.attr('data-apvhdrid', this.model.get('id'));
		},
		computeTotal: function(){
			var that = this;
			var totqty = 0;
			this.span = this.$el.children('tfoot').find('span.total');

			$.each(this.span, function(){
				var field = explode("-", $(this).attr('id'));

				var tot = that.collection.getTotalField(field[2]);
				//accounting.
				tot = accounting.formatMoney(tot,"");

				$(this).text(tot);
				$(".table-model #tot"+field[2]).val(tot);
			});

			/*
			var tot = this.collection.getTotalField('amount');
			tot = accounting.formatMoney(tot,"");
			console.log(tot);
			//console.log($(".table-model #totamount"));
			$(".table-model #totamount").val(tot);

			/*
			var that = this;
			var totqty = 0;
			this.span = this.$el.children('tfoot').find('span.total');

			$.each(this.span, function(){
				var field = explode("-", $(this).attr('id'));

				var tot = that.collection.getFieldTotal(field[2]);
				//accounting.
				tot = accounting.formatMoney(tot,"");

				$(this).text(tot);
				$(".table-model #tot"+field[2]).val(tot);
			});
			*/
		}
	});


	FormDetailView = Backbone.View.extend({
		el: '.modal-table-detail',
		initialize: function(){
			
		},
		events: {
			'click #mdl-detail-save-item': 'saveItem',
			'click #mdl-detail-cancel-item': 'cancelItem'
		},
		saveItem: function(){
			modelIndex = this.$el.find('.collection-index').val();
			if(_.isEmpty(modelIndex)){
				this.addItem();
			} else {
				this.updateItem(modelIndex);
			}
		},
		updateItem: function(idx){

			var m = this.collection.at(idx);
			var data = {
				//"id": $('.table-detail #id').val(),
				"qty": parseInt($('.table-detail #qty').val()),
				"unitcost": parseFloat($('.table-detail #unitcost').val())
			}
			m.set(data);
			console.log(m.toJSON());
		},
		addItem: function(){
			var data = this.$el.serializeObject2();
			var data1 = {
				//"id": $('.table-detail #id').val(),
				"id": guid(),
				"qty": parseInt($('.table-detail #qty').val()),
				"unitcost": parseFloat($('.table-detail #unitcost').val()),
				"itemid": $('.table-detail #itemid').val()
			}

			console.log(data);

			if(!data.itemid || !data.amount){
				console.log('no amount and item selected');
			}

			if(_.isEmpty(data)){
				console.log('empty');
			} else {
				this.collection.add(data);
			}		
			this.clearForm();
			$(".search-detail").focus();
		},
		cancelItem: function(e){
			this.clearForm();
			$("#mdl-detail-save-item").text('Save');
		},
		clearForm: function(){
			this.$el.clearForm()
		}

	});




var ApvhdrModal = ModalBodyView.extend({
	initialize: function() {
		this.parentMode = true;
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-apvhdr-tpl').html());
        this.template2 = _.template($('#modal-apvhdr-readonly-tpl').html());
	}
});






$(document).ready(function(e) {
	
	var appRouter = new Router();
	var appView = new AppView({model: app});
	
	var apvhdrModalView = new ApvhdrModal({model: apvhdr, collection: apvdtls});
	apvhdrModalView.render();
	var apvhdrDataGridView = new DataGridView({model: apvhdr});






	Backbone.history.start();




	var detailView = new ModalDetailView({model: apvhdr, collection: apvdtls});
	detailView.render();


	var formDetailView = new FormDetailView({model: apvdtl, collection: apvdtls});
	formDetailView.render();



	apvhdr.set({
		refno: '00001',
		date: '2013-07-17',
		supplierid: 'd54fdfdsff5fds54ffd5fs44f5d',
		terms: 5,
		balance: 100.90,
		totamount: 20.20,
		id: 'dfad415df5f4as5dfafas54fd5' 
	});

	
	apvdtls.add([
		{
			itemid: '2d39aa80235411e3979cc0188508f93c',
			amount: 1
		},
		{
			itemid: '2f23e8bc22b911e3b8cbc0188508f93c',
			amount: 5249.99
		},
		{
			itemid: '63890fd622c211e3b8cbc0188508f93c',
			amount: 11.12
		},
		{
			itemid: '09b0054c22b611e3b8cbc0188508f93c',
			amount: 11.10
		}

	]);

});
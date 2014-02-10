var removedModel = [];
var date = new Date();

/* moved to models.js 11-22-2013
var Apvhdr = Backbone.Model.extend({
		urlRoot: "../api/t/apvhdr",
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
			
		},
		post: function(){
			var aData;

			$.ajax({
		        type: 'POST',
		        contentType: 'application/json',
				url: '../api/txn/post/apvhdr/' + this.get('id') ,
		        dataType: "json",
		        async: false,
		        //data: formData,
		        success: function(data, textStatus, jqXHR){
					aData = data; 			
		        },
		        error: function(jqXHR, textStatus, errorThrown){
		            alert(textStatus + 'Failed on creating '+ table +' data');
		        }
		    });

		    return aData;

			
		}
	});
	var apvhdr = new Apvhdr();
	*/
	//apvhdr.blank();


var Apvdtl = Backbone.Model.extend({
	urlRoot: '../api/s/apvdtl',
	defaults: {
		itemid: '',
		amount: 0
	}
});
var apvdtl = new Apvdtl();

Apvdtls = Backbone.Collection.extend({
	model: Apvdtl,
	initialize: function(){
		
	},
	saveAll: function(apvdtl) {

        _.each(removedModel, function(item){
        	item.destroy();
        } );
        
        removedModel = [];

        _.each(this.models, function(apvdtl) {
            apvdtl.set({'apvhdrid': apvhdr.get('id')}, {silent: true});
       		apvdtl.save();
        });
    },
    deleteAll: function(apvdtl) {

        _.each(this.models, function(apvdtl) {
       		apvdtl.destroy();
        });
    },
    onAddModel: function(model){
		//console.log('set apvhdrid');	
		model.set({'apvhdrid': apvhdr.get('id')}, {silent: true});
	},
	getFieldTotal: function(field){
		return this.reduce(function(memo,value){
			return memo + parseFloat(value.get(field))
		}, 0)
	}
	
});
var apvdtls = new Apvdtls();


/*
var Apvhdr = Backbone.Model.extend({
	urlRoot: '../api/s/apvhdr',
	initialize: function(){
		//var that = this;
		//this.items = new Apvdtls();
		//this.items.url = '../api/txn/apvdtl/apvhdr/'+ this.get('id');
		//this.items.on('reset', this.updateFields, this);
		//this.items.on('add', this.updateFields, this);
		//this.items.on('change', this.computeTotamount, this);
		//this.set({id: 1});
	},
	updateFields: function(){
		//this.computeTotamount();
		this.set({totamount: this.items.getFieldTotal('amount')}, {silent: true});
		this.set({totline: this.items.length});
	}
});
*/



	var ApvdtlView = Backbone.View.extend({
		tagName: 'tr',
		initialize: function(){

			this.model.on('remove', this.removeMe, this);
			this.model.on('destroy', this.render, this);
			this.model.on('change', this.render, this);
			
			this.template = _.template('<td data-item="<%=item%>"> <%=item%> '+
				'<div class="tb-data-action">'+
				'<a class="row-delete" data-id="" href="#">&nbsp;</a>'+
				'<a class="row-edit" data-id="" href="#">&nbsp;</a>'+
				'</div></td>'+
				//'<td><%=itemcat%></td>'+
				'<td class="currency"><%=amount%></td>');
		},
		events: {
			'dblclick td:first-of-type' : "clickMe"
			//'click .row-edit': "editMe"
			//'click .row-delete': "removeMe"
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
		removeMe: function(){
			//e.preventDefault();
			//console.log(this.model);
			//this.model.destroy();
			//this.collection.remove(this.model);
			this.$el.remove();

			//var idx = $(e.currentTarget).closest('tr').index();
			//var m = this.collection.at(idx);
			//console.log(m.toJSON());
			removedModel.push(this.model);
		},
		editMe: function(e){
			e.preventDefault();
			$("#mdl-detail-save-item").text('Save Changes');

			this.index;
			//var index = this.collection.indexOf(this.model);
			this.index = $(e.currentTarget).closest('tr').index();
			//console.log(this.model.toJSON());

			this.renderToForm();

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

			this.collection.on('reset', this.addAll, this);
			this.collection.on('add', this.addOne, this);
		},
		events: {
			'click .row-edit': "editMe",
			'click .row-delete': "removeMe"
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
		},
		editMe: function(e){
			e.preventDefault();
			$("#mdl-detail-save-item").text('Save Changes');

			var idx = $(e.currentTarget).closest('tr').index();
			var itemName = $(e.currentTarget).parent().parent().data('item');
			var m = this.collection.at(idx);

			this.renderToForm(m);

			$('.modal-table-detail .search-detail').val(itemName);

		},
		removeMe: function(e){
			e.preventDefault();
			var idx = $(e.currentTarget).closest('tr').index();
			var m = this.collection.at(idx);

			this.collection.remove(m); // ApvdtlView.removeMe triggered
		},
		renderToForm: function(model){
			var attrs = { }, k;
	        for(k in model.attributes) {
	            attrs[k] = model.attributes[k];

	            $('.modal-table-detail #'+k).val(attrs[k])    
	        }
		}
	});





var	ParentChildModal = Backbone.View.extend({
		//el: '.modal-parent-child',
		el: '.modal-dialog',
		initialize: function(){
			this.modalTitle = this.$('.modal-title');

			var items = this.collection;
			items.on('change', this.recomputeAmount, this);
			items.on('add', this.recomputeAmount, this);
			items.on('remove', this.childRemove, this);
			items.on('reset', this.clearItemsBody, this);
			
			//this.populate();
			this.model.on('change:refno', this.populate, this);
			this.model.on('change:totamount', this.repopulateAmount, this);
			this.model.on('change:totline', this.repopulateAmount, this);
			this.model.on('change:mode', this.checkMode, this);


			this.templateParent = _.template($('#modal-apvhdr-tpl').html());
			this.templateChild = _.template($('#modal-apvdtls-tpl').html());
			this.templateItems = _.template($('#modal-items-tpl').html());
			this.render();
		},
		showfields: {
			refno: 'Ref No',
			date: 'Date',
			supplier: 'Supplier',
			supprefno: 'Supplier Ref No',
			porefno: 'PO Ref No',
			terms: 'terms',
			totamount: 'Total Amount',
			balance: 'Balance',
			posted: 'Posted'
		},
	    events: {
	    	'click input[type=checkbox].toggle': 'toggleSerialized',
	    	'click .model-btn-save': 'modalSave',
	    	'click .model-btn-save-blank': 'modalSave',
	    	'click .model-btn-delete': 'modalDelete',
	    	'click .model-btn-cancel': 'modalCancel',
	    	'click #modal-btn-delete-yes': 'modalConfirmDelete',
	    	'click #modal-btn-post-yes': 'modalConfirmPosting',
	    	'blur .table-model input': 'checkValidity',
	    	//'blur input': 'updateModel', kelangan mo pa ito gawin about validationError
	    	'change #supplierid': 'populateTerm',
	    	'change select': 'checkValidity',
	    	'blur textarea': 'checkValidity',
	    	'keyup #code': 'toUpper'
	    },
	    toUpper: function(e){
	    	console.log('to upper');
	    	return $(e.currentTarget).val().toUpperCase();
	    },
		render: function(){
			
			this.$el.find('.modal-body-parent').html(this.templateParent());
			this.$el.find('.modal-body-child').html(this.templateChild());
			this.$el.find('.modal-body-item').html(this.templateItems());
			
			$(".table-model #date").datepicker({"dateFormat": "yy-mm-dd",
				select: function(event, ui){

				}
			});

			this.modalChangeTitle();
			return this;
		},
		checkMode: function(){
			
			var mode = this.model.get('mode');
		        if(mode==='delete' || mode==='posting'){
		        	this.modelInputsDisable();
		        	this.dataActionHide();
		        } else {
		        	this.modelInputsEnable();
		        	this.dataActionShow();
		        }

		    this.modalChangeTitle();
		},
		modelInputsDisable: function(){
			var attrs = { }, k;
			for(k in this.model.defaults) {
		         this.$el.find(".table-model #"+k).prop( "disabled", true );
		    }
		    this.$el.find(".table-model .toggle").prop( "disabled", true );
		},
		modelInputsEnable: function(){
			var attrs = { }, k;
			for(k in this.model.defaults) {
		         this.$el.find(".table-model #"+k).prop("disabled", false );
		    }
		    this.$el.find(".table-model .toggle").prop( "disabled", false );
		},
		recomputeAmount: function(apvdtl){
			var tot = this.collection.getFieldTotal('amount');
			var line = this.collection.length;
			
			this.model.set({totamount: tot, totline: line});
			
		},
		populate: function(){
			//console.log('populate');
			var attrs = { }, k;
			for(k in this.model.attributes) {
				//attrs[k] = apvdtl.attributes[k];
				//console.log(k+'-'+attrs[k]);
		        if(k === 'totamount' || k === 'balance'){
		        	var x = accounting.formatMoney(this.model.get(k),{symbol:""});
		        	this.$el.find("#"+k).val(x);
		        } else if(k === 'date'){
		        	if(this.model.isNew()){
		        		var today = moment();
		        		this.$el.find("#"+k).val(today.format("YYYY-MM-DD"));
		        	} else {
		        		this.$el.find("#"+k).val(this.model.get(k));
		        	}
		        } else if(k=='cancelled'){
		        	console.log(this.model.toJSON());
		        	if(this.model.get(k) == 1){
		        		this.$el.find(".table-model #toogle-"+k).prop('checked', true);
		        	} else {
		        		this.$el.find(".table-model #toogle-"+k).prop('checked', false);
		        	}
		        	this.$el.find("#"+k).val(this.model.get(k));
		        } else if(k=='terms'){
		        	if(_.isEmpty(this.model.get(k))){
		        		alert(k +'is empty!');
		        		this.populateTerm();
		        	} else {
		        		this.$el.find("#"+k).val(this.model.get(k));
		        	}
		        } else { 
		        	this.$el.find("#"+k).val(this.model.get(k));
		        }  

		        
		        var mode = this.model.get('mode');
		        if(mode==='delete' || mode==='posting'){
		        	this.$el.find("#"+k).prop( "disabled", true );
		        } else {
		        	this.$el.find("#"+k).prop( "disabled", false );
		        }
		        
		    }    
		},
		repopulateAmount: function(){
			var attrs = { }, k;
			for(k in this.model.attributes) {
				if(k === 'totamount'){
		        	//console.log(JSON.stringify(this.model.toJSON()));
		        	var x = accounting.formatMoney(this.model.get('totamount'),{symbol:""});
		        	this.$el.find("#"+k).val(x);
		        } else if(k === 'totline'){
		        	
		        	this.$el.find("#"+k).val(this.model.get('totline'));
		        }  

		    }
		},
	    modalChangeMode: function(){
	    	this.modalChangeTitle();
	    },
		modalChangeTitle: function(){
	    	this.$('.modal-title').text(this.model.get('text'));  	
	    	
	    	var btn, mode = this.model.get('mode');

	        if(mode=='delete'){
	        	btn = '<p style="display: inline; float: left; margin: 10px 0; color: #3B5998;">Are you sure you want to delete this record?</p>';
	        	btn += '<button type="button" id="modal-btn-delete-yes" class="btn btn-primary model-btn-yes" data-dismiss="modal">Yes</button>';
	          	btn += '<button type="button" id="modal-btn-delete-no" class="btn btn-default model-btn-no" data-dismiss="modal" >No</button>';
	        
	          	//this.$('.modal-footer').html(btn);
	        } else if(mode=='posting'){

                btn = '<p style="display: inline; float: left; text-align: left; margin: 0; color: #3B5998;">'
                btn += 'You are about to POST this transaction. ';
                btn += '<br>Posted transactions may not be unposted; use adjusting transactions to reverse.';
                btn += '<br>Are you really sure?';
                btn += '</p>';
	        	btn += '<button type="button" id="modal-btn-post-yes" class="btn btn-primary model-btn-yes" data-dismiss="modal">Yes</button>';
	          	btn += '<button type="button" id="modal-btn-post-no" class="btn btn-default model-btn-no" data-dismiss="modal" >No</button>';
	        } else {
	          	btn = '<button type="button" id="modal-btn-save" class="btn btn-primary model-btn-save" data-dismiss="modal" disabled>Save</button>';
	          	btn += '<button type="button" id="modal-btn-save-blank" class="btn btn-primary model-btn-save-blank" disabled>Save &amp; Blank</button>';
	          	btn += '<button type="button" id="modal-btn-cancel" class="btn btn-default model-btn-cancel" data-dismiss="modal">Cancel</button>';
	        	
	        	//this.$('.modal-footer').html(btn);
	        }
	        this.$('.modal-footer').html(btn);  
    	},
    	checkValidity: function(e){
    		/*
			var input = $(e.currentTarget);
			var req = this.$('input[required]', '.table-model');

			if(req){
				req.each(function(){
					if($(this).val()==''){
						$(".model-btn-save").attr('disabled','disabled');	
						$(".model-btn-save-blank").attr('disabled','disabled');
					} else {
						$(".model-btn-save").removeAttr('disabled');
						$(".model-btn-save-blank").removeAttr('disabled');
					}
				});
			} else {
				this.$(".model-btn-save").removeAttr('disabled');
				this.$(".model-btn-save-blank").removeAttr('disabled');
			}	
			*/

			var that = this;

			var req = this.$('.table-model input[required]', '.table-model');
			//console.log(req);

			if(req){
				req.each(function(){
					if($(this).val()==''){
						//$(".model-btn-save").attr('disabled','disabled');	
						//$(".model-btn-save-blank").attr('disabled','disabled');
						that.btnSaveDisable();
					} else {
						//$(".model-btn-save").removeAttr('disabled');
						//$(".model-btn-save-blank").removeAttr('disabled');
						that.btnSaveEnable();
					}
				});
			} else {
				that.btnSaveEnable();
				//this.$(".model-btn-save").removeAttr('disabled');
				//this.$(".model-btn-save-blank").removeAttr('disabled');
			}	
		},
		modalSave: function(){

	   		var that = this;
			var data = this.$el.find('.table-model').serializeObject2();
			var isnew = false;

			console.log(data);
				
			if(this.model.isNew()){
				isnew = true;
			}

			this.model.set(data, {silent: true});

			if(this.model.isValid(true)){
				clear_alert();
				this.model.unset('mode', {silent: true}); //remove the added model field
				this.model.unset('text', {silent: true}); 
				//console.log(this.model.toJSON());
				this.model.save({},{
			  		success: function(model, respone){
			  			if(respone.status==='error'){
			  				set_alert(respone.status, 'Oh snap!', respone.message);
			  			} else if(respone.status==='warning'){
			  				set_alert(respone.status, 'Warning!', respone.message);
			  			} else {
			  				if(isnew){
			  					var showData = that.addTableData(respone);
			  					console.log(showData);
			  					// 439
			  					addTableData3(respone); //addTableData3 for posting
								set_alert('success','Well done!', 'Success on saving!');
							} else {
								// 1224
								updateTableData4(respone);
								set_alert('success','Yeay!', 'Success on updating!');
							}

							that.collection.saveAll();
			  			}
					}	
			  	});
			} else {
				console.log("invalid :"+ this.model.validationError);
			}
	    },
	    addTableData: function(respone){

	    	var attrs = { }, k, f;
			for(f in this.showfields) {
		         for(k in respone){
		         	if(f == k){
		         		attrs[f] = respone[f]
		         	} 
		    	}
		    }
	    	return attrs;
	    },
	    clearForm: function(){
	    	this.model.blank(); // added next line because model.clear delete all attrib
	    	
	    	this.collection.reset();
	    	this.$el.find('.table-model').clearForm();

	    	var today = moment();
		    this.$el.find("#date").val(today.format("YYYY-MM-DD"));
    	},
    	clearItemsBody: function(){
    		this.$el.find('.items-tbody').html('');
    	},
	    childRemove: function(){
	    	var tot = this.collection.getFieldTotal('amount');
			var line = this.collection.length;
			
			this.model.set({totamount: tot, totline: line});
	    	this.btnSaveEnable();
	    },
	    modalConfirmDelete: function(){
	    	var that = this;

	    	if(this.model.get('posted') == 1){
	    		alert('unable to delete. APV is already posted!');
	    	} else {
	    		console.log('delete all');

	    		var apvdtlsDelete = new Apvdtls();
				apvdtlsDelete.url = '../api/txn/delete/apvdtl/apvhdr/'+ this.model.get('id');
				apvdtlsDelete.fetch({
					success: function(collection, respone){
						console.log(respone);
			    		that.model.destroy({
			    			success: function(model, respone){
			    				console.log(respone);
			    			}
			    		});
			    		
					}
				});
	    	}
	    },
	    modalConfirmPosting: function(){
	    	var m;
	    	m = this.model.post();
	    	
	    	if(m.status == 'success'){
	    		console.log(m.data.apvhdr.balance);
	    		set_alert(m.status,'Yeay!', m.message);
	    	
		    	// animate tb-data row
		    	$('.tb-data tr[id='+this.model.get('id')+']').find('td').each(function() {	    		
		    		var child = $(this).children().children();
		    		child.each(function(){
		    			if($(this).hasClass('row-view')){

		    			} else {
		    				$(this).remove(); // remove tb-actions (edit, delete, post)
		    			}
		    		});
		    		// update balance
		    		if($(this).index() == 7){
		    			$(this).text(m.data.apvhdr.balance);
		    			$(this).toCurrency();
		    		}
		    		// update status
		    		if($(this).hasClass('posted')){
		    			$(this).text('✔');

		    		}

					$(this).effect("highlight", {}, 3000);
				});
	    	} else if(m.status == 'error'){
	    		set_alert(m.status,'Ooops!!', m.message);
	    	} else {
	    		set_alert(m.status,'Ooops!!', m.message);
	    	}
	    },
	    btnSaveEnable: function(){
	    	$(".model-btn-save").prop('disabled', false);	
			$(".model-btn-save-blank").prop('disabled', false);
	    },
	    btnSaveDisable: function(){
	    	$(".model-btn-save").attr('disabled', true);	
			$(".model-btn-save-blank").attr('disabled', true);
	    },
	    dataActionHide: function(){
		    $('.modal-tb-detail .tb-data-action').hide();
		    $('.modal-table-detail').hide();
		},
		dataActionShow: function(){
		    $('.modal-tb-detail .tb-data-action').show();
		    $('.modal-table-detail').show();
		},
		appendBlank: function(){
			//console.log('append blank');
			this.clearForm();
			this.clearItemsBody();
			this.modelInputsEnable();
		   	this.dataActionShow();
			this.model.set({mode: 'add', text: 'Add Record'});
		},
    	toggleSerialized: function(e){
    		var input = $(e.currentTarget);
    		var i = input.data('input');
    		var v = this.$el.find('#'+ i).val();
    		var m = this.model.get('posted');
			
			if(input.prop('checked')){
	    		this.$el.find('#'+ i).val(1);
	    	} else {
				this.$el.find('#'+ i).val(0);
			}
    	},
    	populateTerm: function(){
    		var that = this;
			var supplierid = $('#supplierid').val();
			var supplier = new Supplier();
			supplier.set({id: supplierid});
			supplier.fetch({
				success: function(model, respone){
					that.$el.find("#terms").val(model.get('terms'));
				}
			});
    	}



	});


var	ModalDetailView = Backbone.View.extend({
		el: '.modal-tb-detail',
		initialize: function(){

			this.setDataId();
			this.model.on('change:id', this.setDataId, this);
			//this.collection.on('add', this.computeTotal, this);
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

			/*
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


var	FormDetailView = Backbone.View.extend({
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
			
			//console.log(data);

			if(_.isEmpty(data)){
				console.log('empty');
				$(".search-detail").focus();
			} else {
				if(!data.itemid || !data.amount){
					if(!data.itemid){
						$(".search-detail").val('');
						$(".search-detail").focus();
					} else {
						$("#amount").focus();
					}
				} else {
					
					if(data.id==undefined || data.id==''){
						console.log('add to collection');
						this.collection.add(data);	
					} else {
						console.log('edit to collection');
						this.collection.each(function(apvdtl){
							if(data.id == apvdtl.get('id')){
								var attrs = { }, k;
						        for(k in apvdtl.attributes) {
						            attrs[k] = apvdtl.attributes[k];
						            console.log(data[k] +'-'+ attrs[k]);
						            if(data[k] == attrs[k]){
						            	console.log('same');
						            } else {
						            	console.log('not same');
						            	apvdtl.set(k, data[k]);
						            }
						           
						        }
							}
						}, this);
						//this.collection.set(data);
					}
					

					this.clearForm();
					$(".search-detail").focus();
					$("#mdl-detail-save-item").text('Add');
				}
			}

			
		},
		cancelItem: function(e){
			this.clearForm();
			$("#mdl-detail-save-item").text('Add');
		},
		clearForm: function(){
			this.$el.clearForm()
		},
		renderToForm: function(data){
			console.log(data);
		}

	});

var DataGridView = Backbone.View.extend({
		el: '.tb-data',
		initialize: function(){
			this.model.on('destroy',this.removeRow, this);
			//this.model.on('change:posted',this.successPosting, this);
		},
		events: {
			//'click tr[data-id]': 'rowSelect',
			'dblclick tr[data-id]': 'rowDblclick',
			'click .select-all': 'selectAll',
			'click .row-edit': 'rowEdit',
			'click .row-delete': 'rowDelete',
			'click .row-post': 'rowPost',
			'click .row-view': 'rowDblclick'
		},
		rowSelect: function(e){
			clear_alert();
			var id = $(e.currentTarget).data('id');
			this.model.set({'id':id});	
			this.model.fetch({
				beforeSend: function(){
					//console.log('fetching: '+ id);
				}	
			});	
		},
		rowDblclick: function(e){
			console.log('row Dblclick');
		},
		removeRow: function(){
			oTable.fnDeleteRow($('tr#'+ this.model.get('id')));	
		},
		selectAll: function(e){
			var $checkboxes = $("tbody tr td:first-of-type input[type=checkbox]");
			if($(e.currentTarget).is("input:checked")){
				$checkboxes.prop('checked',true);
			} else {
				$checkboxes.prop('checked',false);
			}
		},
		rowEdit: function(e){
			e.preventDefault();
			e.stopPropagation();
			var that = this;

			if(this.model.get('mode') == 'edit'){

			} else {
				this.model.set({mode: 'edit', text: 'Edit Record'});
			}
			
			//console.log(this.options.settings.toJSON());
			var id = $(e.currentTarget).parent().parent().parent().data('id');
			if(this.model.get('id') == id){
				console.log('same id as model');
			} else {
				this.model.set({'id':id});	
				this.model.fetch({
					beforeSend: function(){
						//console.log('fetching: '+ id);
					},
					success: function(model, respone){
						//console.log(respone)
						//that.renderToFormForEdit(respone);

						//var apvhdrView = new ParentChildModal({model: apvhdr, collection: apvdtls});
						apvdtls.reset();
						apvdtls.url = '../api/txn/apvdtl/apvhdr/'+ model.get('id');
						apvdtls.fetch();			
					}	
				});	
			}
			//console.log(this.model.toJSON());
			//$(".modal .modal-title").text('Edit');
			$(".modal").modal('show');  
			
		},
		rowDelete: function(e){
			e.preventDefault();
			e.stopPropagation();
			var that = this;

			if(this.model.get('mode') == 'delete'){

			} else {
				this.model.set({mode: 'delete', text: 'Delete Record'});
			}
			
			//console.log(this.options.settings.toJSON());
			var id = $(e.currentTarget).parent().parent().parent().data('id');

			if(this.model.get('id') == id){
				console.log('same id as model');
			} else {
				this.model.set({'id':id});	
				this.model.fetch({
					beforeSend: function(){
						//console.log('fetching: '+ id);
					},
					success: function(model, respone){
						//console.log(respone)
						//that.renderToFormForEdit(respone);

						//var apvhdrView = new ParentChildModal({model: apvhdr, collection: apvdtls});
						apvdtls.reset();
						apvdtls.url = '../api/txn/apvdtl/apvhdr/'+ model.get('id');
						apvdtls.fetch();			
					}
				});
			}	
			//console.log(this.model.toJSON());
			//$(".modal .modal-title").text('Edit');
			$(".modal").modal('show');
			
		},
		rowPost: function(e){
			e.preventDefault();
			e.stopPropagation();
			var that = this;

			
			this.model.set({mode: 'posting', text: 'Posting Record'});
			//console.log(this.options.settings.toJSON());
			var id = $(e.currentTarget).parent().parent().parent().data('id');

			if(this.model.get('id') == id){
				console.log('same id as model');
			} else {
				this.model.set({'id':id});	
				this.model.fetch({
					beforeSend: function(){
						//console.log('fetching: '+ id);
					},
					success: function(model, respone){
						apvdtls.reset();
						apvdtls.url = '../api/txn/apvdtl/apvhdr/'+ model.get('id');
						apvdtls.fetch();
										
					}
				});
			}	

			$(".modal").modal('show');

		},
		renderToFormForEdit: function(data){
			for(key in data){
				if(key.substr(key.length - 2) === 'id'){
					$(".table-model").find('#'+key+' option[value='+data[key]+']').attr('selected', 'selected');
				}
			}
		},
		renderToFormForDelete: function(data){
			for(key in data){
				if(key.substr(key.length - 2) === 'id' || key =='type'){
					var opt = $(".table-model").find('#'+key+' option[value='+data[key]+']').text();
					console.log(key);
					$(".table-model-delete").find('#'+key).val(opt);
				}
			}
		},
		rowDblclick: function(e){
			e.preventDefault();
			e.stopPropagation();

			var id = $(e.currentTarget).data('id');
			if(_.isEmpty(id)){
				id = $(e.currentTarget).parent().parent().parent().data('id');
			}
			window.open('accounts-payable-print/'+id);
		},
		successPosting: function(){
			alert('successPosting');
		}
	});

 






$(document).ready(function() {

	
	
	/*
	var apvhdrView = new ParentChildModal({model: apvhdr, collection: apvdtls}) ;

	var detailView = new ModalDetailView({model: apvhdr, collection: apvdtls});
	detailView.render();

	var formDetailView = new FormDetailView({model: apvdtl, collection: apvdtls});
	formDetailView.render();

	apvhdr.set({
		refno: '00001',
		date: '2013-07-17',
		terms: 5,
		balance: 100.90,
		totline: 4,
		totamount: 20.20 
	});

	apvhdrView.populate();

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
	//console.log(apvhdr.items);
	//console.log(apvhdr.toJSON());
	*/


});
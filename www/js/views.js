
_.extend(Backbone.Validation.callbacks, {
		valid: function(view, attr, selector) {
			var input = view.$('[' + selector + '=' + attr + ']');
			input.next('span.error').remove();
			
			//console.log('valid');
	  	},
	  	invalid: function(view, attr, error, selector) {
	  		console.log(view);
			console.log(attr);
			console.log(error);
			console.log(selector);
			var input = view.$('[' + selector + '=' + attr + ']');
			//console.log(input);
			input.next('span.error').remove();
			var span = '<span class="error">'+ error +'</span>';
			input.addClass('invalid');
			input.focus();
			input.after(span);
			
			//console.log('invalid');
	  	}
	});





var ModalBodyView = Backbone.View.extend({
	el: '.modal-dialog',
	initialize: function() {
		// Initialize 
		//Backbone.Validation.bind(this);
		//this.modalTitle = this.$('.modal-title');
		//this.model.on('change', this.render, this);
		//this.options.settings.on('change', this.modalChangeMode, this);
		
        //this.template = _.template($('#modal-itemcat-tpl').html());
        //this.template2 = _.template($('#modal-itemcat-readonly-tpl').html());

    },
    events: {
    	'click .model-btn-save': 'modalSave',
    	'click .model-btn-save-blank': 'modalSave',
    	'click .model-btn-delete': 'modalDelete',
    	'click .model-btn-cancel': 'modalCancel',
    	'click .model-btn-yes': 'modalConfirmDelete',
    	'blur input': 'checkValidity',
    	//'blur input': 'updateModel', kelangan mo pa ito gawin about validationError
    	'change select': 'checkValidity',
    	'blur textarea': 'checkValidity'
    },
    render: function() {
    	console.log(this.model.toJSON());
    	var mode = this.model.get('mode');
        if(mode==='delete'){
        	this.$('.modal-body').html(this.template2(this.model.toJSON()));
        } else {
        	this.$('.modal-body').html(this.template(this.model.toJSON()));
        }
        this.modalChangeTitle();
        return this;
        
    },
    modalSave: function(){

   		var that = this;
		var data = this.$el.find('.table-model').serializeObject2();
		var isnew = false;
			
		if(this.model.isNew()){
			isnew = true;
		}

		this.model.set(data, {silent: true});

		if(this.model.isValid(true)){
			clear_alert();
			this.model.unset('mode', {silent: true}); //remove the added model field
			this.model.unset('text', {silent: true}); 
			console.log(this.model.toJSON());
			this.model.save({},{
		  		success: function(model, respone){
		  			if(respone.status==='error'){
		  				set_alert(respone.status, 'Oh snap!', respone.message);
		  			} else if(respone.status==='warning'){
		  				set_alert(respone.status, 'Warning!', respone.message);
		  			} else {
		  				if(isnew){
		  					console.log(respone);
		  					addTableData2(respone);
							set_alert('success','Well done!', 'Success on saving!');
						} else {
							updateTableData3(respone)
							set_alert('success','Yeay!', 'Success on updating!');
						}
		  			}
				}	
		  	});
		} else {
			console.log("invalid :"+ this.model.validationError);
		}
    },
    clearForm: function(){
    	this.model.blank(); // added next line because model.clear delete all attrib
    	this.$el.find('.table-model').clearForm();
    },
    modalConfirmDelete: function(){
    var that = this;
    	this.model.destroy({
    		success: function(model, response) {
    			//oTable.fnDeleteRow($('tr#'+ that.model.get('id')));	
		  		//oTable.fnDraw();
		  		set_alert('success','Yeay!', 'Success on deleting '+ model.get('code') +'!');	
		  		}
			});
    },
    modalChangeMode: function(){
    	this.modalChangeTitle();
    },
    modalChangeTitle: function(){
    	this.$('.modal-title').text(this.model.get('text'));      	
    	
    	var btn, mode = this.model.get('mode');

        if(mode=='delete'){
        	btn = '<p style="display: inline; float: left; margin: 10px 0; color: #3B5998;">Are you sure you want to delete this record?</p>';
        	btn += '<button type="button" id="modal-btn-yes" class="btn btn-primary model-btn-yes" data-dismiss="modal">Yes</button>';
          	btn += '<button type="button" id="modal-btn-no" class="btn btn-default model-btn-no" data-dismiss="modal" >No</button>';
        
          	//this.$('.modal-footer').html(btn);
        } else {
          	btn = '<button type="button" id="modal-btn-save" class="btn btn-primary model-btn-save" data-dismiss="modal" disabled>Save</button>';
          	btn += '<button type="button" id="modal-btn-save-blank" class="btn btn-primary model-btn-save-blank" disabled>Save &amp; Blank</button>';
          	btn += '<button type="button" id="modal-btn-cancel" class="btn btn-default model-btn-cancel" data-dismiss="modal">Cancel</button>';
        	
        	//this.$('.modal-footer').html(btn);
        }
        this.$('.modal-footer').html(btn);  
        
    },
    checkValidity: function(e){
    		var input = $(e.currentTarget);
			
			var input = $(e.currentTarget);
			var req = this.$('input[required]');


			req.each(function(){
				
				if($(this).val()==''){
					console.log($(this).val());
				}
			});

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
				/*
				if(req.val()==''){
					
					this.$(".model-btn-save").attr('disabled','disabled');	
					this.$(".model-btn-save-blank").attr('disabled','disabled');
				} else {
					this.$(".model-btn-save").removeAttr('disabled');
					this.$(".model-btn-save-blank").removeAttr('disabled');
				}*/
			} else {
				this.$(".model-btn-save").removeAttr('disabled');
				this.$(".model-btn-save-blank").removeAttr('disabled');
			}	
			
	},
	valid: function(){
    	clear_alert();
    	set_alert('success','Yeaps!','success on validating!')
  	},
  	invalid: function(){
    	clear_alert();
    	set_alert('error','Ooh no!','Error on validating!')
  	},
  	updateModel: function(el){
	    var $el = $(el.target);
	    console.log($el);
	    //this.model.set($el.attr('name'), $el.val());
  	}

});

var DataGridView = Backbone.View.extend({
		el: '.tb-data',
		initialize: function(){
			this.model.on('destroy',this.removeRow, this);
		},
		events: {
			//'click tr[data-id]': 'rowSelect',
			//'dblclick tr[data-id]': 'rowDblclick',
			'click .select-all': 'selectAll',
			'click .row-edit': 'rowEdit',
			'click .row-delete': 'rowDelete'
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

			this.model.set({mode: 'edit', text: 'Edit Record'});
			//console.log(this.options.settings.toJSON());
			var id = $(e.currentTarget).parent().parent().parent().data('id');
			this.model.set({'id':id});	
			this.model.fetch({
				beforeSend: function(){
					//console.log('fetching: '+ id);
				},
				success: function(model, respone){
					that.renderToFormForEdit(respone);
				}	
			});	
			//console.log(this.model.toJSON());
			//$(".modal .modal-title").text('Edit');
			$(".modal").modal('show');  
			
		},
		rowDelete: function(e){
			e.preventDefault();
			e.stopPropagation();
			var that = this;

			this.model.set({mode: 'delete', text: 'Delete Record'});
			//console.log(this.options.settings.toJSON());
			var id = $(e.currentTarget).parent().parent().parent().data('id');
			this.model.set({'id':id});	
			this.model.fetch({
				beforeSend: function(){
					//console.log('fetching: '+ id);
				}	
			});	
			//console.log(this.model.toJSON());
			//$(".modal .modal-title").text('Edit');
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
		}
	});



var AcctcatModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-acctcat-tpl').html());
        this.template2 = _.template($('#modal-acctcat-readonly-tpl').html());
	}
});

var AccountModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-account-tpl').html());
        this.template2 = _.template($('#modal-account-readonly-tpl').html());
	}
});




var ItemcatModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-itemcat-tpl').html());
        this.template2 = _.template($('#modal-itemcat-readonly-tpl').html());
	}
});

var ItemModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-item-tpl').html());
        this.template2 = _.template($('#modal-item-readonly-tpl').html());
	}
});

var MatcatModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-matcat-tpl').html());
        this.template2 = _.template($('#modal-matcat-readonly-tpl').html());
	}
});

var MaterialModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-material-tpl').html());
        this.template2 = _.template($('#modal-material-readonly-tpl').html());
	}
});

var SupplierModal = ModalBodyView.extend({
	initialize: function() {
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-supplier-tpl').html());
        this.template2 = _.template($('#modal-supplier-readonly-tpl').html());
	}
});

var BankModal = ModalBodyView.extend({
	initialize: function() {
		Backbone.Validation.bind(this);
		this.modalTitle = this.$('.modal-title');
		this.model.on('change', this.render, this);
		this.template = _.template($('#modal-bank-tpl').html());
        this.template2 = _.template($('#modal-bank-readonly-tpl').html());
        this.model.on('validated:valid', this.valid, this);
    	this.model.on('validated:invalid', this.invalid, this);
	}
});





$(document).ready(function(e) {

	
	
	
});
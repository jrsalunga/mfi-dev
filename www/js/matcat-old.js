


_.extend(Backbone.Validation.callbacks, {
		valid: function(view, attr, selector) {
			var input = view.$('[' + selector + '=' + attr + ']');
			input.next('span.error').remove();
			
			console.log('valid');
	  	},
	  	invalid: function(view, attr, error, selector) {
			var input = view.$('[' + selector + '=' + attr + ']');
			//console.log(input);
			input.next('span.error').remove();
			var span = '<span class="error">'+ error +'</span>';
			input.addClass('invalid');
			input.focus();
			input.after(span);
			
			console.log('invalid');
	  	}
	});



var Matcat = Backbone.Model.extend({
	urlRoot: "../api/s/matcat",
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	}
});

var matcat = new Matcat();



var TableModelView = Backbone.View.extend({
		//el: '#frm-matcat',
		initialize: function(){
			Backbone.Validation.bind(this);

			// check if thle $el is .table-model
			if(this.$el.is(".table-model")){
				this.formModel = this.$el;
			} else {
				this.formModel = this.$el.find(".table-model");
			}

			this.initButtons();
			this.model.on('change', this.renderDetail, this);
		},
		valid: function(){
			console.log("valid function");			
		},
		invalid: function(){
			console.log("invalid");
		},
		events: {
			'click .model-btn-save':'save',
			'click .model-btn-save-blank':'save',
			'click .model-btn-delete':'remove',
			'click .model-btn-cancel':'clearForm',
			//'blur input[required]':'checkValidity',
			'blur input': 'checkValidity',
			'change select': 'checkValidity',
			'blur .field': 'setToModel'
		},
		setToModel: function(e){
			var input = $(e.currentTarget);
			//console.log(input.val());
		},
		save: function(e){

			var that = this;
			var data = this.formModel.serializeObject2();
				

			var isnew = false;
			//console.log(data);
			
			if(this.model.isNew()){
				isnew = true;
			}

			this.model.set(data, {silent: true});
		
			if(this.model.isValid(true)){
				clear_alert();
				this.model.save({},{
	  				success: function(model, respone){
	  					if(respone.error){
	  						set_alert('error','Ops!',respone.error);
	  					} else if(respone.warning){
	  						set_alert('warning','Ops!', respone.warning);
	  					} else {
	  						if(isnew){
								addTableData(respone,oTable)
								if($(e.currentTarget).is(".model-btn-save-blank")){
									that.clearForm();
								} else {
									$(e.currentTarget).find('.table-model').clearForm()
								}
							} else {
								updateTableData(respone)
								if($(e.currentTarget).is(".model-btn-save-blank")){
									that.clearForm();
								} else {
									$(e.currentTarget).find('.table-model').clearForm()
								}
							}
							set_alert('success','Yeay!', 'Succes on saving!');
	  					}
						
	  				}	
	  			});


	  			
	
				//this.model.save();
				

				this.btnSave.attr('disabled','disabled');	
				this.btnSaveBlank.attr('disabled','disabled');		
			} else {
				console.log("invalid :"+ this.model.validationError);
			}	

			//check if save btn is saveBlank
					
		},
		saveBlank: function(){
			//this.save();
			//this.model.clear();
			//this.$el.clearForm();
			//clear_alert();

		},
		remove: function(){

			if(confirm('Are you sure you want to delete this item? '+ this.model.get('code'))) {
				this.model.destroy();
				this.btnSave.attr('disabled','disabled');
				this.btnSaveBlank.attr('disabled','disabled');
				this.clearForm();
			} else {

			}
		},
		clearForm: function(){
			
			this.model.clear();
			//console.log(this.formModel)
			this.formModel.clearForm();
			clear_alert();
		},
		checkValidity: function(e){

			console.log(this.formModel);
			
			var input = $(e.currentTarget);
			var req = this.$el.find('input[required]');
			
			if(req){
				if(req.val()==''){
					console.log('see required field');
					this.btnSave.attr('disabled','disabled');	
					this.btnSaveBlank.attr('disabled','disabled');
				} else {
					this.btnSave.removeAttr('disabled');
					this.btnSaveBlank.removeAttr('disabled');
				}
			} else {
				this.btnSave.removeAttr('disabled');
				this.btnSaveBlank.removeAttr('disabled');
			}	
			
		},
		renderDetail: function(){
			if(_.isEmpty(this.model.attributes)){
				
				this.btnSave.attr('disabled','disabled');
				this.btnSaveBlank.attr('disabled','disabled');	
				this.btnDelete.attr('disabled','disabled');
				this.btnCancel.attr('disabled','disabled');
			} else {
				renderDetails(this.model.toJSON());
				//this.$el.find("#code").val(this.model.get('code'));	
				//this.$el.find("#descriptor").val(this.model.get('descriptor'));
				
				this.btnDelete.removeAttr('disabled');
				this.btnCancel.removeAttr('disabled');
			}
		},
		initButtons: function(){
			this.btnSave = this.$el.find(".model-btn-save");
			this.btnSaveBlank = this.$el.find(".model-btn-save-blank");
			//console.log(this.btnSaveBlank);
			this.btnDelete = this.$el.find(".model-btn-delete");
			this.btnCancel = this.$el.find(".model-btn-cancel");
		}
	});

var MatcatView = TableModelView.extend({el: '#frm-matcat'});
var MatcatModalView = TableModelView.extend({el: '#mdl-frm-matcat'});



var Matcats = Backbone.Collection.extend({
		model: Matcat,
		url: "../api/s/matcat"
	});
	
var matcats = new Matcats();
	
	
var DataGridView = Backbone.View.extend({
		el: '.tb-data',
		initialize: function(){
			this.model.on('destroy',this.removeRow, this);
		},
		events: {
			'click tr[data-id]': 'rowSelect',
			'dblclick tr[data-id]': 'rowDblclick',
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

			clear_alert();
			var id = $(e.currentTarget).parent().parent().parent().data('id');
			this.model.set({'id':id});	
			this.model.fetch({
				beforeSend: function(){
					//console.log('fetching: '+ id);
				}	
			});	
			//console.log(this.model.toJSON());
			$(".modal .modal-title").text('Edit');
			$(".modal").modal('show');  
			
		},
		rowDelete: function(e){
			e.preventDefault();
			e.stopPropagation();
			
		}
	});

var eventAggregator = _.extend({}, Backbone.Events);

eventAggregator.on('all', function(eventName){
	//console.log(sec.toJSON());
	//console.log(eventName + ' was triggered!');
});

$(document).ready(function(e) {
	

	var matcatView = new MatcatView({ model: matcat});
	var matcatModalView = new MatcatModalView({ model: matcat});
	var matcatDataGridView = new DataGridView({model: matcat});
	
	
});

var Itemcat = Backbone.Model.extend({
	urlRoot: "../api/s/itemcat",
	defaults: {
		code: '',
		descriptor: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});
var itemcat = new Itemcat();
//var itemcat = new Itemcat({code: '001', descriptor: 'Ply Board'});

var Item = Backbone.Model.extend({
	urlRoot: "../api/t/item",
	defaults: {
		code: '',
		descriptor: '',
		itemcatid: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});

var item = new Item(); 


var Acctcat = Backbone.Model.extend({
	urlRoot: "../api/s/acctcat",
	defaults: {
		code: '',
		descriptor: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});
var acctcat = new Acctcat();
//var itemcat = new Itemcat({code: '001', descriptor: 'Ply Board'});

var Account = Backbone.Model.extend({
	urlRoot: "../api/t/account",
	defaults: {
		code: '',
		descriptor: '',
		acctcatid: '',
		type: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});

var account = new Account(); 



var Matcat = Backbone.Model.extend({
	urlRoot: "../api/s/matcat",
	defaults: {
		code: '',
		descriptor: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});
var matcat = new Matcat();

var Material = Backbone.Model.extend({
	urlRoot: "../api/t/material",
	defaults: {
		code: '',
		descriptor: '',
		typeid: '',
		type: '',
		matcatid: '',
		uom: '',
		longdesc: '',
		onhand: '',
		minlevel: '',
		maxlevel: '',
		reorderqty: '',
		avecost: ''
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
})
var material = new Material();


var Supplier = Backbone.Model.extend({
	urlRoot: "../api/v/supplier",
	defaults: {
		code: '',
		descriptor: '',
		payee: '',
		cperson: '',
		ctitle: '',
		terms: '',
		balance: '',
		address: '',
		phone: '',
		fax: '',
		mobile: '',
		email: '',
		notes: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	}
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});
var supplier = new Supplier();


var Bank = Backbone.Model.extend({
	urlRoot: "../api/s/bank",
	defaults: {
		code: '',
		descriptor: '',
		acctno: ''
	}, 
	validation: {
		code: {
	    	required: true,
			msg: 'Please enter a value'
	   	},
	   	acctno: {
	    	required: true,
			msg: 'Please enter a account number'
	   	}	
	},
	unset: function(attr, options) {
	  (options || (options = {})).unset = true;
	  return this.set(attr, null, options);
	},
	blank: function(){
		this.clear();
		return this.defaults;
	}
});
var bank = new Bank();





var ModalSettings = Backbone.Model.extend({
	defaults: {
		mode: 'add',
		text: 'Add Record'
	}
});
var modalSettings  = new ModalSettings();




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
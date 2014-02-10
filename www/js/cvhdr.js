var removedCvapvdtl = [];
var removedCvchkdtl = [];
var date = new Date();

    //override backbone MODEL
    _.extend(Backbone.Model.prototype, {
        somefunc: function(options) {
            var data = {},
            attrs = _.clone(this.attributes);
            //if the model has a paramRoot attribute, use it as the root element
            if(options && options.includeParamRoot && this.paramRoot) {
                data[this.paramRoot] = attrs;
            } else {
                data = attrs;
            }
            return data;
        },
        reset: function(attrs, opts){
            opts || (options = {});
            
            var prev_attrs = this.attributes;
            var keys = [];

            if((typeof attrs != 'object') || _.isEmpty(attrs)){
                attrs = this.defaults;
                prev_attrs = this.defaults;
            }

            for(var k in attrs) 
                keys.push(k);
            // or
            // keys = _.keys(attrs);

            for(k in attrs){
                var newval = attrs[k];
                this.attributes[k] = newval;
                if(!options.silent){
                    console.log('reset: '+ k);
                    this.trigger('reset:' + k, this, newval, options);
                }  
            }


            for(k in prev_attrs){
                if(keys.indexOf(k) != -1){  // check if model key is in default key
                    var newval = attrs[k];
                    if(this.attributes[k] != newval){
                        this.attributes[k] = newval;
                        if(!options.silent){
                            console.log('reset: '+ k);
                            this.trigger('reset:' + k, this, newval, options);
                        }
                    }
                } else {
                    console.log('delete: '+ k);
                    delete this.attributes[k];
                }
            }
    
            

            if(!options.silent)
                this.trigger('reset', this, attrs, options);


            /*
            if(typeof attrs === 'object')
                for(k in this.attributes) {
                    if(keys.indexOf(k)){  // check if model key is in default key
                        var newval = this.defaults[k];
                        this.attributes[k] = newval;
                        if (!options.silent) 
                            this.trigger('reset:' + k, this, newval, options);
                    } else {
                        delete this.attributes[k];
                    }
                }


            var now = this.attributes, 
                escaped = this._escapedAttributes, 
                original = _.clone(this.attributes);
     
            // Test if we're reseting all attributes, or just one
            if( typeof attrs !== 'object' )
                attrs = !attrs ? _.keys(now) : [attrs];
     
            // Reset the attributes.
            for( var i = 0; i < attrs.length; i++ ){
                var attr = attrs[i];
                var val = original[attr];
     
                if ( !_.isEqual(now[attr], val) ){ 
                    now[attr] = val; 
                    delete escaped[attr];
                    if (!options.silent) 
                        this.trigger('reset:' + attr, this, val, options);
                }
            }
            
            if(!options.silent)
                this.trigger('reset', this, attrs, options);
            */
        }
    });


    var ModalData = Backbone.Model.extend({
        initialize: function(){
            //this.on('change:childchanged', this.setEnableCtrls, this);
        },
        defaults: {
            mode: 'edit',
            table: '',
            text: '',
            enablecrtls: true,
            childchanged: false,
        },
        toggleChildChange: function(){
            this.get('childchanged') == true ? this.set({childchanged: false}) : this.set({childchanged: true}); 
        },
        toggleCrtls: function(){
            this.get('enablecrtls') == true ? this.set({enablecrtls: false}) : this.set({enablecrtls: true}); 
        },
        enableCtrls: function(){
            this.set({enablecrtls: true});
        }
    });
    var modalData = new ModalData({text: 'Add Record'});


    var Cvhdr = Backbone.Model.extend({
        urlRoot: "../api/t/cvhdr",
        initialize: function(){
            
            //this.set({id: guid()}, {silent:true});
        },
        defaults: {
            refno: '',
            date: moment().format("YYYY-MM-DD"),
            supplierid: '',
            payee: '',
            totapvamt: '0.00',
            totchkamt: '0.00',
            totapvline: 0,
            totchkline: 0,
            notes: '',
            posted: 0,
            cancelled: 0,
            /*
            due: function(){
                var date = $(".table-model #date").val();
               return moment(date).add('days', 10).format("YYYY-MM-DD");
            }
            */
        }, 
        validate: function(attrs, options){
            console.log(attrs);
            if(_.isEmpty(attrs.refno) || attrs.refno==null){
                return "refno is empty!";
            }
        },
        validation: {
            date: {
                required: true,
                msg: 'Please enter a date value'
            },
            supplierid: {
                required: true,
                msg: 'Please enter a supplier'
            }   
        },
        blank: function(){
            this.clear();
            this.set(this.defaults, {silent: true});
            //console.log(this.defaults);
            return this;
        },
        post: function(){
            var aData;

            $.ajax({
                type: 'POST',
                contentType: 'application/json',
                url: '../api/txn/post/cvhdr/' + this.get('id') ,
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
        },
        deleteParentChild: function(){
            var aData = {};

            $.ajax({
                type: 'DELETE',
                contentType: 'application/json',
                url: '../api/txn/cvapvdtl/cvhdr/' + this.get('id') ,
                dataType: "json",
                async: false,
                success: function(data, textStatus, jqXHR){
                    aData.child1 = data;           
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus + 'Failed on deleting child cvapvdtl data');
                }
            });

            $.ajax({
                type: 'DELETE',
                contentType: 'application/json',
                url: '../api/txn/cvchkdtl/cvhdr/' + this.get('id') ,
                dataType: "json",
                async: false,
                success: function(data, textStatus, jqXHR){
                    aData.child2 = data;           
                },
                error: function(jqXHR, textStatus, errorThrown){
                    alert(textStatus + 'Failed on deleting child cvchkdtl data');
                }
            });

            return aData;
        },
        isChange: function(){
            var k, t = false;
            for(k in this.attributes) {
                this.hasChanged(k) ? t = true : ''; //console.log(idx +' cvapvdtl same: '+ k);
            }
            return t;
        }
    });
    var cvhdr = new Cvhdr();



    var Cvapvdtl = Backbone.Model.extend({
        urlRoot: '../api/s/cvapvdtl',
        defaults: {
            apvhdrid: '',
            amount: 0.00
        },
        isChange: function(){

            var attrs = { }, k, t = false;
            var idx = this.collection.indexOf(this);
            for(k in this.attributes) {
                if(k == 'cvhdrid'){

                } else {
                    this.hasChanged(k) ? t = true : ''; 
                    console.log(idx +' cvapvdtl same: '+ k);
                }               
            }
            return t;
        }
    });
    var cvapvdtl = new Cvapvdtl();

    var Cvapvdtls = Backbone.Collection.extend({
        model: Cvapvdtl,
        initialize: function(){

        },
        saveAll: function(cvapvdtl) {

            _.each(removedCvapvdtl, function(item){
                item.isNew() ? '': item.destroy();           
            } );
            
            removedCvapvdtl = [];

            _.each(this.models, function(cvapvdtl) {
                if(cvapvdtl.isChange()){
                    cvapvdtl.set({'cvhdrid': cvhdr.get('id')}, {silent: true});
                    cvapvdtl.save({}, {silent: true});
                } else {
                    console.log('unable to save cvapvdtl: no changes');
                }
                
            });
        },
        deleteAll: function(cvapvdtl) {

            _.each(this.models, function(cvapvdtl) {
                cvapvdtl.destroy();
            });
        },
        getFieldTotal: function(field){
            return this.reduce(function(memo,value){
                return memo + parseFloat(value.get(field))
            }, 0)
        }
    });
    var cvapvdtls = new Cvapvdtls();

    var CvapvdtlView = Backbone.View.extend({
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
        render: function(){
            var that = this;
            //item.url = '../api/s/item/'+  this.model.get('itemid');
            console.log(this.model.toJSON());
            apvhdr.set({id: this.model.get('apvhdrid')});
            apvhdr.fetch({
                success: function(model, respone){
                    //console.log(JSON.stringify(model));
                    var data = {
                        "item": model.get('refno'), //or descritor
                        "amount": accounting.formatMoney(that.model.get('amount'),{symbol:""})
                    }
                    that.$el.html(that.template(data));
                }
            });
            return this;
        },
        removeMe: function(){
            this.$el.remove();
            removedCvapvdtl.push(this.model);
        }
    });

    var CvapvdtlView2 = Backbone.View.extend({
        tagName: 'tr',
        initialize: function(){

            this.model.on('change', this.render, this);
            
            this.template = _.template('<td data-item="<%=item%>"> <%=item%> '+
                //'<div class="tb-data-action">'+
                //'<a class="row-delete" data-id="" href="#">&nbsp;</a>'+
                //'<a class="row-edit" data-id="" href="#">&nbsp;</a>'+
                //'</div></td>'+
                '</td>'+
                '<td class="currency"><%=amount%></td>');
        },
        render: function(){
            var that = this;
            //item.url = '../api/s/item/'+  this.model.get('itemid');
            console.log(this.model.toJSON());
            apvhdr.set({id: this.model.get('apvhdrid')});
            apvhdr.fetch({
                success: function(model, respone){
                    //console.log(JSON.stringify(model));
                    var data = {
                        "item": model.get('refno'), //or descritor
                        "amount": accounting.formatMoney(that.model.get('amount'),{symbol:""})
                    }
                    that.$el.html(that.template(data));
                }
            });
            return this;
        }
    })

    var CvapvdtlsView = Backbone.View.extend({
        el: '#child-cvapvdtl .items-tbody',
        initialize: function(){
            //console.log(this.collection);

            this.collection.on('reset', this.render, this);
            this.collection.on('add', this.addOne, this);
        },
        events: {
            'click .row-edit': "editMe",
            'click .row-delete': "removeMe"
        },
        render: function(){
            
            this.$el.html('');
            this.addAll();
            return this;
        },
        addOne: function(cvapvdtl){
            var mode = modalData.get('mode');
            if(mode == 'delete' || mode == 'posting'){
                var cvapvdtlView = new CvapvdtlView2({model: cvapvdtl});
            } else {
                var cvapvdtlView = new CvapvdtlView({model: cvapvdtl});
            }
            
            this.$el.append(cvapvdtlView.render().el);
            return this;
        },
        addAll: function(){
            this.collection.forEach(this.addOne, this);
        },
        editMe: function(e){
            e.preventDefault();
            $("#search-apvhdr #mdl-detail-save-item").text('Save Changes');

            var idx = $(e.currentTarget).closest('tr').index();
            var itemName = $(e.currentTarget).parent().parent().data('item');
            var m = this.collection.at(idx);

            this.renderToForm(m);

            $('#search-apvhdr .search-detail').val(itemName);

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

                $('#search-apvhdr #'+k).val(attrs[k])    
            }
        }
    });




    
    var Cvchkdtl = Backbone.Model.extend({
        urlRoot: '../api/s/cvchkdtl',
        defaults: {
            bankacctid: '',
            checkno: '',
            checkdate: '',
            amount: 0.00
        },
        isChange: function(){
            var attrs = { }, k, t = false;
            var idx = this.collection.indexOf(this);
            for(k in this.attributes) {
                if(k == 'cvhdrid'){

                } else {
                    this.hasChanged(k) ? t = true : '';//console.log(idx +' cvchkdtl same: '+ k);
                }               
            }
            return t;
        }
    });
    var cvchkdtl = new Cvchkdtl();

    var Cvchkdtls = Backbone.Collection.extend({
        model: Cvchkdtl,
        initialize: function(){

        },
        saveAll: function(cvchkdtl) {

            _.each(removedCvchkdtl, function(item){
                item.destroy();
            } );
            
            removedCvchkdtl = [];

            _.each(this.models, function(cvchkdtl) {
                if(cvchkdtl.isChange()){
                    cvchkdtl.set({'cvhdrid': cvhdr.get('id')}, {silent: true});
                    cvchkdtl.save({}, {silent: true});
                } else {
                    console.log('unable to save cvapvdtl: no changes');
                }
                
            });
        },
        deleteAll: function(cvchkdtl) {

            _.each(this.models, function(cvchkdtl) {
                cvchkdtl.destroy();
            });
        },
        getFieldTotal: function(field){
            return this.reduce(function(memo,value){
                return memo + parseFloat(value.get(field))
            }, 0)
        }
    });
    var cvchkdtls = new Cvchkdtls();

    var CvchkdtlView = Backbone.View.extend({
        tagName: 'tr',
        initialize: function(){

            this.model.on('remove', this.removeMe, this);
            this.model.on('destroy', this.render, this);
            this.model.on('change', this.render, this);
            
            this.template = _.template('<td data-bank="<%=bank%>"> <%=bank%> '+
                '<div class="tb-data-action">'+
                '<a class="row-delete" data-id="" href="#">&nbsp;</a>'+
                '<a class="row-edit" data-id="" href="#">&nbsp;</a>'+
                '</div></td>'+
                '<td><%=checkno%></td><td><%=checkdate%></td>'+
                '<td class="currency"><%=amount%></td>');
        },
        render: function(){
            var that = this;
            //item.url = '../api/s/item/'+  this.model.get('itemid');
            //console.log(this.model.toJSON());
            bank.set({id: this.model.get('bankacctid')});
            bank.fetch({
                success: function(model, respone){
                    //console.log(JSON.stringify(model));
                    var data = {
                        "bank": model.get('code'), //or descritor
                        "checkno": that.model.get('checkno'),
                        "checkdate": that.model.get('checkdate'),
                        "amount": accounting.formatMoney(that.model.get('amount'),{symbol:""})
                    }
                    that.$el.html(that.template(data));
                }
            });
            return this;
        },
        removeMe: function(){
            this.$el.remove();
            removedCvchkdtl.push(this.model);
        }
    });

    var CvchkdtlView2 = Backbone.View.extend({
        tagName: 'tr',
        initialize: function(){

            this.model.on('change', this.render, this);
            
            this.template = _.template('<td data-bank="<%=bank%>"> <%=bank%> '+
                //'<div class="tb-data-action">'+
                //'<a class="row-delete" data-id="" href="#">&nbsp;</a>'+
                //'<a class="row-edit" data-id="" href="#">&nbsp;</a>'+
                '</div></td>'+
                '</td>'+
                '<td><%=checkno%></td><td><%=checkdate%></td>'+
                '<td class="currency"><%=amount%></td>');
        },
        render: function(){
            var that = this;
            //item.url = '../api/s/item/'+  this.model.get('itemid');
            console.log(this.model.toJSON());
            bank.set({id: this.model.get('bankacctid')});
            bank.fetch({
                success: function(model, respone){
                    //console.log(JSON.stringify(model));
                    var data = {
                        "bank": model.get('code'), //or descritor
                        "checkno": that.model.get('checkno'),
                        "checkdate": that.model.get('checkdate'),
                        "amount": accounting.formatMoney(that.model.get('amount'),{symbol:""})
                    }
                    that.$el.html(that.template(data));
                }
            });
            return this;
        }
    });

    var CvchkdtlsView = Backbone.View.extend({
        el: '#child-cvchkdtl .items-tbody',
        initialize: function(){
            //console.log(this.collection);

            this.collection.on('reset', this.render, this);
            this.collection.on('add', this.addOne, this);
        },
        events: {
            'click .row-edit': "editMe",
            'click .row-delete': "removeMe"
        },
        render: function(){
             this.$el.html('');
            this.addAll();
            return this;
        },
        addOne: function(cvchkdtl){
            var mode = modalData.get('mode');
            if(mode == 'delete' || mode == 'posting'){
                var cvchkdtlView = new CvchkdtlView2({model: cvchkdtl});
            } else {
                var cvchkdtlView = new CvchkdtlView({model: cvchkdtl});
            }
            
            this.$el.append(cvchkdtlView.render().el);
            return this;
        },
        addAll: function(){
            this.collection.forEach(this.addOne, this);
        },
        editMe: function(e){
            e.preventDefault();
            $("#search-chkdtl #mdl-detail-save-item").text('Save Changes');

            var idx = $(e.currentTarget).closest('tr').index();
            var itemName = $(e.currentTarget).parent().parent().data('item');
            var m = this.collection.at(idx);

            this.renderToForm(m);

            $('#search-chkdtl .search-detail').val(itemName);

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

                $('#search-chkdtl #'+k).val(attrs[k])    
            }
        }
    });

    



    
    



    var ParentChildModal = Backbone.View.extend({
        //el: '.modal-parent-child .tab-cvhdr',
        el: '.modal-dialog',
        initialize: function(){
            Backbone.Validation.bind(this);
            
            this.settings = this.options.settings;
            this.cvapvdtls = this.options.child1;
            this.cvchkdtls = this.options.child2;

            // Parent CVHDR Activity
            this.model.on('change:refno', this.populate, this);
            this.model.on('change:totapvamt', this.populateTotapvamt, this);
            this.model.on('change:totapvline', this.populateTotapvamt, this);
            this.model.on('change:totchkamt', this.populateTotchkamt, this);
            this.model.on('change:totchkline', this.populateTotchkamt, this);
            
            // Child CVAPVDTLS Activity 
            this.cvapvdtls.on('change', this.totapvamtCompute, this);
            this.cvapvdtls.on('add', this.totapvamtCompute, this);
            this.cvapvdtls.on('remove', this.cvapvdtlsRemove, this);
            this.cvapvdtls.on('reset', this.cvapvdtlsReset, this);

            // Child CVCHKDTLS Activity 
            this.cvchkdtls.on('change', this.totchkamtCompute, this);
            this.cvchkdtls.on('add', this.totchkamtCompute, this);
            this.cvchkdtls.on('remove', this.cvchkdtlsRemove, this);
            this.cvchkdtls.on('reset', this.cvchkdtlsReset, this);

            // Modal Settings Activity
            this.settings.on('change:mode', this.modalCheckMode, this);
            this.settings.on('change:childchanged', this.checkChildChange, this);

            // Load template
            this.template = _.template($('#modal-cvhdr-tpl').html());
        },
        showfields: {
            id: 'id',
            refno: 'Ref No',
            date: 'Date',
            supplier: 'Supplier',
            payee: 'Payee',
            totapvamt: 'APV Total Amount',
            totchkamt: 'Check Total Amount',
            posted: 'Posted'
        },
        events: {

            'click .model-btn-save': 'modalSave',
            'click .model-btn-save-blank': 'modalSaveBlank',
            'click #modal-btn-delete-yes': 'modalConfirmDelete',
            'click #modal-btn-post-yes': 'modalConfirmPosting',

            'change .table-model #supplierid': 'populatePayee',
            'click input[type=checkbox].toggle': 'toggleSerialized',

            'blur .table-model input': 'checkValidity',
            'keyup .table-model input': 'checkValidity',
            'change .table-model select': 'checkValidity',
            'blur .table-model textarea': 'checkValidity',

        },
        render: function(){
            $('.modal-title').text(this.settings.get('text'));
            this.$el.find('.tab-cvhdr').html(this.template());

            $(".table-model #date").datepicker({"dateFormat": "yy-mm-dd",
                select: function(event, ui){
                
                }
            });

            this.modalChangeButtons();
            return this;
        },
        populate: function(){
            var that = this;
            
            var attrs = {}, k;
            for(k in this.model.attributes) {
                //attrs[k] = product.attributes[k];
                //console.log(k+' - '+attrs[k]);
                if(k=='cancelled'){
                    var cld = this.$el.find(".table-model #toogle-"+k);
                    this.model.get(k) == 1 ? cld.prop('checked', true) : cld.prop('checked', false);
               
                    this.$el.find(".table-model #"+k).val(this.model.get(k));
                } else if(k=='supplierid'){
                    
                    this.$el.find(".table-model #"+k).val(this.model.get(k));
                } else {
                    this.$el.find(".table-model #"+k).val(this.model.get(k));
                }
                
            }   
        },
        populateTotapvamt: function(){
            var attrs = { }, k;
            for(k in this.model.attributes) {
                if(k === 'totapvamt'){
                    //console.log(JSON.stringify(this.model.toJSON()));
                    var x = accounting.formatMoney(this.model.get('totapvamt'),{symbol:""});
                    this.$el.find("#"+k).val(x);
                } else if(k === 'totapvline'){
                    
                    this.$el.find("#"+k).val(this.model.get('totapvline'));
                }  

            }

            this.checkModeSupplier();
        },
        populateTotchkamt: function(){
            var attrs = { }, k;
            for(k in this.model.attributes) {
                if(k === 'totchkamt'){
                    //console.log(JSON.stringify(this.model.toJSON()));
                    var x = accounting.formatMoney(this.model.get('totchkamt'),{symbol:""});
                    this.$el.find("#"+k).val(x);
                } else if(k === 'totchkline'){
                    
                    this.$el.find("#"+k).val(this.model.get('totchkline'));
                }  

            }
        },
        checkValidity: function(){
            //var that = this;
            //var input = $(e.currentTarget);
            //var req = this.$('.table-model input[required]', '.table-model');
            var emptyField = this.$('[required]', '.table-model')
                                .filter(function() {                          
                                    if($(this).val() == ""){
                                        return $(this).val() == ""; 
                                    } else if($(this).val() == null){
                                        return $(this).val() == null;
                                    }  
                                });     
            //console.log(emptyField);   
            if(emptyField.length==0 && this.model.isChange()){
                this.btnSaveEnable();
                this.$('[required]').next('span.error').remove();
            } else {
                this.btnSaveDisable();
            }
        },
        totapvamtCompute: function(){
            var tot = this.cvapvdtls.getFieldTotal('amount');
            var line = this.cvapvdtls.length;
            
            this.model.set({totapvamt: tot, totapvline: line});            
            this.cvapvdtls.each(function(cvapvdtl){
                cvapvdtl.isChange() || cvapvdtl.isNew() ? this.settings.set({childchanged: true}) : ''; //console.log('not new cvapvdtl');
                //cvapvdtl.isNew() ? this.btnSaveEnable() : console.log('not new cvapvdtl');
            }, this);
        },
        totchkamtCompute: function(){
            var tot = this.cvchkdtls.getFieldTotal('amount');
            var line = this.cvchkdtls.length;
            
            this.model.set({totchkamt: tot, totchkline: line});
            this.cvchkdtls.each(function(cvchkdtl){
                //console.log(cvchkdtl.toJSON());
                cvchkdtl.isChange() || cvchkdtl.isNew() ? this.settings.set({childchanged: true}) : '';//console.log('not new cvchkdtl');
            }, this);
        },
        cvapvdtlsRemove: function(){
            this.totapvamtCompute();
            this.btnSaveEnable()
        },
        cvchkdtlsRemove: function(){
            this.totchkamtCompute();
            this.btnSaveEnable()
        },
        /*
        cvapvdtlsReset: function(){
            this.$('#child-cvapvdtl .items-tbody').html('');
        },
        cvchkdtlsReset: function(){
            this.$('#child-cvchkdtl .items-tbody').html('');
        },
        */
        modalSave: function(options){
            var opts = options || {};
            var that = this;
            var data = this.$el.find('.table-model').serializeObject2();
            var isnew = false;
                
            if(this.model.isNew()){
                isnew = true;
            }

            //console.log(data);
            this.model.set(data, {silent: true});

            if(this.model.isValid(true)){
                clear_alert();

                var childchanged = this.settings.get('childchanged');

                this.model.save({},{
                    success: function(model, respone){
                        if(respone.status === 'error'){
                            console.log(childchanged);
                            // if header respone error but code 504
                            // it means nothing to update
                            // but check if the child is change
                            if(respone.code == '504' && childchanged == true){
                            
                                that.cvapvdtls.saveAll();
                                that.cvchkdtls.saveAll();
                                
                                set_alert('success','Well done!', 'property changes has been saved!');

                                that.appendBlank();
                            } else {
                                set_alert(respone.status, 'Oh snap!', respone.message);    
                            }
                        } else if(respone.status === 'warning'){
                            set_alert(respone.status, 'Warning!', respone.message);
                        } else if(!_.isEmpty(respone)){
                            if(isnew){
                                var showData = that.addTableData(respone);
                                //console.log(showData);
                                addTableData3(showData); 
                                set_alert('success','Well done!', 'Success on creating: <em>'+ model.get('refno') +'</em>');
                            } else {
                                updateTableData4(respone);
                                set_alert('success','Yeay!', 'Success on updating!');
                            }

                            that.cvapvdtls.saveAll();
                            that.cvchkdtls.saveAll();

                            if(options.reset == true){
                                console.log('reset true')
                                that.cvapvdtls.reset();
                                that.cvchkdtls.reset();
                                that.model.set({id: null}, {silent: true});
                                that.model.set(that.model.defaults);
                            }

                            that.btnSaveDisable();
                            that.settings.set({childchanged: false});
                        }
                    },
                    error: function(){
                        alert('Server: error while saving!');
                    }
                });
            
            } else {
                alert('Unable to save!');
                console.log("invalid :"+ this.model.validationError);
            }
        },
        modalSaveBlank: function(){
            this.modalSave({reset: true});
            
            //this.populate(); 
            
            console.log(this.model.toJSON());
        },
        modalConfirmDelete: function(){
            
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
        populatePayee: function(e){
            var that = this;
            var supplierid = $(e.currentTarget).val();
            
            s = new Supplier();
            s.set({id: supplierid});
            s.fetch({
                success: function(model, respone){
                    that.$el.find('.table-model #payee').val(model.get('payee'));
                }
            });
        },
        modalChangeButtons: function(){             
            var btn, mode = this.settings.get('mode');

            if(mode=='delete'){
                btn = '<p style="display: inline; float: left; margin: 10px 0; color: #3B5998;">Are you sure you want to delete this record?</p>';
                btn += '<button type="button" id="modal-btn-delete-yes" class="btn btn-primary model-btn-yes" data-dismiss="modal">Yes</button>';
                btn += '<button type="button" id="modal-btn-delete-no" class="btn btn-default model-btn-no" data-dismiss="modal" >No</button>';
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
            }
            $('.modal-footer').html(btn);  
        },
        modalCheckMode: function(){
            this.$('.modal-title').text(this.settings.get('text'));
            var mode = this.settings.get('mode');
            this.modalChangeButtons();  

            if(mode==='delete' || mode==='posting'){
                this.modelInputsDisable();
                this.dataActionHide();
            } else {
                this.modelInputsEnable();
                this.dataActionShow();
            }             
        },
        checkModeSupplier: function(){
            var i = this.$el.find(".table-model #supplierid");
            var j = this.$el.find(".table-model #payee");

            if(this.model.get('totapvline') > 0){
                i.prop('disabled', true);             
                //i.attr('readonly', 'readonly');
                //j.attr('readonly', 'readonly');
            } else {
                i.prop('disabled', false); 
                //i.removeAttr('readonly');
                //j.removeAttr('readonly');
            }
        },
        checkChildChange: function(){
            console.log('checkChildChange');
            this.settings.get('childchanged') == true ? this.btnSaveEnable() : this.btnSaveDisable(); 
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
        dataActionHide: function(){
            $('.modal-tb-detail .tb-data-action').hide();
            $('.modal-table-detail').hide();
        },
        dataActionShow: function(){
            $('.modal-tb-detail .tb-data-action').show();
            $('.modal-table-detail').show();
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
                
            //this.$el.find('.table-model').clearForm();
        },
        appendBlank: function(){
            clear_alert();
            this.clearForm();
            this.populate();
            this.cvapvdtls.reset();
            this.cvchkdtls.reset();
            //console.log(this.cvapvdtls);
            //this.cvapvdtls.reset();
            // if populate the next line commented
            //this.$el.find('.table-model #date').val(this.model.defaults.date);
            this.clearItemsBody();
            this.clearFormDetail();
            //this.dataActionShow();
            //this.renderModelSelector();
            this.settings.set({mode: 'add', text: 'Add Record'});
        },
        clearItemsBody: function(){
            $('#child-cvapvdtl .items-tbody').html('');
            $('#child-cvchkdtl .items-tbody').html('');
        },
        clearFormDetail: function(){
            $('.modal-table-detail').clearForm();
            $('.mdl-detail-save-item').text('Add');
        },
        btnSaveEnable: function(){
            this.$(".model-btn-save").prop('disabled', false);   
            this.$(".model-btn-save-blank").prop('disabled', false);
        },
        btnSaveDisable: function(){
            this.$(".model-btn-save").attr('disabled', true);    
            this.$(".model-btn-save-blank").attr('disabled', true);
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

    });



   

    /*
    var SearchApvhdrView = Backbone.View.extend({
        el: '#search-apvhdr.modal-table-detail',
        initialize: function(){
            
        },
        events: {
            submit: 'saveItem',
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
            
            console.log(data);

            if(_.isEmpty(data)){
                console.log('empty');
                $(".search-detail").focus();
            } else {
                if(!data.apvhdrid || !data.amount){
                    if(!data.apvhdrid){
                        $(".search-detail").val('');
                        $(".search-detail").focus();
                    } else {
                        $("#amount").focus();
                    }
                } else {
                    
                    if(data.id==undefined || data.id==''){
                        console.log('add to collection');
                        var x = this.collection.where({apvhdrid: data.apvhdrid});
                        
                        _.isEmpty(x) ? console.log('unable to locate on collection') : this.collection.remove(x);
                        
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
                    this.$(".search-detail").focus();
                    this.$("#mdl-detail-save-item").text('Add');
                }
            }

            
        },
        cancelItem: function(e){
            this.clearForm();
            this.$("#mdl-detail-save-item").text('Add');
        },
        clearForm: function(){
            this.$el.clearForm()
        },
        renderToForm: function(data){
            console.log(data);
        }
    });
    */

    var FormDetailView = Backbone.View.extend({
        //el: '#search-chkdtl.modal-table-detail',
        initialize: function(){
            //this.req = ['bankacctid', 'checkno', 'checkdate', 'amount']; 
            //this.wf = ['checkno']; // wf = where filter
            
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
        validateReq: function(data){
            var t = true;
            for (var i = 0; i < this.req.length - 1; i++) {
                if(!data[this.req[i]]){
                    t = false;
                    this.$("#"+this.req[i]).focus();
                }
            }
            return t;
        },
        whereFilter: function(data){
            console.log('whereFilter');
            //var attrs = {checkno: data.checkno};
            var attrs = {};
            for (var i = 0; i <= this.wf.length - 1; i++) {
                for(key in data){
                    if (this.wf[i] == key){
                        attrs[key] = data[key];
                    }
                }
            }
            console.log(attrs);
            return attrs;
        },
        addItem: function(){

            var data = this.$el.serializeObject2();
            
            console.log(data);

            //this.whereFilter(data);

            if(_.isEmpty(data)){
                console.log('empty');
                //$(".search-detail").focus();
            } else {
                /*
                if(!data.bankacctid || !data.checkno || !data.checkdate || !data.amount){
                    console.log('not any');
                    if(!data.bankacctid){
                        this.$("#bankacctid").focus();
                    } else if(!data.checkno){
                        this.$("#checkno").focus();
                    } else if(!data.checkdate){
                        this.$("#checkdate").focus();
                    } else if(!data.amount){
                        this.$("#amount").focus();
                    } else {

                    }
                */
                if(!this.validateReq(data)){
                    console.log('not complete');
                } else {
                    
                    if(data.id==undefined || data.id==''){
                        console.log('add to collection');
                        //var x = this.collection.where({checkno: data.checkno});
                        var x = this.collection.where(this.whereFilter(data));

                        _.isEmpty(x) ? console.log('unable to locate on collection') : this.collection.remove(x);
                        
                        this.collection.add(data);  
                    } else {
                        console.log('edit to collection');
                        this.collection.each(function(item){
                            if(data.id == item.get('id')){
                                var attrs = { }, k;
                                for(k in item.attributes) {
                                    attrs[k] = item.attributes[k];
                                    console.log(data[k] +'-'+ attrs[k]);
                                    if(data[k] == attrs[k]){
                                        console.log('same');
                                    } else {
                                        console.log('not same');
                                        item.set(k, data[k]);
                                    }
                                   
                                }
                            }
                        }, this);
                        //this.collection.set(data);
                    }
                    

                    this.clearForm();
                    
                    this.$("#mdl-detail-save-item").text('Add');
                }
            }
        },
        cancelItem: function(e){
            this.clearForm();
            this.$("#mdl-detail-save-item").text('Add');
        },
        clearForm: function(){
            this.$el.clearForm()
        },
        renderToForm: function(data){
            console.log(data);
        }
    });

    var SearchChkdtlView = FormDetailView.extend({
        el: '#search-chkdtl.modal-table-detail',
        initialize: function(){
            this.req = ['bankacctid', 'checkno', 'checkdate', 'amount']; 
            this.wf = ['checkno']; // wf = where filter
                      
        }
    });

    var SearchApvhdrView = FormDetailView.extend({
        el: '#search-apvhdr.modal-table-detail',
        initialize: function(){
            this.req = ['apvhdrid', 'amount']; 
            this.wf = ['apvhdrid']; // wf = where filter
        }
    });

    
    var DataGridView2 = Backbone.View.extend({
        el: '.tb-data',
        initialize: function(){
            
            this.settings = this.options.settings;

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

            if(this.settings.get('mode') == 'edit'){

            } else {
                this.settings.set({mode: 'edit', text: 'Edit Record'});
            }
            console.log(this.model.toJSON());
            //console.log(this.options.settings.toJSON());
            var id = $(e.currentTarget).parent().parent().parent().data('id');
            if(this.model.get('id') == id){
                console.log('clickd edit: same id as model');
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
                        cvapvdtls.reset();
                        cvapvdtls.url = '../api/txn/cvapvdtl/cvhdr/'+ model.get('id');
                        cvapvdtls.fetch({reset: true});

                        cvchkdtls.reset();
                        cvchkdtls.url = '../api/txn/cvchkdtl/cvhdr/'+ model.get('id');
                        cvchkdtls.fetch({reset: true});            
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

            if(this.settings.get('mode') == 'delete'){

            } else {
                this.settings.set({mode: 'delete', text: 'Delete Record'});
            }
            
            //console.log(this.options.settings.toJSON());
            var id = $(e.currentTarget).parent().parent().parent().data('id');

            if(this.model.get('id') == id){
                console.log('clickd delete: same id as model');
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
                        cvapvdtls.reset();
                        cvapvdtls.url = '../api/txn/cvapvdtl/cvhdr/'+ model.get('id');
                        cvapvdtls.fetch();

                        cvchkdtls.reset();
                        cvchkdtls.url = '../api/txn/cvchkdtl/cvhdr/'+ model.get('id');
                        cvchkdtls.fetch();           
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

            
            this.settings.set({mode: 'posting', text: 'Posting Record'});
            //console.log(this.options.settings.toJSON());
            var id = $(e.currentTarget).parent().parent().parent().data('id');

            if(this.model.get('id') == id){
                console.log('clickd post: same id as model');
            } else {
                this.model.set({'id':id});  
                this.model.fetch({
                    beforeSend: function(){
                        //console.log('fetching: '+ id);
                    },
                    success: function(model, respone){
                        cvapvdtls.reset();
                        cvapvdtls.url = '../api/txn/cvapvdtl/cvhdr/'+ model.get('id');
                        cvapvdtls.fetch();

                        cvchkdtls.reset();
                        cvchkdtls.url = '../api/txn/cvchkdtl/cvhdr/'+ model.get('id');
                        cvchkdtls.fetch();
                                        
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
            window.open('check-print/'+id);
        },
        successPosting: function(){
            alert('successPosting');
        }
    });
   








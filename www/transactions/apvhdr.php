<?php
require_once('../../lib/initialize.php');
?>
<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">

<title>Modularfusion Inc - Accounts Payable</title>
<link rel="shortcut icon" type="image/x-icon" href="../images/mfi-logo.jpg" />

<link rel="stylesheet" href="../css/bootstrap.css">
<link rel="stylesheet" href="../css/styles-ui.css">
<link rel="stylesheet" href="../css/main-ui.css">


<script src="../js/vendors/jquery-1.10.1.min.js"></script>
<script src="../js/vendors/jquery-ui-1.10.3.js"></script>
<!--
<script src="../js/vendors/jquery-ui-1.10.3.js"></script>
<script src="../js/vendors/jquery-1.9.1.js"></script>
<script src="js/vendors/underscore-min.js"></script>
<script src="js/vendors/backbone-min.js"></script>
-->
<script src="../js/vendors/underscore-min.js"></script>
<script src="../js/vendors/backbone-min.js"></script>
<script src="../js/vendors/bootstrap.min.js"></script>
<script src="../js/vendors/backbone-forms.min.js"></script>
<script src="../js/vendors/backbone-forms-list.min.js"></script>
<script src="../js/vendors/jquery.dataTables.min.js"></script>
<script src="../js/vendors/backbone-validation-min.js"></script>
<script src="../js/vendors/NumberFormat154.js"></script>
<script src="../js/vendors/moment.2.1.0-min.js"></script>
<script src="../js/vendors/accounting.js"></script>
<script src="../js/common.js"></script>
<script src="../js/app-menu.js"></script>
<script src="../js/main-ui.js"></script>
<script src="../js/app-ui.js"></script>
<script src="../js/category.js"></script>
<script src="../js/models.js"></script>
<script src="../js/views.js"></script>
<script src="../js/apvhdr.js"></script>

<!--
<script src="../js/app-menu.js"></script>

-->


<script type="text/template" id="modal-apvhdr-tpl">
	<form id="frm-mdl-apvhdr" name="frm-mdl-apvhdr" class="table-model" data-table="apvhdr" action="" method="post">	
    	<table cellpadding="5px" cellspacing="0" border="0" >
        	<tbody>
            	<tr>
                	<td><label for="refno">Reference No: </label></td>
                    <td><input type="text" name="refno" id="refno" maxlength="10" readonly ></td>
					
					<td><label for="date">Date:</label></td>
                    <td><input type="text" name="date" id="date"  placeholder="yyyy-mm-dd" required></td>
            	</tr>
                <tr>
                	<td><label for="supplierid">Supplier:</label></td>
                    <td>
						<select name="supplierid" id="supplierid">
                        <?php
                           
                            
                            $suppliers = Supplier::find_all();
                                                
                            foreach( $suppliers as  $supplier) {                        
                               echo "<option value=\"".strtolower($supplier->id)."\">". $supplier->descriptor ."</option>";
                            }  
                            
                        ?>

                        </select>
					</td>
					
					<td><label for="supprefno">Supplier Ref No:</label></td>
                    <td><input type="text" name="supprefno" id="supprefno" ></td>
         		</tr>
				<tr>
                	<td><label for="porefno">PO Ref No:</label></td>
                    <td><input type="text" name="porefno" id="porefno"></td>
					
					<td><label for="terms">Terms:</label></td>
                    <td><input type="text" name="terms" id="terms"></td>
         		</tr>
				<tr>
                	<td><label for="totamount">Total Amount:</label></td>
                    <td><input type="text" name="totamount" id="totamount" class="currency" readonly></td>
					
					<td><label for="balance">Balance:</label></td>
                    <td><input type="text" name="balance" id="balance" class="currency" readonly><input type="hidden" name="totline" id="totline"></td>
                	
         		</tr>
				<tr>
					
                   	<td><label for="notes">Notes:</label></td>
                    <td><textarea type="text" name="notes" id="notes" style="width: 145px; height: 50px;"></textarea></td>
					
					<td><label for="toogle-cancelled">Cancelled:</label></td>
                    <td>
						<input id="toogle-cancelled" class="toggle" type="checkbox" data-input="cancelled">
						<input id="cancelled" type="hidden" name="cancelled" value="">
					</td>
         		</tr>
				
        	</tbody>
    	</table>
 	</form>
</script>


<script type="text/template" id="modal-apvdtls-tpl">
	<table class="modal-tb-detail" cellpadding="0" cellspacing="0" width="100%" border="0">
	<thead>
		<tr><th>Item</th><th>Amount</th></tr>
	</thead>
	<tbody class="items-tbody">
	
	</tbody>
	<tfoot>
	<tr><td >
	
	</td>
	<td>  
		
	</td></tr>
	
	</tfoot>
	</table>
</script>


<script type="text/template" id="modal-items-tpl">
<form class="modal-table-detail">
	<input type="hidden" name="id" id="id">
	<input type="hidden" name="itemid" id="itemid">
	<input type="hidden" name="apvhdrid" id="apvhdrid">
	<input type="text" class="search-detail">
	<input type="number" name="amount" id="amount">
	<button type="button" id="mdl-detail-save-item" class="btn btn-primary btn-sm">Add</button>
	<button type="button" id="mdl-detail-cancel-item" class="btn btn-default btn-sm">Cancel</button>
</form>
</script>



<script>
var oTable;

function log( message ) {
     //  $( "<div>" ).text( message ).appendTo( "#log" );
	$("#log").text(message);
	//$( "#log" ).scrollTop( 0 );
}
function itemSearch(){
	 $(".search-detail").autocomplete({
            source: function( request, response ) {
                $.ajax({
					type: 'GET',
					url: "../api/search/item",
                    dataType: "json",
                    data: {
                        maxRows: 25,
                        q: request.term
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
                            return {
                                label: item.code + ' - ' + item.descriptor,
                                value: item.code,
								id: item.id
                            }
                        }));
                    }
                });
            },
            minLength: 2,
            select: function( event, ui ) {
				//console.log(ui);
                log( ui.item ? "Selected: " + ui.item.label : "Nothing selected, input was " + this.value);
	
				$("#itemid").val(ui.item.id); /* set the selected id */
				
            },
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				$("#itemid").val('');  /* remove the id when change item */
            },
            close: function() {
                $( this ).removeClass( "ui-corner-top" ).addClass( "ui-corner-all" );
            },
			messages: {
				noResults: '',
				results: function() {}
			}
			
       });
}

$(document).ready(function(e) {
	
	
	
	var appRouter = new Router();
	var appView = new AppView({model: app});
	
	var apvhdrView = new ParentChildModal({model: apvhdr, collection: apvdtls});
	
	
	var detailView = new ModalDetailView({model: apvhdr, collection: apvdtls});
	detailView.render();

	var formDetailView = new FormDetailView({model: apvdtl, collection: apvdtls});
	formDetailView.render();
	
	
	var apvhdrDataGridView = new DataGridView({model: apvhdr, collection: apvdtls});
	
	
	
	
	$('#tlbr-new').on('click', function(){
		//$(".modal .modal-title").text('Add');
		/*
		apvhdrView.modalTitle.text('Add Record');
		apvhdrView.clearForm();
		btn = '<button type="button" id="modal-btn-save" class="btn btn-primary model-btn-save" data-dismiss="modal" disabled>Save</button>';
        btn += '<button type="button" id="modal-btn-save-blank" class="btn btn-primary model-btn-save-blank" disabled>Save &amp; Blank</button>';
        btn += '<button type="button" id="modal-btn-cancel" class="btn btn-default model-btn-cancel" data-dismiss="modal">Cancel</button>';
        $('.modal-footer').html(btn); 
		*/
		apvhdrView.appendBlank();
		$('#mdl-frm-apvhdr').modal('show'); 
	});
	
	

	Backbone.history.start();
	
	//$('#mdl-frm-apvhdr').modal('show');
	itemSearch();
	
	
	oTable = $('.tb-data').dataTable( {
		"aaSorting": [[ 0, "desc" ]],
        "sPaginationType": "full_numbers",
		"bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": "../api/datatables/v/apvhdr",
		"fnHeaderCallback":  function( nHead, aData, iStart, iEnd, aiDisplay ) { 
				
				//var title = [,"Code","Descriptor"];
				//console.log(title.length);
				for(i=0; i<=$('th', nHead).length-1; i++) {
					$('th', nHead).removeAttr('style');
				}		
				
			},
		"aoColumns": [
			//{   "sTitle": "<input type='checkbox' class='select-all'></input>","mDataProp": null, "sWidth": "20px", "sDefaultContent": "<input type='checkbox' ></input>", "bSortable": false},
            { "mData": "refno",  "sTitle": "Ref No",
				"mRender": function ( data, type, apvhdr ) {
							if(apvhdr.posted==1){
								return data+'<div class="tb-data-action"><a class="row-view" href="#"></a></div>';
							} else {
								return data+'<div class="tb-data-action"><a class="row-post" href="#">&nbsp;</a><a class="row-delete" href="#">&nbsp;</a><a class="row-edit" href="#">&nbsp;</a><a class="row-view" href="#"></a></div>';
							}
				}
			},
            { "mData": "date",  "sTitle": "Date Created",
				"mRender": function ( data, type, apvhdr ) {
							return moment(data).format("MMM D, YYYY");
				}
			},
			{ "mData": "due",  "sTitle": "Due Date",
				"mRender": function ( data, type, apvhdr ) {
							return moment(data).format("MMM D, YYYY");
				}	
			},
			{ "mData": "supplier",  "sTitle": "Supplier" },
			{ "mData": "supprefno",  "sTitle": "Supplier Ref No" },
			{ "mData": "porefno",  "sTitle": "PO Ref No" },
			{ "mData": "terms",  "sTitle": "Terms" },
			{ "mData": "totamount",  "sTitle": "Total Amount" },
			{ "mData": "balance",  "sTitle": "Balance" },
			{ "mData": "posted",  "sTitle": "Posted",
				"mRender": function ( data, type, apvhdr ) {
							if(apvhdr.posted==1){
								return '✔';
							} else {
								return '✖';
							}
				}			
			}
			],
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {
		
			
		
      		$(nRow).attr("data-id", aData.id);
			$(nRow).attr("id", aData.id);
			
			$('td:eq(7), td:eq(8)', nRow).addClass("currency").each(function(){
                    $(this).toCurrency();
                });
				
		$('td:eq(6)', nRow).addClass("number");
		$('td:eq(9)', nRow).addClass("posted");
	
      }
    });
	
	
	
	
	
	
	$("#tlbr-refresh-datatable").on('click', function(){
			oTable.fnDraw();
	});
	$("#tlbr-refresh-datatable2").on('click', function(){
			oTable.fnDraw();
	});
	$(".tlbr-refresh").on('click', function(){
			oTable.fnDraw();
	});
	
	
   

	
});
</script>

</head>
<body id="app-body" class="state-nav">
<div id="container">
	<header id="h">
		<div id="h-main">
            <div id="h-main-logo">
                <img src="../../images/mfi-logo.jpg">
                <div class="comp-name">
                	<h1>Modularfusion</h1>
                </div>
            </div>
            <div id="h-main-user">
                <div>
                    <a href="#">Jefferson Salunga</a>
                    <a class="logout" href="../../logout">Sign out</a>
                </div>
                <img src="../images/silhouette36.png">
            </div>
        </div>
        <div style="clear: both; ">
            <div id="h-nav">
                <div id="h-nav-container"></div>
            </div>
            <div id="h-subnav">
                <div id="h-subnav-container"></div>
            </div>
        </div>
        
	</header>
	
	<div role="main" class="animated">
	<div>
		<div role="navigation" class="animated">
	  	
		<div id="nav-container">
        	<nav class="main-nav">
            	<div id="menu0" class="nav deactive">
           			<div class="bb">
            			<div class="Sj"></div>
           				<div class="yb"></div>
            			<div class="kk">Masterfiles</div>
            		</div>
                    <ul class="fd">
                        <li><a href="../masterfiles/matcat">Materials Category</a></li>
                        <li><a href="../masterfiles/material">Material</a></li>
                    	<li><a href="../masterfiles/acctcat">Accounts Category</a></li>
                        <li><a href="../masterfiles/account">Account</a></li>
                        <li><a href="../masterfiles/supplier">Supplier</a></li>
                        <li><a href="../masterfiles/bank">Bank</a></li>
                    </ul>
            	</div>
                <div id="menu1" class="nav active">
               		<div class="bb">
                        <div class="Sj"></div>
                        <div class="yb"></div>
                        <div class="kk">Transactions</div>
               		</div>
                    <ul class="fd">
                   		<li class="active"><a href="apvhdr">Accounts Payable</a></li>
                        <li><a href="check">Check</a></li>
                        <li><a href="invoice">Invoice</a></li>
                    </ul>
                </div>
                <div id="menu2" class="nav deactive">
                    <div class="bb">
                        <div class="Sj"></div>
                        <div class="yb"></div>
                    	<div class="kk">reports</div>
                	</div>
                	<ul class="fd"> </ul>
                </div>
                <div id="menu3" class="nav deactive">
                    <div class="bb">
                        <div class="Sj"></div>
                        <div class="yb"></div>
                        <div class="kk">utilities</div>
                    </div>
                	<ul class="fd"> </ul>
                </div>
            </nav>
        </div>
	  	
	  	<p><a data-state="initial" href="#">Close</a></p>
	  	</div>
	  	
	  	<div role="sidebar" class="animated">
	  		<h3>Sidebar</h3>
	  		<p>This is the sidebar content.</p>
	  		<p class="main-ui-close"><a data-state="initial" href="#">Close</a></p>
	  	</div>
	  	
	  	<div role="content" class="animated">
	  		<div class="splitter" > </div>
			<div class="stage">
			<!-------------- stage ---------------------------->
			
			<header>
            	<div class="mod-name">
                	<h1>Accounts Payable</h1>
                    <nav id="breadcrum">
						<ul>
							<li><a href="../">Home</a></li>
							<li><a href="../transactions">Transactions</a></li>
							<li>Accounts Payable</li>
						</ul>
                    </nav>
                </div>
            </header>
        	<section>
            	<!--
            	<nav class="navbar navbar-default">
            		<div class="navbar-header">
                    	<button type="button" class="navbar-toggle" data-toggle="collapse" data-target=".navbar-ex1-collapse">
                      		<span class="sr-only">Toggle navigation</span>
                      		<span class="icon-bar"></span>
                      		<span class="icon-bar"></span>
                      		<span class="icon-bar"></span>
                    	</button>
                  	</div>
                    <div class="collapse navbar-collapse navbar-ex1-collapse">
                        <ul class="nav navbar-nav">
                          <li class="active"><a href="#">New</a></li>
                          <li><a href="#">Delete</a></li>
                          <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                              <li><a href="#">Action</a></li>
                              <li><a href="#">Another action</a></li>
                              <li><a href="#">Something else here</a></li>
                              <li><a href="#">Separated link</a></li>
                              <li><a href="#">One more separated link</a></li>
                            </ul>
                          </li>
                        </ul>
                        <ul class="nav navbar-nav navbar-right">
                          <li><a href="#">Link</a></li>
                          <li class="dropdown">
                            <a href="#" class="dropdown-toggle" data-toggle="dropdown">Dropdown <b class="caret"></b></a>
                            <ul class="dropdown-menu">
                              <li><a href="#">Action</a></li>
                              <li><a href="#">Another action</a></li>
                              <li><a href="#">Something else here</a></li>
                              <li><a href="#">Separated link</a></li>
                            </ul>
                          </li>
                        </ul>
                      </div>
                </nav>
                -->
            	<div class="toolbar-container">
                	<div class="toolbar">
                    	<!--
                    	<button id="tlbr-new" class="toolbar-minibutton" data-target="#mdl-frm-itemcat" data-toggle="modal" type="button" title="Create New Record">New</button>
                        <button id="tlbr-refresh-datatable" class="toolbar-minibutton" type="button" title="Refresh Datatable">Refresh</button>
                        -->
                        <button id="tlbr-new" class="toolbar-minibutton" data-target="#mdl-frm-itemcat" data-toggle="modal" type="button" title="Create New Record"><div class="tlbr-new">&nbsp;</div></button>
                        <button id="tlbr-refresh-datatable" class="toolbar-minibutton" type="button" title="Refresh Datatable"><div class="tlbr-refresh">&nbsp;</div></button>
                        
                        <!--
                        <button id="tlbr-delete" class="toolbar-minibutton disabled" type="button" >Delete</button>
                        <button id="tlbr-edit" class="toolbar-minibutton" data-target="#mdl-frm-category" data-toggle="modal" type="button">Edit</button>
                        -->
                    </div>
                </div>
                <div class="form-alert"></div>
                
                <!-------------- from-container ---------------------------->
                <!--
                <div class="form-container">
                <div class="row">
  					<div class="col-xs-6 col-sm-4 col-md-4" style="background-color:#666699;">col-xs-6 .col-sm-4 .col-md-4</div>
  					<div class="col-xs-6 col-sm-4 col-md-4" style="background-color:#FF9;">.col-xs-6 .col-sm-4 .col-md-4</div>
				</div>
                <div class="row">
  					<div class="col-sm-4 col-md-4" style="background-color:#F1C40F;">col-md-4</div>
  					<div class="col-sm-4 col-md-4" style="background-color:#F39C12;">col-md-4</div>
				</div>
                
                <div id="frm-alert"></div>
               	<form id="frm-itemcat" name="frm-itemcat" class="table-model" data-table="itemcat" action="" method="post">	
                	<table cellpadding="0" cellspacing="0" border="0">
                    	<tbody>
                        	<tr>
                            	<td><label for="code">Code:</label></td>
                                <td><input type="text" name="code" id="code" maxlength="20" required></td>
                            </tr>
                            <tr>
                            	<td><label for="descriptor">Descriptor:</label></td>
                                <td><input type="text" name="descriptor" id="descriptor" maxlength="50" class="m-input"></td>
                            </tr>
                            <tr>
                            	<td>&nbsp;</td>
                                <td style="padding-top: 5px;">  		
                                  	<button type="button" id="frm-btn-save" class="btn btn-primary model-btn-save" disabled>Save</button>
                                    <button type="button" id="frm-btn-delete" class="btn btn-primary model-btn-delete" disabled>Delete</button>
                                 	<button type="button" id="frm-btn-cancel" class="btn btn-default model-btn-cancel" disabled>Clear</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                </div>
                <!-------------- end from-container ---------------------------->	
                 <div class="parent-container">
                 </div>
                
                <div class="tb-data-container">
                	<table class="tb-data" cellpadding="0" cellspacing="0" width="100%">
		                       <!-- <thead>
		                          <tr>
                                  	 
		                              <th>Code</th>
		                              <th>Descriptor</th>
                                      <th>Type</th>
                                    
		                            </tr>
		                        </thead>
		                        <tbody>
		                          <tr>
                                  	  
		                              <td>Jefferson</td>
		                              <td>Raga</td>
                                      <td>Salunga</td>
                                    
		                          </tr>
                                  
		                        </tbody>
                                -->
	                        </table>
                </div>
            </section>
			
			<!-------------- end stage ---------------------------->
			<div style="height: 300px; "></div>	
			</div>
	  	</div>

	</div>
	</div>  
	<div role="presentations" class="padded animated">
	  	<h3>Presentation</h3>
	  	<p>This is the presentation content.</p>
	  	<p><a data-state="initial" href="#">Switch to 'Initial' state</a></p>
	</div>
</div>


 <div class="modal fade" id="mdl-frm-apvhdr" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="modal-title"></h4>
        </div>
        <div class="modal-body">
        	<div class="modal-parent-child">
                <div class="modal-body-parent">
                </div>
                <div class="modal-body-child">
                </div>
              	<div class="modal-body-item">
                </div>
           	</div>
        </div>
        <div class="modal-footer">
          <!--
          <button type="button" id="mdl-btn-save" class="btn btn-primary model-btn-save" data-dismiss="modal" disabled>Save</button>
          <button type="button" is="mdl-btn-save-blank" class="btn btn-primary model-btn-save-blank" disabled>Save &amp; Blank</button>
          <button type="button" id="mdl-btn-save" class="btn btn-default model-btn-cancel" data-dismiss="modal" disabled>Cancel</button>
        	-->
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->


</body>
</html>
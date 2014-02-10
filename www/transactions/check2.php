<?php
require_once('../../lib/initialize.php');
?>
<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">

<title>Modularfusion Inc - Check</title>
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
<script src="//underscorejs.org/underscore-min.js"></script>
<script src="//backbonejs.org/backbone-min.js"></script>

<script src="../js/vendors/bootstrap.min.js"></script>

<script src="../js/vendors/jquery.dataTables.min.js"></script>
<script src="../js/vendors/backbone-validation-min.js"></script>

<script src="../js/vendors/moment.2.1.0-min.js"></script>
<script src="../js/vendors/accounting.js"></script>

<script src="../js2/app-ui.js"></script>


<!--
<script src="../js/app-menu.js"></script>

-->


<script type="text/template" id="modal-cvhdr-tpl">
	<form id="frm-mdl-cvhdr" name="frm-mdl-cvhdr" class="table-model" data-table="cvhdr" action="" method="post">	
    	<table cellpadding="5px" cellspacing="0" border="0" width="100%" >
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
						<select name="supplierid" id="supplierid" required>
                        <?php
                           
                            
                            $suppliers = Supplier::find_all();
                                                
                            foreach( $suppliers as  $supplier) {                        
                               echo "<option value=\"".strtolower($supplier->id)."\">". $supplier->descriptor ."</option>";
                            }  
                            
                        ?>

                        </select>
					</td>
					
					<td><label for="payee">Payee:</label></td>
                    <td><input type="text" name="payee" id="payee"></td>
         		</tr>
				<tr>
                	<td><label for="totapvamt">Total APV Amount:</label></td>
                    <td>
						<input type="text" name="totapvamt" id="totapvamt" class="currency" readonly>
						<input type="hidden" name="totapvline" id="totapvline">	
					</td>
					
					<td><label for="totchkamt">Total Check Amount:</label></td>
                    <td>
						<input type="text" name="totchkamt" id="totchkamt" class="currency" readonly>
						<input type="hidden" name="totchkline" id="totchkline">
					</td>
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






<script>
var oTable;

function log( message ) {
     //  $( "<div>" ).text( message ).appendTo( "#log" );
	$("#log").text(message);
	//$( "#log" ).scrollTop( 0 );
}
function itemSearchApvdhr(){
	 $("#search-apvhdr .search-detail").autocomplete({
            source: function( request, response ) {
				var supplierid = $('.table-model #supplierid').val();
                $.ajax({
					type: 'GET',
					url: "../api/search/txn/v/apvhdr/" + supplierid ,
                    dataType: "json",
                    data: {
                        maxRows: 25,
                        q: request.term
                    },
                    success: function( data ) {
                        response( $.map( data, function( item ) {
                            return {
                                label: item.refno,
                                value: item.refno,
								amount: item.totamount,
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
	
				$("#apvhdrid").val(ui.item.id); /* set the selected id */
				$("#amount").val(ui.item.amount);
				
            },
            open: function() {
                $( this ).removeClass( "ui-corner-all" ).addClass( "ui-corner-top" );
				$("#apvhdrid").val('');  /* remove the id when change item */
				$("#amount").val('');
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
	

	
	


	
	
	/*
	
	var apvhdrView = new ParentChildModal({model: apvhdr, collection: apvdtls});
	
	
	var detailView = new ModalDetailView({model: apvhdr, collection: apvdtls});
	detailView.render();

	var formDetailView = new FormDetailView({model: apvdtl, collection: apvdtls});
	formDetailView.render();
	
	
	var apvhdrDataGridView = new DataGridView({model: apvhdr, collection: apvdtls});
	
	*/
	
	
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
		parentChildModal.appendBlank();
		$('#mdl-frm-cvhdr').modal('show'); 
	});
	
	

	Backbone.history.start();
	
	//$('#mdl-frm-apvhdr').modal('show');
	itemSearchApvdhr();
	
	
	oTable = $('.tb-data').dataTable( {
		"aaSorting": [[ 0, "desc" ]],
        "sPaginationType": "full_numbers",
		"bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": "../api/datatables/v/cvhdr",
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
				"mRender": function ( data, type, cvhdr ) {
							if(cvhdr.posted==1){
								return data+'<div class="tb-data-action"><a class="row-view" href="#"></a></div>';
							} else {
								return data+'<div class="tb-data-action"><a class="row-post" href="#">&nbsp;</a><a class="row-delete" href="#">&nbsp;</a><a class="row-edit" href="#">&nbsp;</a><a class="row-view" href="#"></a></div>';
							}
				}
			},
            { "mData": "date",  "sTitle": "Date" },
			{ "mData": "supplier",  "sTitle": "Supplier" },
			{ "mData": "payee",  "sTitle": "Payee" },
			{ "mData": "totapvamt",  "sTitle": "APV Total Amount" },
			{ "mData": "totchkamt",  "sTitle": "Check Total Amount" },
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
			
			$('td:eq(4), td:eq(5)', nRow).addClass("currency").each(function(){
                    $(this).toCurrency();
                });
				
		
		$('td:eq(6)', nRow).addClass("posted");
	
      }
    });
	
	
	$("#checkdate").datepicker({"dateFormat": "yy-mm-dd",
                select: function(event, ui){
                
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


<script type="text/template" id="body-template">
<div id="container">
	<header id="h">
	
	</header>
	
	<div role="main" class="animated">
	<div>
		<div role="navigation" class="animated">
	  	
		<div id="nav-container"></div>
	  	
	  	<p><a data-state="initial" href="#">Close</a></p>
	  	</div>
	  	
	  	<div role="sidebar" class="animated">
	  		<h3>Sidebar</h3>
	  		<p>This is the sidebar content.</p>
	  		<p class="close"><a data-state="initial" href="#">Close</a></p>
	  	</div>
	  	
	  	<div role="content" class="animated">
	  		<div class="splitter" > </div>
			<div class="stage">
			<!-------------- stage ---------------------------->
			
			<header>
            	<div class="mod-name">
                	<h1>Masterfiles Management</h1>
                    <nav id="breadcrum">
						<ul>
							<li><a href="../../index">Home</a></li>
							<li><a href="../../masterfiles/index">Masterfiles</a></li>
							<li>Category</li>
						</ul>
                    </nav>
                </div>
            </header>
        	<section>
            	<div class="toolbar-container">
                	<div class="toolbar">
                    	<button id="tlbr-new" class="toolbar-minibutton" data-target="#mdl-frm-category" data-toggle="modal" type="button">New</button>
                        <button id="tlbr-delete" class="toolbar-minibutton disabled" type="button" >Delete</button>
                        <button id="tlbr-edit" class="toolbar-minibutton" data-target="#mdl-frm-category" data-toggle="modal" type="button">Edit</button>
                    </div>
                </div>
                <div class="form-alert"></div>
                <div class="form-container">
                	
                </div>
                <div class="tb-data-container">
                
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
</script>



<script type="text/template" id="header-tpl">
<div id="h-main">
	<div id="h-main-logo">
		<img src="../../images/75x75.png">
		<div class="comp-name"></div>
	</div>
	<div id="h-main-user">
		<div>
			<a href="#"><%=user%> - <%=state%></a>
			<a class="logout" href="../logout">Sign out</a>
		</div>
		<img src="../images/silhouette36.png">
	</div>
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
</script>
</head>
<body>

</body>
</html>
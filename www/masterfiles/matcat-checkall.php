<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">

<title>Modularfusion Inc - Materials Category</title>


<link rel="stylesheet" href="../css/bootstrap.css">
<link rel="stylesheet" href="../css/styles-ui.css">
<link rel="stylesheet" href="../css/main-ui.css">


<script src="../js/vendors/jquery-1.10.1.min.js"></script>
<script src="../js/vendors/jquery-ui-1.8.min.js"></script>
<!--
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
<script src="../js/common.js"></script>
<script src="../js/app-menu.js"></script>
<script src="../js/main-ui.js"></script>
<script src="../js/app-ui.js"></script>
<script src="../js/category.js"></script>
<script src="../js/models.js"></script>
<script src="../js/views.js"></script>
<!--
<script src="../js/app-menu.js"></script>

-->


<script type="text/template" id="modal-matcat-tpl">
	<form id="frm-matcat" name="frm-matcat" class="table-model" data-table="matcat" action="" method="post">	
   		<table cellpadding="0" cellspacing="0" border="0">
        	<tbody>
            	<tr>
                	<td><label for="code">Code:</label></td>
                    <td><input type="text" name="code" id="code" maxlength="20"></td>
               	</tr>
                <tr>
                	<td><label for="descriptor">Descriptor:</label></td>
                    <td><input type="text" name="descriptor" id="descriptor" maxlength="50" class="m-input"></td>
              	</tr>
         	</tbody>
      	</table>
	</form>	
</script>




<script type="text/template" id="menu-tpl">
	<div class="bb">
		<div class="Sj"></div>
		<div class="yb"></div>
		<div class="kk"><%= name %></div>
	</div>
	<ul class="fd">
		<% _.each(sub, function(element){ %>
			
			<li><a href="<%= element.name %>.php" ><%= element.name %></a></li>
		<% }) %>
	</ul>
</script>
<!-- <li <% if(element.class === 'active') { %>  class="active" <%}  %> ><a href="<%= element.name %>.php" ><%= element.name %></a></li> -->


<script>
var oTable;


$(document).ready(function(e) {
	
	var appRouter = new Router();
	
	var appView = new AppView({model: app});
	
	
	//appView.loadMenus();
	//appView.render();
	//$(appView.el).appendTo("#app-body");

	Backbone.history.start();
	
	
	
	
	
	
	
	
	
	
	oTable = $('.tb-data').dataTable( {
        "sPaginationType": "full_numbers",
		"bProcessing": true,
        "bServerSide": true,
        "sAjaxSource": "../api/datatables/matcat",
	//	"sAjaxSource": "../www/test/datatable_test.php"
		"fnHeaderCallback":  function( nHead, aData, iStart, iEnd, aiDisplay ) { 
				
				//var title = [,"Code","Descriptor"];
				//console.log(title.length);
				//for(i=0; i<=title.length-1; i++) {
				//	$('th:eq('+ i +')', nHead).text(title[i]);
				//}		
				
			},
		"aoColumns": [
			{   "sTitle": "<input type='checkbox' class='select-all'></input>","mDataProp": null, "sWidth": "20px", "sDefaultContent": "<input type='checkbox' ></input>", "bSortable": false},
            { "mData": "code",  "sTitle": "Code" },
            { "mData": "descriptor",  "sTitle": "Descriptor" }
			],
		"fnRowCallback": function( nRow, aData, iDisplayIndex, iDisplayIndexFull ) {

	            $(nRow).attr("data-id", aData.id);
				$(nRow).attr("id", aData.id);
				 
				//console.log(aData.type);
				/*
				if ( aData.type == 1 ) {
		        	$('td:eq(2)', nRow).html( 'Product/Service' );
		        } else {
					$('td:eq(2)', nRow).html( 'Expense' );
				}
	            return nRow;
				*/
        	}
    });
	
	
	
	
	
	
	$("#tlbr-new").on('click', function(){
			$("#mdl-frm-category .modal-title").text('Add Materials Category');
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
            	<div id="menu0" class="nav active">
           			<div class="bb">
            			<div class="Sj"></div>
           				<div class="yb"></div>
            			<div class="kk">Masterfiles</div>
            		</div>
                    <ul class="fd">
                        <li class="active"><a href="matcat">Materials Category</a></li>
                    	<li><a href="#items">Items Category</a></li>
                        <li><a href="/salesman">salesman</a></li>
                        <li><a href="/supplier">supplier</a></li>
                        <li><a href="customer">customer</a></li>
                        <li><a href="location">location</a></li>
                    </ul>
            	</div>
                <div id="menu1" class="nav deactive">
               		<div class="bb">
                        <div class="Sj"></div>
                        <div class="yb"></div>
                        <div class="kk">transactions</div>
               		</div>
                    <ul class="fd">
                   		<li><a href="accounts payable.php">accounts payable</a></li>
                        <li><a href="check.php">check</a></li>
                        <li><a href="invoice.php">invoice</a></li>
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
                	<h1>Masterfiles Management</h1>
                    <nav id="breadcrum">
						<ul>
							<li><a href="../">Home</a></li>
							<li><a href="../../masterfiles">Masterfiles</a></li>
							<li>Materials Category</li>
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
                    	<button id="tlbr-new" class="toolbar-minibutton" data-target="#mdl-frm-category" data-toggle="modal" type="button">New</button>
                        <!--
                        <button id="tlbr-delete" class="toolbar-minibutton disabled" type="button" >Delete</button>
                        <button id="tlbr-edit" class="toolbar-minibutton" data-target="#mdl-frm-category" data-toggle="modal" type="button">Edit</button>
                        -->
                    </div>
                </div>
                <div class="form-alert"></div>
                <div class="form-container">
                <!-------------- from-container ---------------------------->
                <!--
                <div class="row">
  					<div class="col-xs-6 col-sm-4 col-md-4" style="background-color:#666699;">col-xs-6 .col-sm-4 .col-md-4</div>
  					<div class="col-xs-6 col-sm-4 col-md-4" style="background-color:#FF9;">.col-xs-6 .col-sm-4 .col-md-4</div>
				</div>
                <div class="row">
  					<div class="col-sm-4 col-md-4" style="background-color:#F1C40F;">col-md-4</div>
  					<div class="col-sm-4 col-md-4" style="background-color:#F39C12;">col-md-4</div>
				</div>
                -->
                <div id="frm-alert"></div>
               	<form id="frm-matcat" name="frm-matcat" class="table-model" data-table="matcat" action="" method="post">	
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
                                 	<button type="button" id="frm-btn-cancel" class="btn btn-default model-btn-cancel" disabled>Cancel</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </form>
                	
                <!-------------- end from-container ---------------------------->	
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


 <div class="modal fade" id="mdl-frm-category" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>
          <h4 class="modal-title"></h4>
        </div>
        <div class="modal-body">
			<form id="frm-mdl-matcat" name="frm-mdl-matcat" class="table-model" data-table="matcat" action="" method="post">	
                <table cellpadding="0" cellspacing="0" border="0">
                    <tbody>
                        <tr>
                            <td><label for="code">Code:</label></td>
                            <td><input type="text" name="code" id="code" maxlength="20"></td>
                        </tr>
                        <tr>
                            <td><label for="descriptor">Descriptor:</label></td>
                            <td><input type="text" name="descriptor" id="descriptor" maxlength="50" class="m-input"></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        </div>
        <div class="modal-footer">
          <button type="button" id="mdl-btn-save" class="btn btn-default model-btn-cancel" data-dismiss="modal">Cancel</button>
          <button type="button" id="mdl-btn-save" class="btn btn-primary model-btn-save">Save</button>
          <button type="button" is="mdl-btn-save-blank" class="btn btn-primary model-btn-save-blank">Save &amp; Blank</button>
        </div>
      </div><!-- /.modal-content -->
    </div><!-- /.modal-dialog -->
  </div><!-- /.modal -->


</body>
</html>
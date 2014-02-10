<!DOCTYPE HTML>
<html lang="en-ph">
<head>
<meta charset="utf-8">
<meta http-equiv="X-UA-Compatible" content="chrome=1">

<title>Backbone Basic App Layout dsadada</title>


<link rel="stylesheet" href="css/bootstrap.css">
<link rel="stylesheet" href="css/main-ui.css">
<link rel="stylesheet" href="css/styles-ui.css">

<script src="js/vendors/jquery-1.10.1.min.js"></script>
<script src="js/vendors/jquery-1.9.1.js"></script>
<!--
<script src="js/vendors/underscore-min.js"></script>
<script src="js/vendors/backbone-min.js"></script>
-->
<script src="http://underscorejs.org/underscore-min.js"></script>
<script src="http://backbonejs.org/backbone-min.js"></script>
<script src="js/vendors/backbone-forms.min.js"></script>
<script src="js/vendors/backbone-forms-list.min.js"></script>
<script src="js/app-menu.js"></script>
<script src="js/main-ui.js"></script>
<script src="js/app-ui.js"></script>



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
							<li><a href="../index">Home</a></li>
							<li><a href="../masterfiles/index">Masterfiles</a></li>
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
		<img src="images/75x75.png">
		<div class="comp-name"></div>
	</div>
	<div id="h-main-user">
		<div>
			<a href="#"><%=user%> - <%=state%></a>
			<a class="logout" href="logout">Sign out</a>
		</div>
		<img src="images/silhouette36.png">
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

<script type="text/template" id="menu-tpl">
	<div class="bb">
		<div class="Sj"></div>
		<div class="yb"></div>
		<div class="kk"><%= name %></div>
	</div>
	<ul class="fd">
		<% _.each(sub, function(element){ %>
			<li><%= element.name %></li>
		<% }) %>
	</ul>
</script>

</head>
<body id="app-body" class="state-nav">

</body>
</html>
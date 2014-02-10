<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class Apvdtl extends DatabaseObject{
	
	protected static $table_name="apvdtl";
	protected static $db_fields = array('id', 'apvhdrid' ,'itemid' ,'amount' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $apvhdrid;
	public $itemid;
	public $amount;
	


}




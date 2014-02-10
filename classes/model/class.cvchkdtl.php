<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class Cvchkdtl extends DatabaseObject{
	
	protected static $table_name="cvchkdtl";
	protected static $db_fields = array('id', 'cvhdrid' ,'bankacctid' ,'checkno' ,'checkdate' ,'amount' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $cvhdrid;
	public $bankacctid;
	public $checkno;
	public $checkdate;
	public $amount;
	


}




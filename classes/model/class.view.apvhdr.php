<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class vApvhdr extends DatabaseObject{
	
	protected static $table_name="vapvhdr";
	protected static $db_fields = array('id', 'refno' ,'date' ,'supplier', 'supplierid' ,'supprefno' ,'porefno' ,'terms' ,'totamount' ,'balance' ,'notes' ,'posted' ,'cancelled' ,'printctr' ,'totline', 'due' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $refno;
	public $date;
	public $supplier;
	public $supplierid;
	public $supprefno;
	public $porefno;
	public $terms;
	public $totamount;
	public $balance;
	public $posted;
	
	
	public $notes;
	public $cancelled;
	public $printctr;
	public $totline;
	public $due;
	
	

	
}




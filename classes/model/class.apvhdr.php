<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class Apvhdr extends DatabaseObject{
	
	protected static $table_name="apvhdr";
	protected static $db_fields = array('id', 'refno' ,'date' ,'supplierid' ,'supprefno' ,'porefno' ,'terms' ,'totamount' ,'balance' ,'notes' ,'posted' ,'cancelled' ,'printctr' ,'totline' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $refno;
	public $date;
	public $supplierid;
	public $supprefno;
	public $porefno;
	public $terms;
	public $totamount;
	public $balance;
	public $notes;
	public $posted;
	public $cancelled;
	public $printctr;
	public $totline;
	
	
	
	
	
	
	# overwrite DO create fnction
	public function create() {
		global $database;
		if(!isset($this->id) || $this->id==NULL) {
			$this->id = $database->get_uid();
		}
		
		$lastnumber = static::getLastNumber();
		$refno = str_pad($lastnumber, 10, "0", STR_PAD_LEFT);
		
		$attributes = $this->sanitized_attributes();
		$attributes['refno'] = $refno;
		
	 	$sql = "INSERT INTO ".static::$table_name." (";
		$sql .= join(", ", array_keys($attributes));  // - join the array eg:  key1 = 'value1', key2 = 'value2', ...', 
	  	$sql .= ") VALUES ('";
		$sql .= join("', '", array_values($attributes));
		$sql .= "')";
	  
	  if($database->query($sql)) {
	    return true;
	  } else {
	    return false;
	  }
	}
	

	
}




<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class Apledger extends DatabaseObject{
	
	protected static $table_name="apledger";
	protected static $db_fields = array('id', 'supplierid' ,'lastrec' ,'postdate' ,'txndate' ,'txncode' ,'txnrefno' ,'amount' ,'prevbal' ,'currbal' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $supplierid;
	public $lastrec;
	public $postdate;
	public $txndate;
	public $txncode;
	public $txnrefno;
	public $amount;
	public $prevbal;
	public $currbal;
	
	function get_currbal(){
		return $this->currbal = $this->amount + $this->prevbal;	
	}
	
	public static function get_last_record($supplierid=0){
		$sql = "SELECT * FROM ".self::$table_name." WHERE supplierid = '". $supplierid ."' ORDER BY postdate DESC LIMIT 1";
		$result_array = self::find_by_sql($sql);
		return !empty($result_array) ? array_shift($result_array) : false;	
	}
	


}




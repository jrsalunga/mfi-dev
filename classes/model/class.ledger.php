<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

/*
class Ledger extends DatabaseObject {
	
	public $IncTxnCodeList
	public $DecTxnCodeList
	
	function GetChange( tcTxnCode, tnValue )
	   IF tnValue isfoundin This.IncTxnCodeList
	      return tnValue
	   else
	      return tnValue * (-1)
	   endif
	
	function Update()
}

class APLedger extends Ledger {
     $table_name = "apledger" ;
     this.IncTxnCodeList = "APV,CM" ;
	 this.DecTxnCodeList = "CV,DM" ;
	 
     function Update( tcTxnCode, tcRefno, tdTxnDate, tnAmount, tnCurrBalance )
	     $tnAmount = This.GetChange( tcTxnCode, tnAmount )
		 $tnPrevBal = tnCurrBalance
		 $tnCurrBal = tnPrevBal + tnAmount
		 this.Add( tcTxnCode, tcRefno, tdTxnDate, tnAmount, tnCurrBalance )

}

*/


class Ledger extends DatabaseObject {
	
	public static $IncTxnCodeList = array();
	public static $DecTxnCodeList = array();
	
	public static function GetChange($tcTxnCode, $tnValue) {
	   if(false !== array_search($tcTxnCode, static::$IncTxnCodeList)) {
	      return $tnValue;
	   } else {
	      return $tnValue * (-1);
	   }
	}
	

}

class Apledger2 extends Ledger{
	
	protected static $table_name="apledger";
	protected static $db_fields = array('id', 'supplierid' ,'postdate' ,'txndate' ,'txncode' ,'txnrefno' ,'amount' ,'prevbal' ,'currbal');
	
	/*
	* Database related fields
	*/
	public $id;
	public $supplierid;
	public $postdate;
	public $txndate;
	public $txncode;
	public $txnrefno;
	public $amount;
	public $prevbal;
	public $currbal;
	
	
	public static $IncTxnCodeList = array('APV','CM');
	public static $DecTxnCodeList = array('CV','DM');
	 
    public static function post($tcTxnCode, $tcRefno, $tdTxnDate, $tnAmount, $tnCurrBalance, $tnSupplierId ) {
		
		$apledger 				= new self();
		$apledger->amount 		= self::GetChange($tcTxnCode, $tnAmount);
		$apledger->prevbal 		= $tnCurrBalance;
		$apledger->currbal 		= $apledger->prevbal + $apledger->amount;
		$apledger->txndate 		= $tdTxnDate;
		$apledger->txnrefno 	= $tcRefno;
		$apledger->txncode  	= $tcTxnCode; 	
		$apledger->supplierid 	= $tnSupplierId;
		
		return $apledger->create() ? $apledger : false;
		
		
	}
	
	function get_currbal(){
		return $this->currbal = $this->amount + $this->prevbal;	
	}
	
	public static function get_last_record($supplierid=0){
		$sql = "SELECT * FROM ".self::$table_name." WHERE supplierid = '". $supplierid ."' ORDER BY postdate DESC LIMIT 1";
		$result_array = self::find_by_sql($sql);
		return !empty($result_array) ? array_shift($result_array) : false;	
	}
	
	

	
	
}


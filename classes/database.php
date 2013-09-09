<?php
require_once(ROOT.DS."conf".DS."config.php");

class MySQLDatabase {
	
	// Singleton object. Leave $me alone.
    private static $me;
	
	private $connection;
	public $last_query;
	public $last_uid;
	private $magic_quotes_active;
	private $real_escape_string_exists;
	
  function __construct() {
    $this->open_connection();
	$this->magic_quotes_active = get_magic_quotes_gpc();
	$this->real_escape_string_exists = function_exists( "mysql_real_escape_string" );
  }
  
  
	
	 // Get Singleton object
    
    public static function getInstance() {
    	
    	if(is_null(self::$me)) {
        	self::$me = new MySQLDatabase();
		}
        return self::$me;
        
        /*
        if(isset(self::$me) {
        	return self::$me;
        }
        */
    }


	public function open_connection() {
		$this->connection = mysql_connect(DB_SERVER, DB_USER, DB_PASS);
		mysql_set_charset('utf8',$this->connection);
		if (!$this->connection) {
			die("Database connection failed: " . mysql_error());
		} else {
			$db_select = mysql_select_db(DB_NAME, $this->connection);
			if (!$db_select) {
				die("Database selection failed: " . mysql_error());
			}
		}
	}

	public function close_connection() {
		if(isset($this->connection)) {
			mysql_close($this->connection);
			unset($this->connection);
		}
	}

	public function query($sql) {
		$this->last_query = $sql;
		$result = mysql_query($sql, $this->connection);
		
		return $result;
		

		
	}
	
	public function escape_value( $value ) {
		$value = trim($value);
		if( $this->real_escape_string_exists ) { // PHP v4.3.0 or higher
			// undo any magic quote effects so mysql_real_escape_string can do the work
			if( $this->magic_quotes_active ) { $value = stripslashes( $value ); }
			$value = mysql_real_escape_string( $value );
		} else { // before PHP v4.3.0
			// if magic quotes aren't already on then add slashes manually
			if( !$this->magic_quotes_active ) { $value = addslashes( $value ); }
			// if magic quotes are active, then the slashes already exist
		}
		return $value;
	}
	
	// "database-neutral" methods
  public function fetch_array($result_set) {
    return mysql_fetch_array($result_set);
  }
  
  public function fetch_assoc($result_set) {
    return mysql_fetch_assoc($result_set);
  }
  
   public function fetch_row($result_set) {
    return mysql_fetch_row($result_set);
  }
  
  public function num_rows($result_set) {
   return mysql_num_rows($result_set);
  }
  
  public function insert_id() {
    // get the last id inserted over the current db connection
    return mysql_insert_id($this->connection);
  }
  
	public function error(){
		return mysql_error();
	}  
	
	public function errno(){
		return mysql_errno();
	} 
  
	public function affected_rows() {
    	return mysql_affected_rows($this->connection);
  	}

	private function confirm_query($result) {
		if (!$result) {
	    $output = "Database query failed: " . mysql_errno() ."->". mysql_error() ;
	    //$output .= "Last SQL query: " . $this->last_query;
	    die( $output );
		}
	}
	
	public function get_uid() {
		$sql = "SELECT REPLACE (UUID(), \"-\", \"\")";
		$result = $this->query($sql);
		$row = $this->fetch_array($result);
		$this->last_uid = $row[0];
		return $row[0];
	}
	
	public function startTransaction() {
		$sql = "START TRANSACTION";
		$result = $this->query($sql);
		$this->confirm_query($result);
		return $result;
	}
	
	public function commit() {
		$sql = "COMMIT";
		$result = $this->query($sql);
		$this->confirm_query($result);
		return $result;
	}
	
	public function rollback() {
		$sql = "ROLLBACK";
		$result = $this->query($sql);
		$this->confirm_query($result);
		return $result;
	}
	
	public function export2excel($sql, $filename) {
		if(!empty($sql) || $sql!=NULL) {
			$result = $this->query($sql);
			
			while($row = $this->fetch_assoc($result)){
			 	$aData[] = $row;
			}
			
			//feed the final array to our formatting function...
			$contents = $this->getExcelData($aData);
		
			$filename = isset($filename) ? $filename.".xls":"Download.xls";
		
			//prepare to give the user a Save/Open dialog...
			header ("Content-type: application/octet-stream");
			header ("Content-Disposition: attachment; filename=".$filename);
		
			//setting the cache expiration to 30 seconds ahead of current time. an IE 8 issue when opening the data directly in the browser without first saving it to a file
			$expiredate = time() + 30;
			$expireheader = "Expires: ".gmdate("D, d M Y G:i:s",$expiredate)." GMT";
			header ($expireheader);
		
			//output the contents
			return $contents;
			exit;
			
		} else {
			return false;
		}
	
	}
	
	private function getExcelData($data){
    $retval = "";
    if (is_array($data)  && !empty($data))
    {
     $row = 0;
     foreach(array_values($data) as $_data){
      if (is_array($_data) && !empty($_data))
      {
          if ($row == 0)
          {
              // write the column headers
              $retval = implode("\t",array_keys($_data));
              $retval .= "\n";
          }
           //create a line of values for this row...
              $retval .= implode("\t",array_values($_data));
              $retval .= "\n";
              //increment the row so we don't create headers all over again
              $row++;
       }
     }
    }
  return $retval;
 }
	
}
global $database;
$database = new MySQLDatabase();
$db =& $database;

?>
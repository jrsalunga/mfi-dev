<?php

// A class to help work with Sessions
// In our case, primarily to manage logging users in and out

// Keep in mind when working with sessions that it is generally 
// inadvisable to store DB-related objects in sessions

class Session {
	
	private $logged_in=false;
	public $user_id;
	public $message;
	public $fullname;
	#public $apvhdr;
	
	private static $me;
	
	function __construct() {
		
		session_start();
		
		#$this->apvhdr = $_SESSION['apvhdr'] = new sAPVhdr();
		
		$this->check_message();
		$this->check_login();
        $this->get_fullname();   
                
		if($this->logged_in) {
			
     		// actions to take right away if user is logged in
    	} else {
   			// actions to take right away if user is not logged in
			
    	}
	}
	
	
	
	 public static function getInstance() {
    	
    	if(is_null(self::$me)) {
        	self::$me = new Session();
		}
        return self::$me;
        
        /*
        if(isset(self::$me) {
        	return self::$me;
        }
        */
    }
	
  	
	public function is_logged_in() {
    	return $this->logged_in;
  	}
        	
	public function set_fullname($fullname) {
    	return $this->fullname =  $_SESSION['fullname'] = trim($fullname);
    }
	
	private function get_fullname() {
    	if(isset($_SESSION['fullname'])) {
        	$this->fullname = $_SESSION['fullname'];
		} else {	
      		unset($this->fullname);
     	}            
 	}
	

	public function login($user) {
    // database should find user based on username/password
    	if($user) { 
			$this->user_id = $_SESSION['cid'] = $user->personid;
     		$this->logged_in = true;   
        }
  	}
        
       
  
  
  	public function logout() {
		unset($_SESSION['cid']);
		unset($this->user_id);
	    $this->logged_in = false;
		session_destroy();
  	}

	public function message($msg="") {
	  if(!empty($msg)) {
	    // then this is "set message"
	    // make sure you understand why $this->message=$msg wouldn't work
	    $_SESSION['message'] = $msg;
	  } else {
	    // then this is "get message"
			return $this->message;
	  }
	}
        
        

	private function check_login() {
    if(isset($_SESSION['cid'])) {
      $this->user_id = $_SESSION['cid'];
      $this->logged_in = true;
    } else {
      unset($this->user_id);
      $this->logged_in = false;
    }
  }
    
  
	private function check_message() {
		// Is there a message stored in the session?
		if(isset($_SESSION['message'])) {
			// Add it as an attribute and erase the stored version
      $this->message = $_SESSION['message'];
      unset($_SESSION['message']);
    } else {
      $this->message = "";
    }
	}
	
}

$session = Session::getInstance();
$message = $session->message();

?>
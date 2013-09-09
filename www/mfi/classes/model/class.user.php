<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class User extends DatabaseObject{
	
	protected static $table_name="user";
	protected static $db_fields = array('id', 'username' , 'password' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $username;
	public $password;
	
	
}


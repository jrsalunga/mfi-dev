<?php
// If it's going to need the database, then it's 
// probably smart to require it before we start.
require_once(ROOT.DS.'classes'.DS.'database.php');

class vMaterial extends DatabaseObject{
	
	protected static $table_name="vmaterial";
	protected static $db_fields = array('id', 'code', 'descriptor','type' ,'matcat', 'matcatid', 'uom', 'onhand' ,'minlevel' ,'maxlevel' ,'reorderqty' ,'avecost' );
	
	/*
	* Database related fields
	*/
	public $id;
	public $code;
	public $descriptor;
	public $type;
	public $matcatid;
	public $matcat;
	public $uom;
	public $onhand;
	public $minlevel;
	public $maxlevel;
	public $reorderqty;
	public $avecost;

	
}


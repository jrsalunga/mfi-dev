<?php	
date_default_timezone_set('Asia/Manila');

/** set file compression **/
//if(!ob_start("ob_gzhandler")) ob_start();

/** set environment(OS) directory separator **/
defined('DS') ? null : define('DS', DIRECTORY_SEPARATOR);

/** Set the root app directory **/
defined('ROOT') ? null : define('ROOT', dirname(dirname(__FILE__)));
defined('TEMPLATE_PATH') ? null : define('TEMPLATE_PATH',ROOT.DS.'templates');

defined('DEVELOPMENT_ENVIRONMENT') ? null : define('DEVELOPMENT_ENVIRONMENT', true);
defined('SERVER_LIVE') ? null : define('SERVER_LIVE', true);


/** Check if environment is development and display errors **/
function setReporting() {
	if (DEVELOPMENT_ENVIRONMENT == true) {
		error_reporting(E_ALL);
		ini_set('display_errors','On');
	} else {
		error_reporting(E_ALL);
		ini_set('display_errors','Off');
		ini_set('log_errors', 'On');
		ini_set('error_log', ROOT.'logs'.DS.'error.log');
	}
}



/*
function __autoload($className) {
	if (file_exists(ROOT . DS . 'classes'. DS . 'model' . DS . strtolower($className) . '.class.php')) {
		require_once(ROOT . DS . 'library' . DS . strtolower($className) . '.class.php');
	} else if (file_exists(ROOT . DS . 'application' . DS . 'controllers' . DS . strtolower($className) . '.php')) {
		require_once(ROOT . DS . 'application' . DS . 'controllers' . DS . strtolower($className) . '.php');
	} else if (file_exists(ROOT . DS . 'application' . DS . 'models' . DS . strtolower($className) . '.php')) {
		require_once(ROOT . DS . 'application' . DS . 'models' . DS . strtolower($className) . '.php');
	} else {
		# Error Generation Code Here 
	}
}
*/


setReporting();


require_once(ROOT.DS.'classes'.DS.'session.php');
require_once(ROOT.DS.'classes'.DS.'database.php');
require_once(ROOT.DS.'classes'.DS.'database_object.php');
require_once(ROOT.DS.'classes'.DS.'functions.php');

require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.user.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.matcat.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.itemcat.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.material.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.item.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.bank.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.supplier.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.apvhdr.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.apvdtl.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.ledger.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.apledger.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.apvledger.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.cvhdr.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.cvapvdtl.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.cvchkdtl.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.account.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.acctcat.php');

require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.view.material.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.view.item.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.view.apvhdr.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.view.cvhdr.php');
require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.view.account.php');

require_once(ROOT.DS.'classes'.DS.'model'.DS.'class.v.supplier.php');






#require_once(ROOT.DS.'classes'.DS.'class.cleanurl.php');
























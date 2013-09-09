<?php

function strip_zeros_from_date( $marked_string="" ) {
  // first remove the marked zeros
  $no_zeros = str_replace('*0', '', $marked_string);
  // then remove any remaining marks
  $cleaned_string = str_replace('*', '', $no_zeros);
  return $cleaned_string;
}

function redirect_to( $location = NULL ) {
  if ($location != NULL) {
    header("Location: {$location}");
    exit;
  }
}

function output_message($message="") {
  if (!empty($message)) { 
    return "<p class=\"message\">{$message}</p>";
  } else {
    return "";
  }
}

//function __autoload($class_name) {
//	$class_name = strtolower($class_name);
//  $path = CLASS_LIB.DS."{$class_name}.php";
//  if(file_exists($path)) {
//    require_once($path);
//  } else {
//		die("The file {$class_name}.php could not be found.");
//	}
//}

function include_template($template="") {
	include_once(TEMPLATE_PATH.DS.$template);
}

function log_action($action, $message="") {
	$logfile = ROOT.DS.'logs'.DS.'log.txt';
	$new = file_exists($logfile) ? false : true;
  if($handle = fopen($logfile, 'a')) { // append
    $timestamp = strftime("%Y-%m-%d %H:%M:%S", time());
	#$timestamp = strftime("%Y-%m-%d %H:%M:%S", time()+(28800));
	$ip = $_SERVER['REMOTE_ADDR'];
	$brw = $_SERVER['HTTP_USER_AGENT'];
		$content = "{$timestamp} | {$ip} | {$action}: {$message} \t\t\t {$brw}\n";
    fwrite($handle, $content);
    fclose($handle);
    if($new) { chmod($logfile, 0755); }
  } else {
    echo "Could not open log file for writing.";
  }
}

function datetime_to_text($datetime="") {
  $unixdatetime = strtotime($datetime);
  return strftime("%B %d, %Y at %I:%M %p", $unixdatetime);
}

function iso_date($date="now") {
	$unixdatetime = strtotime($date);
	return strftime("%Y-%m-%d", $unixdatetime);	
}

function long_date($date="now") {
	$unixdatetime = strtotime($date);
	return strftime("%A, %B %d, %Y", $unixdatetime);	
}

function short_date($date="now") {
	$unixdatetime = strtotime($date);
	return strftime("%m/%d/%Y", $unixdatetime);	
}






function uc_first_word($string) {
    $s = explode(' ', $string);
    $s[0] = ucwords(strtolower($s[0]));
    $s = implode(' ', $s);
    return $s;
}


function uc_first($string) {
    $s = ucwords(strtolower($string));
    return $s;
}



function is_uuid($uuid=0) {
	return preg_match('/^[A-Fa-f0-9]{32}+$/',$uuid) ? $uuid : false;
}

function id_isset($val) {
	return (isset($val) && !empty($val) && is_uuid($val)) ? $val : false;	
}


function uuid_isset($val) {
	return (isset($val) && !empty($val) && is_uuid($val)) ? $val : false;	
}


?>
<?php

class CleanURL {

	var $basename;
	var $parts;
	var $slashes;

	function parseURL() {
		 /* grab URL query string and script name */
		$uri = $_SERVER['REQUEST_URI'];
		$script = $_SERVER['SCRIPT_NAME'];
		/* get extension */
		$x = explode(".",$script);
		$ext = end($x);

		/* if extension is found in URL, eliminate it */
		if(strstr($uri,".")) {
			$arr_uri = explode('.', $uri);
			/* get last part */
			$last = end($arr_uri);

			if($last == $ext){
				array_pop($arr_uri);
				$uri = implode('.', $arr_uri);
			}
		}

		/* pick the name without extension */
		$basename = basename ($script, '.'.$ext);
		/* slicing query string */
		$temp  = explode('/',$uri);
		$key   = array_search($basename,$temp);
		$parts = array_slice ($temp, $key+1);
		$this->basename = $basename;
		$this->parts = $parts;

	}

	function setRelative($relativevar) {
		/* count the number of slash
		   to define relative path */
		$numslash = count($this->parts);
		$slashes="";
		for($i=0;$i<$numslash;$i++){
			$slashes .= "../";
		}
		$this->slashes = $slashes;
		/* make relative path variable available for webpage */
		eval("\$GLOBALS['$relativevar'] = '$slashes';");

	}

	function getParts() {
		/* return array of sliced query string */
		return $this->parts;
	}

	function setParts() {
		/* pair off query string variable and query string value */
		$numargs = func_num_args();
		$arg_list = func_get_args();
		$urlparts = $this->getParts();
		for ($i = 0; $i < $numargs; $i++) {
			/* make them available for webpage */
			eval ("\$GLOBALS['".$arg_list[$i] ."']= '$urlparts[$i]';");
		}

   }

   function makeClean($stringurl) {
		/* convert normal URL query string to clean URL */
		$url=parse_url($stringurl);
		$strurl = basename($url['path'],".php");
		$qstring = parse_str($url['query'],$vars);
		while(list($k,$v) = each($vars)) $strurl .= "/".$v;
		return $strurl;

   }
}

$cleanUrl = new CleanURL;
$cleanUrl->parseURL();
$cleanUrl->setRelative('relativeslash'); //relativeslash is variable name 	


?>
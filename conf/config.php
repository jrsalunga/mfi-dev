<?php

// Database Constants



if(SERVER_LIVE) {
	/*
	defined('DB_SERVER') ? null : define("DB_SERVER", "localhost");
	defined('DB_USER')   ? null : define("DB_USER", "root");
	defined('DB_PASS')   ? null : define("DB_PASS", "p@55w0rd");
	defined('DB_NAME')   ? null : define("DB_NAME", "mfi-prod");
	*/
	
	defined('DB_SERVER') ? null : define("DB_SERVER", "192.168.0.5:1686");
	defined('DB_USER')   ? null : define("DB_USER", "server-admin");
	defined('DB_PASS')   ? null : define("DB_PASS", "p@55w0rd");
	defined('DB_NAME')   ? null : define("DB_NAME", "mfi");
} else {
	defined('DB_SERVER') ? null : define("DB_SERVER", "localhost");
	defined('DB_USER')   ? null : define("DB_USER", "root");
	defined('DB_PASS')   ? null : define("DB_PASS", "p@55w0rd");
	defined('DB_NAME')   ? null : define("DB_NAME", "mfi");
}
?>
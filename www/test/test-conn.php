<?php
include_once('../../lib/initialize.php');

$matcat = new Matcat;

$matcat->code = '001';
$matcat->descriptor = 'this is a test';
$matcat->save();

//echo var_export($matcat);


?>
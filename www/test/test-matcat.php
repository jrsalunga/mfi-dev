<?php
include_once('../../lib/initialize.php');

$matcat = vItem::find_all();

echo json_encode($matcat);

/*
$matcat->code = '002';
$matcat->descriptor = 'this is a test 2';
$matcat->type = 2;
$matcat->matcatid = '00b5ac081b7c11e38ddbc0188508f93c';
$matcat->save();
*/
//echo var_export($matcat);


?>
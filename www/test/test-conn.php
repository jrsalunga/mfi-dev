<?php
include_once('../../lib/initialize.php');

#$apvhdr = Apvhdr::getLastNumber();


#echo var_export($apvhdr);

$refno = 1;
echo str_pad($refno, 10, "0", STR_PAD_LEFT);

?>
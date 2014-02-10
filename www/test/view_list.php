<?php


$vItem = "SELECT a.code, a.descriptor, b.descriptor as itemcat, a.itemcatid, a.id
FROM item a LEFT JOIN itemcat b
ON a.itemcatid = b.id";

$vMaterial = "SELECT a.code, a.descriptor, a.typeid, c.descriptor as type, a.matcatid, b.descriptor as matcat, a.uom, a.longdesc, a.onhand, a.minlevel, a.maxlevel, a.reorderqty, a.avecost, a.id
FROM material a, matcat b, material_type c
WHERE a.matcatid = b.id AND a.typeid = c.code";

$vApvhdr = "SELECT a.refno, a.date,
DATE_ADD(a.date, INTERVAL a.terms DAY) AS due,
b.descriptor as supplier, a.supplierid, a.supprefno, a.porefno, a.terms, a.totamount, a.balance, a.notes, a.posted, a.cancelled, a.printctr, a.totline, a.id
FROM apvhdr a
LEFT JOIN supplier b
ON a.supplierid = b.id";

$vCvhdr = "SELECT a.refno, a.date, b.descriptor as supplier, a.payee, a.totapvamt, a.totchkamt, a.posted, a.supplierid, a.notes, a.cancelled, a.totapvline, a.totchkline, a.id
FROM cvhdr a
LEFT JOIN supplier b
ON a.supplierid = b.id";


$vAccount = "SELECT a.code, a.descriptor, a.acctcatid, b.descriptor as acctcat, a.type, a.id
FROM account a LEFT JOIN acctcat b
ON a.acctcatid = b.id"


?>
<?php
include_once('../../Slim/Slim.php');
include_once('../../lib/initialize.php');

\Slim\Slim::registerAutoloader();

$app = new \Slim\Slim();



$authenticateForRole = function ( $role = 'member' ) {
    return function () use ( $role ) {
        //$user = User::fetchFromDatabaseSomehow();
        //if ( $user->belongsToRole($role) === false ) {
        $user = false;
        if ( $user === false ) {
            $app = \Slim\Slim::getInstance();
            $app->flash('error', 'Login required');
            $app->redirect('/login');
        }
    };
};


$app->get('/foo', $authenticateForRole('admin'), function () {
    //Display admin control panel
});

 
$app->get('/hello/:name', function ($name) use ($database) {

    $category = new Category();
    $category->code = '123';
    $category->save();

    if($database) {
        echo "Hello dfsas, $name " . $database->last_query;
    } else {
        echo "hi, $name " . $database->last_query;
    }
});


$app->get('/hi/:name', 'hi');

function hi($name) {

    /*
    $database = MySQLDatabase::getInstance();

    $category = new Category();
    $category->code = '123';
    $category->save();

    if(isset($database)) {
        echo "Hello dfsas, $name " . $database->last_uid;
    } else {
        echo "hi, $name " . $database->last_query;
    }
    */

    echo $name;
}



$app->post('/AuthUserLogin',  'authUserLogin');





// return a view of table data
$app->get('/t/:table', 'getTables');
$app->get('/t/:table/:id',  'getTable');
$app->post('/t/:table', 'addTable');
$app->put('/t/:table/:id',  'updateTable');
$app->delete('/t/:table/:id',  'deleteTable');


//return true table data
$app->get('/s/:table', 'getRealTables');
$app->get('/s/:table/:id',  'getRealTable');
$app->post('/s/:table', 'addRealTable');
$app->put('/s/:table/:id',  'updateRealTable');
$app->delete('/s/:table/:id',  'deleteRealTable');




$app->get('/datatables/:table',  'datatables');
$app->get('/datatables/v/:table',  'datatables2');

$app->get('/search/:table', 'searchTable');

$app->post('/detail/:table', 'getDetail'); // get the item to put in html table
$app->post('/post/detail/:table', 'postDetail');
$app->put('/post/detail/:table/:table2/:apvhdrid', 'putDetpostDetailail');


// posting
$app->post('/txn/post/apvhdr/:id', 'postingApvhdr');
$app->post('/txn/post/apvhdr/:id/cancelled', 'postingCancelledApvhdr');


 /*****************************  Run App **************************/
$app->run();


function getTables($table) {

    $sTable = ucfirst($table);
    
    $oTable = $sTable::find_all();

    if($oTable){
        echo json_encode($oTable);
    } else {
        $respone = array(
                "status" => "error",
                "message" => "Record(s) not found!"
        );
        echo json_encode($respone);
    }
}


function getTable($table, $id) {

    $sTable = ucfirst($table);
    
    $oTable = $sTable::find_by_id($id);

    if($oTable){
        echo json_encode($oTable);
    } else {
        $respone = array(
                "status" => "error",
                "message" => "Record not found!"
        );
        echo json_encode($respone);
    }
    
}

function addTable($table) {

    $app = \Slim\Slim::getInstance();
    $sTable = ucfirst($table);

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $oTable = new $sTable();

    foreach ($get as $key => $value) {

        if($key=="id") {
            if(isset($value) &&  $value != NULL) {
                $oTable->$key = $value;
            }
        } else {
            $oTable->$key = $value;
        }
    }   

    $success = false;
    $success = $oTable->save();

    if($success) {

        $vTable = substr_replace($sTable, 'v', 0, 0);
        $ovTable = $vTable::find_by_id($oTable->id);
     
        echo json_encode($ovTable);    

    } else {
       echo '{"error":" error on saving '.mysql_error().'"}';
    }

    /*
    *  add record to a table but response with view table
    */
    
}

function updateTable($table, $id) {

    $app = \Slim\Slim::getInstance();
    $sTable = ucfirst($table);

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $oTable = new $sTable();

    foreach ($get as $key => $value) {

        /*
        if($key=="id") {
            if(isset($value) &&  $value != NULL) {
                $oTable->$key = $value;
            }
        } else {

        */
            $oTable->$key = $value;
        #}
    }   

    #$oTable->id = $id;


    $success = false;
    $success = $oTable->save();
       

    if($success) {
    
        $vTable = substr_replace($sTable, 'v', 0, 0);
        $ovTable = $vTable::find_by_id($id);

        echo json_encode($ovTable);    

    } else {

        if(mysql_error()){
            echo '{"error":" error on saving. '.mysql_error().'"}';
        } else {
            echo '{"error":" error on saving. No changes have been made" }';   
        }
        
        #echo json_encode($success); 
    }    

}

function deleteTable($table, $id) {
   
    $sTable = ucfirst($table);
    
    $oTable = new $sTable();

    $oTable->id = $id;   
    if($oTable->delete()) {
        echo '{"id":"'.$id.'"}';
    } else {

        $respone = array(
            'status' => 'error', 
            'code' => '404',
            'message' => 'error on deleting'
        );
  
        echo json_encode($respone); 

        //echo '{"error":"cannot delete data"}';
    }    
}


/**
* Real table
*/

function getRealTables($table) {

    $sTable = ucfirst($table);
    
    $oTable = $sTable::find_all();

    if($oTable){
        echo json_encode($oTable);
    } else {
        $respone = array(
                "status" => "error",
                "message" => "Record(s) not found!"
        );
        echo json_encode($respone);
    }
}


function getRealTable($table, $id) {

    $sTable = ucfirst($table);
    
    $oTable = $sTable::find_by_id($id);

    if($oTable){
        echo json_encode($oTable);
    } else {
        $respone = array(
                "status" => "error",
                "message" => "Record not found!"
        );
        echo json_encode($respone);
    }
    
}



function addRealTable($table) {

    $app = \Slim\Slim::getInstance();
    $sTable = ucfirst($table);

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $oTable = new $sTable();

    foreach ($get as $key => $value) {

        if($key=="id") {
            if(isset($value) &&  $value != NULL) {
                $oTable->$key = $value;
            }
        } else {
            $oTable->$key = $value;
        }
    }   

    $success = false;
    $success = $oTable->save();

    if($success) {
     
        echo json_encode($oTable);    

    } else {
       echo '{"error":" error on saving '.mysql_error().'"}';
    }
    
}

function updateRealTable($table, $id) {

    $app = \Slim\Slim::getInstance();
    $sTable = ucfirst($table);

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $oTable = new $sTable();

    foreach ($get as $key => $value) {

        /*
        if($key=="id") {
            if(isset($value) &&  $value != NULL) {
                $oTable->$key = $value;
            }
        } else {

        */
            $oTable->$key = $value;
        #}
    }   

    #$oTable->id = $id;


    $success = false;
    $success = $oTable->save();
       

    if($success) {
    

        echo json_encode($oTable);    

    } else {
        if(mysql_error()){
            echo '{"error":" error on saving '.mysql_error().'"}';
        #echo json_encode($success); 
        } else {
            echo '{"warning":" Nothing to update"}';
            #echo json_encode($success); 
        }
        
    }    

}

function deleteRealTable($table, $id) {
   
    $sTable = ucfirst($table);
    
    $oTable = new $sTable();

    $oTable->id = $id;   
    if($oTable->delete()) {
        echo '{"id":"'.$id.'"}';
    } else {

        $respone = array(
            'status' => 'error', 
            'code' => '404',
            'message' => 'error on deleting'
        );
  
        echo json_encode($respone); 

        //echo '{"error":"cannot delete data"}';
    }    
}






/**
* Category table
*/
function getCategories() {

    $app = \Slim\Slim::getInstance();
    $app->response()->header("Content-Type", "application/json");
    
    $category = Category::find_all();
    echo json_encode($category);
}

 
function getCategory($id) {
    $category = Category::find_by_id($id);
     unset($category->type_name);
    echo json_encode($category);
}

function saveCategory($id) {

    $app = \Slim\Slim::getInstance();
    $database = MySQLDatabase::getInstance();

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $category = new Category();
    $category->code       = $get['code'];
    $category->descriptor = $get['descriptor'];
    $category->type       = $get['type'];
    if(isset($id) && $id != NULL) {
        $category->id = $id;
    }
    $category->save();
    $category->type_name = $category->get_type_name(); 
    unset($category->type);
    
    echo json_encode($category);
}

function addCategory() {

    $app = \Slim\Slim::getInstance();
    //$database = MySQLDatabase::getInstance();

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $category = new Category();
    $category->code       = $get['code'];
    $category->descriptor = $get['descriptor'];
    $category->type       = $get['type'];
    if(isset($get['id']) && $get['id'] != NULL) {
        $category->id = $get['id'];
    }

    $success = false;
    $success = $category->save();
    $category->type_name = $category->get_type_name(); 
    unset($category->type);

    if($success) {
        echo json_encode($category);    
    } else {
       echo '{"error":" error on saving '.mysql_error().'"}';
    }
    
}


function deleteCategory($id) {
    //echo '{"respone":"success","id":"'.$id.'"}';
    $category = new Category();
    $category->id = $id;   
    if($category->delete()) {
        echo '{"id":"'.$id.'"}';
    } else {
        echo '{"error":1}';
    }    
}





/**
* Item table
*/

function addItem() {

    $app = \Slim\Slim::getInstance();
    //$database = MySQLDatabase::getInstance();

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    $item = new Item();
    $item->code       = $get['code'];
    $item->descriptor = $get['descriptor'];
    $item->type       = $get['type'];
    $item->categoryid = $get['categoryid'];
    $item->umeasure   = $get['umeasure'];
    $item->longdesc   = $get['longdesc'];
    $item->picfile    = $get['picfile'];
    $item->onhand     = $get['onhand'];
    $item->unitprice  = $get['unitprice'];
    $item->floorprice = $get['floorprice'];
    $item->unitcost   = $get['unitcost'];
    if(isset($get['id']) && $get['id'] != NULL) {
        $item->id = $get['id'];
    }

    $success = false;
    $success = $item->save();
    //$category->type_name = $category->get_type_name(); 
    //unset($category->type);

    if($success) {
        echo json_encode($item);    
    } else {
       echo '{"error":" error on saving '.mysql_error().'"}';
    }
    
}




















/**
* Datatables API
*/


function datatables($table) {
    
    $database = new MySQLDatabase();
    $app = \Slim\Slim::getInstance();

    $sql = "DESCRIBE ". $table;
    $rows = $database->query($sql);

    $aColumns = array();

    while($row = $database->fetch_row($rows)) {
        $aColumns[] = $row[0];
    }

    #print_r($aColumns);

   // $key = array_search('id',  $aColumns); 
    #echo "<br>".$key."<br>";  

    //unset($aColumns[$key]);

    #print_r($aColumns);

    $request = $app->request();

    $iDisplayStart = $database->escape_value($request->get('iDisplayStart'));
    $iDisplayLength = $database->escape_value($request->get('iDisplayLength'));

    $sLimit = "";
    if(isset($iDisplayStart) && $iDisplayLength != '-1' ) {
        $sLimit = "LIMIT ".  $iDisplayStart .", ". $iDisplayLength;
    }
    #echo $sLimit;


    $iSortCol_0 =  $database->escape_value($request->get('iSortCol_0'));
    $iSortingCols =  $database->escape_value($request->get('iSortingCols'));
    
    $sOrder = "";
    if (isset($iSortCol_0)) {
        $sOrder = "ORDER BY  ";

        #echo  $iSortCol_0."<br>";
        #echo   $iSortingCols."<br>";

        for ( $i=0 ; $i<intval($iSortingCols) ; $i++ ) {        

            $iSortingCol =  $database->escape_value($request->get('iSortCol_'.$i));
            $bSortable =  $database->escape_value($request->get('bSortable_'.intval($iSortingCol) ));

            #echo $iSortingCol."<br>";
            #echo  $bSortable."<br>";
            
            if ($bSortable == "true") {

                $iSortingCols =  $database->escape_value($request->get('sSortDir_'.$i));
                $sOrder .= "`".$aColumns[intval($iSortingCol)] ."` ". $iSortingCols .", ";

                #echo  $aColumns[intval($iSortingCol)]."<br>";
                #echo   $sOrder."<br>";
            }
            
        }
        
        $sOrder = substr_replace( $sOrder, "", -2 );
        if ( $sOrder == "ORDER BY" ) {
            $sOrder = "";
        }
    }
    //echo $sOrder;


    $sSearch = $database->escape_value($request->get('sSearch'));

    $sWhere = "";
    if ( isset($sSearch) && $sSearch != "" )
    {
        $sWhere = "WHERE (";
        for ( $i=0 ; $i<count($aColumns) ; $i++ )
        {
            $sWhere .= "`".$aColumns[$i]."` LIKE '%". $sSearch."%' OR ";
        }
        $sWhere = substr_replace( $sWhere, "", -3 );
        $sWhere .= ')';
    }
    #echo $sWhere."<br>";
    
    /* Individual column filtering */
    for ( $i=0 ; $i<count($aColumns) ; $i++ )
    {
        $bSearchable = $database->escape_value($request->get('bSearchable_'.$i));
        $sSearch = $database->escape_value($request->get('sSearch_'.$i));

        if ( isset($bSearchable) && $bSearchable == "true" && $sSearch != '' )
        {
            if ( $sWhere == "" ) {
                $sWhere = "WHERE ";
            } else {
                $sWhere .= " AND ";
            }
            $sWhere .= "`".$aColumns[$i]."` LIKE '%". $sSearch ."%' ";
        }
    }

    #echo $sWhere."<br>";

    $fsQuery = "SELECT SQL_CALC_FOUND_ROWS `".str_replace(" , ", " ", implode("`, `", $aColumns))."` FROM ". $table 
             ." $sWhere $sOrder $sLimit";

    //echo $sQuery;
    //$rResult =  $database->query($sQuery);
    $cTable = ucfirst($table);

    $oTable = $cTable::find_by_sql($fsQuery);

    $sQuery = "SELECT FOUND_ROWS()";
    $result = $database->query($sQuery);
    $row =  $database->fetch_row($result);
    $iFilteredTotal = intval($row[0]);

    $sQuery = "SELECT COUNT(`id`) FROM ". $table;
    $result = $database->query($sQuery);
    $row =  $database->fetch_row($result);
    $iTotal = intval($row[0]);

    #echo $iTotal;

    $sEcho = $database->escape_value($request->get('sEcho'));

    $output = array(
        "sql" => $fsQuery,
        "sEcho" => intval($sEcho),
        "iTotalRecords" => $iTotal,
        "iTotalDisplayRecords" => $iFilteredTotal,
        "aaData" => $oTable
    );
    
   
    #$output['aaData'][] = $categorys;


        
    
    
    echo json_encode( $output );

    




}




function datatables2($cTable) {
    
    $database = new MySQLDatabase();
    $app = \Slim\Slim::getInstance();

    $table = substr_replace($cTable, 'v', 0, 0);


    $sql = "DESCRIBE ". $table;
    #echo $sql ."<br>";
    $rows = $database->query($sql);

    $aColumns = array();

    while($row = $database->fetch_row($rows)) {
        $aColumns[] = $row[0];
    }

    #print_r($aColumns);

   // $key = array_search('id',  $aColumns); 
    #echo "<br>".$key."<br>";  

    //unset($aColumns[$key]);

    #print_r($aColumns);

    $request = $app->request();

    $iDisplayStart = $database->escape_value($request->get('iDisplayStart'));
    $iDisplayLength = $database->escape_value($request->get('iDisplayLength'));

    $sLimit = "";
    if(isset($iDisplayStart) && $iDisplayLength != '-1' ) {
        $sLimit = "LIMIT ".  $iDisplayStart .", ". $iDisplayLength;
    }
    #echo $sLimit;


    $iSortCol_0 =  $database->escape_value($request->get('iSortCol_0'));
    $iSortingCols =  $database->escape_value($request->get('iSortingCols'));
    
    $sOrder = "";
    if (isset($iSortCol_0)) {
        $sOrder = "ORDER BY  ";

        #echo  $iSortCol_0."<br>";
        #echo   $iSortingCols."<br>";

        for ( $i=0 ; $i<intval($iSortingCols) ; $i++ ) {        

            $iSortingCol =  $database->escape_value($request->get('iSortCol_'.$i));
            $bSortable =  $database->escape_value($request->get('bSortable_'.intval($iSortingCol) ));

            #echo $iSortingCol."<br>";
            #echo  $bSortable."<br>";
            
            if ($bSortable == "true") {

                $iSortingCols =  $database->escape_value($request->get('sSortDir_'.$i));
                $sOrder .= "`".$aColumns[intval($iSortingCol)] ."` ". $iSortingCols .", ";
                #$sOrder .= "`".$aColumns[intval($iSortingCol)+1] ."` ". $iSortingCols .", ";

                #echo  $aColumns[intval($iSortingCol)]."<br>";
                #echo   $sOrder."<br>";
            }
            
        }
        
        $sOrder = substr_replace( $sOrder, "", -2 );
        if ( $sOrder == "ORDER BY" ) {
            $sOrder = "";
        }
    }
    #echo $sOrder;


    $sSearch = $database->escape_value($request->get('sSearch'));

    $sWhere = "";
    if ( isset($sSearch) && $sSearch != "" )
    {
        $sWhere = "WHERE (";
        for ( $i=0 ; $i<count($aColumns) ; $i++ )
        {
            $sWhere .= "`".$aColumns[$i]."` LIKE '%". $sSearch."%' OR ";
        }
        $sWhere = substr_replace( $sWhere, "", -3 );
        $sWhere .= ')';
    }
    #echo $sWhere."<br>";
    
    /* Individual column filtering */
    for ( $i=0 ; $i<count($aColumns) ; $i++ )
    {
        $bSearchable = $database->escape_value($request->get('bSearchable_'.$i));
        $sSearch = $database->escape_value($request->get('sSearch_'.$i));

        if ( isset($bSearchable) && $bSearchable == "true" && $sSearch != '' )
        {
            if ( $sWhere == "" ) {
                $sWhere = "WHERE ";
            } else {
                $sWhere .= " AND ";
            }
            $sWhere .= "`".$aColumns[$i]."` LIKE '%". $sSearch ."%' ";
        }
    }

    #echo $sWhere."<br>";
    #$vTable = substr_replace($table, 'v', 0, 0);

    $fsQuery = "SELECT SQL_CALC_FOUND_ROWS `".str_replace(" , ", " ", implode("`, `", $aColumns))."` FROM ". $table 
             ." $sWhere $sOrder $sLimit";

    //echo $sQuery;
    //$rResult =  $database->query($sQuery);
    $cTable = ucfirst($table);

    

    $oTable = $cTable::find_by_sql($fsQuery);

    $sQuery = "SELECT FOUND_ROWS()";
    $result = $database->query($sQuery);
    $row =  $database->fetch_row($result);
    $iFilteredTotal = intval($row[0]);

    $sQuery = "SELECT COUNT(`id`) FROM ". $table;
    $result = $database->query($sQuery);
    $row =  $database->fetch_row($result);
    $iTotal = intval($row[0]);

    #echo $iTotal;

    $sEcho = $database->escape_value($request->get('sEcho'));

    $output = array(
        "sql" => $fsQuery,
        "sEcho" => intval($sEcho),
        "iTotalRecords" => $iTotal,
        "iTotalDisplayRecords" => $iFilteredTotal,
        "aaData" => $oTable
    );
    
   
    #$output['aaData'][] = $categorys;


        
    
    
    echo json_encode( $output );

    
}



function searchTable($table) {

    $app = \Slim\Slim::getInstance();
    $database = MySQLDatabase::getInstance();

    $request = $app->request();

    $q = $database->escape_value($request->get('q'));
    $maxRows = $database->escape_value($request->get('maxRows'));
    $maxRows = isset($maxRows) ? $maxRows : 25;

    $sql = "SELECT * FROM ". $table ." WHERE ( `code` LIKE '%". $q ."%' OR 
                                                `descriptor` LIKE '%". $q ."%' 
                                        ) ORDER BY code asc LIMIT 0, ". $maxRows; 

    $sTable = ucfirst($table);
    
    $oTable = $sTable::find_by_sql($sql);


    echo json_encode( $oTable );

}



function getDetail($table) {

    $app = \Slim\Slim::getInstance();
    $sTable = ucfirst($table);

    $request = $app->request()->getBody();
    $get = json_decode($request, true);

    //$vTable = substr_replace($sTable, 'v', 0, 0);
    //$ovTable = new $vTable;

    
   /* foreach ($get as $key => $value) {

        if((substr_compare($key, "id", -2, 2)==0) && (substr($key,-2)=='id')) {
            $x = explode('id', $key); // itemid, becomes item
            $class_name = ucfirst($x[0]); // Item
            $object =  $class_name::find_by_id($value);
            $ovTable->$x[0] = $object->code;
        } else if($value==NULL || $value=="null" || is_null($value)) { 
            $ovTable->$key = "";
        } else {
            $ovTable->$key = $value;
        }
    } 
    
    echo json_encode($ovTable);   */


    $obj = (object) array();

    foreach ($get as $key => $value) {

        //if((substr_compare($key, "id", -2, 2)==0) && (substr($key,-2)=='id')) {
        if($key=='itemid') {
            
            $obj->$key = $value;
            $x = explode('id', $key); // itemid, becomes item
            $class_name = ucfirst($x[0]); // Item
            $object =  $class_name::find_by_id($value);
            $obj->$x[0] = $object->code;
           
        } else if($value==NULL || $value=="null" || is_null($value)) { 
            $obj->$key = "";
        } else {
            $obj->$key = $value;
        }
    } 


    echo json_encode($obj);   

    
    /*
    if($success) {

        $vTable = substr_replace($sTable, 'v', 0, 0);
        $ovTable = $vTable::find_by_id($oTable->id);
     
        echo json_encode($ovTable);    

    } else {
       echo '{"error":" error on saving '.mysql_error().'"}';
    }
    


    $output = array(
        "status" => "ok",
        "item" => "ok"

        );

    /*
    *  add record to a table but response with view table
    */
}






function authUserLogin() {

    $app = \Slim\Slim::getInstance();
    $session = Session::getInstance();
    $database = MySQLDatabase::getInstance();
   
    /*
    $request = $app->request();
    $usr = $database->escape_value($request->post('username'));
    $pwd = $database->escape_value($request->post('password'));
    */

    $request = $app->request()->getBody();
    $post = json_decode($request, true);
    $usr = $database->escape_value($post['username']);
    $pwd = $database->escape_value($post['password']);

    /*
    class User {
        public $username;
        public $password;
        public $personid;


        public function auth($u,$p){

            $this->username = 'admin';
            $this->$password = 'password';
            $this->$personid = '001';

            
                return $this;
           
        }
    }
    */

    #$found_user = User::auth($usr,$pwd);

    #if($found_user) {
    if($usr == 'admin' && $pwd =='password') {

        $_SESSION['cid'] = '001';
        $session->set_fullname('Juan dela Cruz');
    
        $respone = array(
            'status' => 'ok', 
            'code' => '200'
        );
    } else {

         $respone = array(
            'status' => 'error', 
            'code' => '404'
        );
    }   
    
    echo json_encode($respone);
}





function postDetail($table) {

    $app = \Slim\Slim::getInstance();
    $sTable = ucfirst($table);

    $request = $app->request()->getBody();
    $detail = json_decode($request, true);


    foreach($detail as $get) {

        $oTable = new $sTable();

        foreach ($get as $key => $value) {
            $oTable->$key = $value;
        }   

        $success = $oTable->create();
    }

    if($success){
        $respone = array(
            'status' => 'ok', 
            'code' => '200',
            'message' => 'success saving child data!'
        );
    } else {
        $respone = array(
            'status' => 'error', 
            'code' => '404',
            'message' => 'unable to save child data!'
        );
    }
    echo json_encode($respone);     
}





function putDetail($table,$table2,$apvhdrid) {

    $app = \Slim\Slim::getInstance();
    $database = MySQLDatabase::getInstance();
    $sTable = ucfirst($table); // apvdtl
    $sTable2 = ucfirst($table2); // apvhdr

    $request = $app->request()->getBody();
    $detail = json_decode($request, true);


    //check 1st if there is an existing table2 (parent table)
    //2nd if there is a record with that id
    $parent = $sTable2::find_by_id($apvhdrid);

    if(isset($parent) && $parent!=false) {
        $sTable::delete_all_by_field_id($table2,$apvhdrid); 
        
        foreach($detail as $get) {

            $oTable = new $sTable();

            foreach ($get as $key => $value) {
                $oTable->$key = $value;
            }   

        
            $success = $oTable->create();
        }


        $respone = array(
            'status' => 'ok', 
            'code' => '200',
            'message' => 'detail saved'
        );

    } else {
        $respone = array(
            'status' => 'error', 
            'code' => '404',
            'message' => 'the is no '. $table2 .'table found'
        );
    }
    echo json_encode($respone);    
}




/*****************************  Transactions **************************/


function postingApvhdr($id){

    $app = \Slim\Slim::getInstance();
    //$database = MySQLDatabase::getInstance();
    global $database;

    $database->startTransaction();

    $apvhdr = Apvhdr::find_by_id($id);


    if(!$apvhdr->posted || $apvhdr->posted==0) {

        $apvhdr_last = new Apvhdr();
        $apvhdr_last->posted = 1;
        $apvhdr_last->balance = $apvhdr->totamount - $apvhdr->totdebit + $apvhdr->totcredit;
        $apvhdr_last->id = $id;

        //$apvhdr_last->lock_record();
        
        if(!$apvhdr_last->save()){
            
            $database->rollback();
            echo json_encode($apvhdr_last->result_respone(1,'1136'));
            exit();
        }

        
        $last_apledger = Apledger::get_last_record($apvhdr->supplierid);
        $last_apledger_currbal = isset($last_apledger->currbal) ? $last_apledger->currbal:0;

        
        $apledger = new Apledger();
        $apledger->supplierid   = $apvhdr->supplierid;
        $apledger->txndate      = $apvhdr->date;
        $apledger->txncode      = 'APV';
        $apledger->txnrefno     = $apvhdr->refno;
        $apledger->amount       = $apvhdr->totamount;
        $apledger->prevbal      = $last_apledger_currbal;
        $apledger->currbal      = $apledger->get_currbal();
        
        if(!$apledger->save()){
        
        /*        
        $apledger = Apledger2::post('APV', $apvhdr->refno, $apvhdr->date, $apvhdr->totamount, $last_apledger_currbal, $apvhdr->supplierid);
        if(!$apledger) { 
        */   


            $database->rollback();
            echo json_encode($apledger->result_respone(1,'1156'));
            exit();
        }
        
        


        $supplier = Supplier::find_by_id($apvhdr->supplierid);
       
        // $stu = supplier to be updated
        $stu = new Supplier();
        $stu->balance = $supplier->balance + $apledger->amount;
        $stu->id = $apvhdr->supplierid;
        
        if($stu->lock_record()) {

            if(!$stu->save()){
                
                /* commeted out
                *       * unable to update the supplier
                *       * no change on balace
                *       * no item or the total amount of apv is 0
                */

                /*
                $q = $database->last_query;
                
                $database->rollback(); 
                echo json_encode($stu->result_respone(1,' Unable to post. No items/details found.'. $q ));
                exit();
                */

            }
        } else {

            $database->rollback();
            echo json_encode($stu->result_respone(2)); 
            exit();
        }

        $arItem = array();

        $apvdtl_items = Apvdtl::find_all_by_field_id('apvhdr',$id);
        if(!isset($apvdtl_items)) {
            foreach ($apvdtl_items as $apv_items) {
                
                $item = Item::find_by_id($apv_items->itemid);  

                array_push($arItem, $item);
                
                if($item->is_product()){

                    // $itu = item to be updated
                    $itu = new Item();
                    $itu->onhand = $item->onhand + $apv_items->qty;
                    $itu->unitcost = $apv_items->unitcost;
                    $itu->id = $item->id;

                    if($itu->lock_record()) {

                        if(!$itu->save()){
                            
                            $database->rollback(); 
                            echo json_encode($itu->result_respone(1,'no item to save'. $item->id)); 
                            exit();
                        }
                    } else {

                        $database->rollback();
                        echo json_encode($itu->result_respone(2,'unable to lock item '. $itu->id));  
                        exit();
                    }


                    $last_stockcard = Stockcard::get_last_record($item->id);
                    $last_stockcard_currbal = isset($last_stockcard->currbal)  ? $last_stockcard->currbal:0;
                    //$last_stockcard->currbal = $item->onhand;

                    $stockcard = new Stockcard();
                    $stockcard->itemid      = $item->id;
                    $stockcard->locationid  = $apvhdr->locationid;
                    $stockcard->txndate     = $apvhdr->date;
                    $stockcard->txncode     = 'APV';
                    $stockcard->txnrefno    = $apvhdr->refno;
                    $stockcard->qty         = $apv_items->qty;
                    $stockcard->prevbal     = $last_stockcard_currbal;
                    $stockcard->currbal     = $stockcard->get_currbal();
                    //$stockcard->prevbalx    =;
                    //$stockcard->currbalx    =;

                    if($stockcard->lock_record()){

                        if(!$stockcard->save()){
                            
                            $database->rollback(); 
                            echo json_encode($stockcard->result_respone(1,'1240')); 
                            exit();
                        }
                    } else {
                         
                        $database->rollback();
                        echo json_encode($stockcard->result_respone(2)); 
                        exit();
                    }
                } // end is product
            } // end foreach item
        } else {
            // no items/details on this apv
            // just continue the transaction
        }

        
        //$database->rollback();
        if($database->commit()){
            
            $respone = array(
                'status' => 'success', 
                'code' => '200',
                'message' => 'success on posting',
                'data' => array(
                    'apvhdr' => $apvhdr_last,
                    'item' => $arItem
                )
            );
        } else {
            $database->rollback();

              $respone = array(
                'status' => 'error', 
                'code' => '404',
                'message' => 'error on commtting the transactions',
                'data' => array(
                    'apvhdr' => $apvhdr_last
                )
            );

        }
       

    } else {

        $database->rollback();
        $respone = array(
            'status' => 'error', 
            'code' => '404',
            'message' => 'apvhdr '. $id .' is already posted'
        );
    }

    
    echo json_encode($respone); 
    


    //$database->rollback();

   // echo json_encode($apledger);


}



function postingCancelledApvhdr($id){

    $app = \Slim\Slim::getInstance();
    //$database = MySQLDatabase::getInstance();
    global $database;

    $apvhdr = Apvhdr::find_by_id($id);

    $apvhdr_last = new Apvhdr();
    $apvhdr_last->posted = 1;
    $apvhdr_last->cancelled = 1;
    $apvhdr_last->id = $id;

    if($apvhdr_last->save()){
        
        $respone = array(
                'status' => 'success', 
                'code' => '200',
                'message' => 'success on posting cancelled APV',
                'data' => array(
                    'apvhdr' => $apvhdr_last,
                )
            );
    } else {
        
        $respone = array(
            'status' => 'error', 
            'code' => '404',
            'message' => 'error on posting cancelled APV'
        );
    }

    echo json_encode($respone); 
}

















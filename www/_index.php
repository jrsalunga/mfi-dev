<?php

$url = "https://accounts.google.com/o/oauth2/auth";
 
$params = array(
    "response_type" => "code",
    "client_id" => "635080262364.apps.googleusercontent.com",
    "redirect_uri" => "http://mfi.com/oauth2callback.php",
    "scope" => "https://www.googleapis.com/auth/plus.me"
    );
 
$request_to = $url . '?' . http_build_query($params);
 
header("Location: " . $request_to);


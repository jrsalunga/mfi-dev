<?php
require_once '../google-api-php-client/src/Google_Client.php';
require_once '../google-api-php-client/src/contrib/Google_PlusService.php';
require_once '../google-api-php-client/src/auth/Google_OAuth2.php';

// Set your cached access token. Remember to replace $_SESSION with a
// real database or memcached.

session_start();

$client = new Google_Client();
$client->setApplicationName('Google+ PHP Starter Application');
// Visit https://code.google.com/apis/console?api=plus to generate your
// client id, client secret, and to register your redirect uri.
$client->setClientId('635080262364.apps.googleusercontent.com');
$client->setClientSecret('-xbTcqsPdQm9-oz_7ibCGiuj');
$client->setRedirectUri('https://mfi.com/oauth2callback.php');
$client->setDeveloperKey('AIzaSyDxdrKiPCGMuE_3F44O7ue27qm7BbRWh-c');
$plus = new Google_PlusService($client);
$oauth = new Google_OAuth2($client);

if (isset($_GET['code'])) {
  $client->authenticate();
  $_SESSION['token'] = $client->getAccessToken();
  $redirect = 'http://' . $_SERVER['HTTP_HOST'] . $_SERVER['PHP_SELF'];
  header('Location: ' . filter_var($redirect, FILTER_SANITIZE_URL));
}

if (isset($_SESSION['token'])) {
  $client->setAccessToken($_SESSION['token']);
}

if ($client->getAccessToken()) {
  $activities = $plus->activities->listActivities('me', 'public');
  print 'Your Activities: <pre>' . print_r($plus, true) . '</pre>';

  // We're not done yet. Remember to update the cached access token.
  // Remember to replace $_SESSION with a real database or memcached.
  $_SESSION['token'] = $client->getAccessToken();
} else {
  $authUrl = $client->createAuthUrl();
  print "<a href='$authUrl'>Connect Me!</a>";
}
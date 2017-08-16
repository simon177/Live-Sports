<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE');
header('Access-Control-Allow-Headers: Content-Type');
$APIkey='&APIkey=c32aaea92184703ba4a44f7840af8b0880adb8ec9b17745074b00a508f8ef2ee';
$link = $_POST['link'];
$curl_options = array(
	CURLOPT_URL => $link . $APIkey,
	CURLOPT_RETURNTRANSFER => true,
	CURLOPT_HEADER => false,
	CURLOPT_TIMEOUT => 30,
	CURLOPT_CONNECTTIMEOUT => 5
);

$curl = curl_init();
curl_setopt_array( $curl, $curl_options );
$result = curl_exec( $curl );
$result = json_encode($result);

echo $result;

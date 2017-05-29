<?php
$APIkey='&APIkey=fe753bc888bb6a75490621597fc3f4f93184ef9a2ffb5cffab3be87813b7023f';
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

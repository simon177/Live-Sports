<?php
$APIkey='&APIkey=ea7243e9a3c3855eb59a39bf1aa91b3008ccb85d8db4d1c1515a9110edc82e50';
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

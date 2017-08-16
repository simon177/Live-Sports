<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET,PUT,POST,DELETE');
header('Access-Control-Allow-Headers: Content-Type');
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
 
$dataArray = array();
$newOddArray = array();
$newDataArray = array();
$dataArray = json_decode($result, TRUE);
 
 
foreach ($dataArray as &$value) {
    if (!in_array($value['odd_bookmakers'], $newOddArray)) {
        array_push($newOddArray, $value['odd_bookmakers']);
    }
}
 
$dataArray = array_reverse($dataArray);
foreach ($dataArray as &$value) {
    if (in_array($value['odd_bookmakers'], $newOddArray)) {
        $pos = array_search($value['odd_bookmakers'], $newOddArray);
        unset($newOddArray[$pos]);
 
        array_push($newDataArray, $value);
    }
}
 
 
 
$newDataArray = array_reverse($newDataArray);
$newDataArray = json_encode($newDataArray);
 
echo $newDataArray;

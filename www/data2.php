<?php
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
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
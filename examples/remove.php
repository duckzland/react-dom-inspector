<?php
/**
 * Simple script for emulating delete request from ImageLoader ajax request
 *
 * @author jason.xie@victheme.com
 */

// Since we don't want to delete anything just return the dummy json
$response = new stdClass();
$response->id = $_REQUEST['id'];
$response->success = true;

header('Content-Type: application/json');
echo json_encode($response);
die();
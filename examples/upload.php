<?php
/**
 * Simple Script for emulating json results from ImageLoader upload request
 *
 * @author jason.xie@victheme.com
 */
$url = 'http://' . $_SERVER['SERVER_NAME'];
$response = new stdClass();
$response->success = true;
$image = new stdClass();
$image->id = 7;
$image->filename = 'image1.jpg';
$image->url = $url . '/images/' . $image->filename;
$image->thumb = false;
$response->image = $image;
var_dump($_REQUEST);
header('Content-Type: application/json');
echo json_encode($response);
die();
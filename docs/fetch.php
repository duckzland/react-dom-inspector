<?php
/**
 * Simple Script for emulating json results from ImageLoader fetch request
 *
 * @author jason.xie@victheme.com
 */
$url = 'http://' . $_SERVER['SERVER_NAME'];
$response = new stdClass();
$response->success = true;
for ($i = 0; $i < 5; $i++) {
    $image = new stdClass();
    $image->id = $i;
    $image->filename = 'image' . $i .'.jpg';
    $image->url = $url . '/' . $image->filename;
    $image->thumb = false;
    $response->images[] = $image;
}

header('Content-Type: application/json');
echo json_encode($response);
die();
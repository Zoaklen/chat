<?php
$uploadDir = "D:\\Outros\\ChatServer\\uploaded\\";
$name = $_REQUEST["name"];
$contentType = "image/png";

$explodedName = explode(".", $name);
$extension = end($explodedName);

switch($extension)
{
  case "png":
  $contentType = "image/png";
  break;
  case "jpg":
  $contentType = "image/jpeg";
  break;
  case "gif":
  $contentType = "image/gif";
  break;
  case "webp":
  $contentType = "image/webp";
  break;
}

header('Content-Type: {$contentType}');
readfile($uploadDir.$name);
?>

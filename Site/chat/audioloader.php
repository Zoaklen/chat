<?php
$uploadDir = "D:\\Outros\\ChatServer\\uploaded\\";
$name = $_REQUEST["name"];
$contentType = "audio/mpeg";

$explodedName = explode(".", $name);
$extension = end($explodedName);

switch($extension)
{
  case "mp3":
  $contentType = "audio/mpeg";
  break;
  case "wav":
  $contentType = "audio/x-wav";
  break;
  case "weba":
  $contentType = "audio/webm";
  break;
  case "oga":
  $contentType = "audio/ogg";
  break;
}

header('Content-Type: {$contentType}');
readfile($uploadDir.$name);
?>

<?php

$uploadDir = "D:\\Outros\\ChatServer\\uploaded\\";
$explodedName = explode(".", $_FILES["photo"]["name"]);

$extension = end($explodedName);
$filename = rand_string(128).".".$extension;

$data = $filename;
copy($_FILES["photo"]["tmp_name"], $uploadDir.$filename);
header('Content-Type: application/json');
echo json_encode($data);

function rand_string ($length)
{
  $chars="ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789abcdefghijklmnopqrstuvwxyz";
  $size = strlen( $chars );
  $str = "";
  for( $i = 0; $i < $length; $i++ ) {
    $str .= $chars[ rand( 0, $size - 1 ) ];
  }
  return $str;
}
?>

<?php

require './vendor/autoload.php';
require_once './database.php';
require_once './src/Connection.php';

use Chat\ChatServer;

// Create connection
$conn = new Connection($host, $user, $pass, $dbname);

// Check connection
if ($conn->getLink()->connect_error) {
  die("Connection failed: " . $conn->getLink()->connect_error);
}
print("Connected successfully to MYSQL database.".PHP_EOL);

print('Initializing server at port 9990.'.PHP_EOL);
$app = new Ratchet\App('localhost', 9990, '0.0.0.0');
$app->route('/chat', new ChatServer, ['*']);
$app->run();
?>

<?php

namespace DAO;

final class UserDAO
{
  public static function registerUser(string $login, string &$password)
  {
    global $conn;
    $password = hash('sha256', $password);

    $conn->query("INSERT INTO users (login, password) VALUES ('{$login}', '{$password}')");
    return $conn->getErrorCode();
  }

  public static function authenticateUser(string $login, string $password)
  {
    global $conn;
    $password = hash('sha256', $password);

    $conn->query("SELECT * FROM users WHERE login = '{$login}' AND password = '{$password}'");
    $exists = mysqli_num_rows($conn->getResult()) > 0;
    mysqli_free_result($conn->getResult());

    return $exists;
  }

  public static function getUsersByName(string $excludeContacts, string $filter)
  {
    global $conn;

    $ret = $conn->queryColumnArray("SELECT login FROM users WHERE login != '{$excludeContacts}' AND login LIKE '%{$filter}%' AND login NOT IN (SELECT contact_login AS login FROM contacts WHERE user_login = '{$excludeContacts}')", "login");
    return $ret;
  }

  public static function getUserByLogin(string $login)
  {
    global $conn;

    $ret = $conn->querySingleAssocArray("SELECT login FROM users WHERE login = '{$login}'");
    return $ret;
  }

  public static function isValidUser(string $user) : bool
  {
    global $conn;

    $conn->query("SELECT login FROM users WHERE login = '{$user}'");

    return $conn->num_rows() > 0;
  }
}

?>

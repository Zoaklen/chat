<?php

namespace DAO;

final class ContactDAO
{
  public static function addContact(string $login, string $contact)
  {
    global $conn;

    $conn->query("INSERT INTO contacts (user_login, contact_login) VALUES ('{$login}', '{$contact}')");
    return $conn->getErrorCode();
  }

  public static function getContactList(string $login)
  {
    global $conn;

    $ret = $conn->queryAssocArray("SELECT * FROM contacts WHERE user_login = '{$login}'");
    return $ret;
  }

  // Returns 1 if $user blocked $other
  // Returns 2 if $other blocked $user
  // Returns 0 otherwise
  public static function getBlockState(string $user, string $other)
  {
    global $conn;

    $conn->query("SELECT * FROM contacts WHERE user_login = '{$user}' AND contact_login = '{$other}' AND blocked = 1");
    if(mysqli_num_rows($conn->getResult()) > 0)
    {
      mysqli_free_result($conn->getResult());
      return 1;
    }
    mysqli_free_result($conn->getResult());

    $conn->query("SELECT * FROM contacts WHERE user_login = '{$other}' AND contact_login = '{$user}' AND blocked = 1");
    if(mysqli_num_rows($conn->getResult()) > 0)
    {
      mysqli_free_result($conn->getResult());
      return 2;
    }
    mysqli_free_result($conn->getResult());

    return 0;
  }

  public static function setBlockUser(string $user, string $blocked, bool $toggle)
  {
    global $conn;
    $toggleNum = $toggle ? 1 : 0;
    $conn->query("UPDATE contacts SET blocked = {$toggleNum} WHERE user_login = '{$user}' AND contact_login = '{$blocked}'");
    return $conn->getErrorCode();
  }
}

?>

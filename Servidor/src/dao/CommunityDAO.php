<?php
namespace DAO;

final class CommunityDAO
{
  public static function createGroup(string $name, string $owner)
  {
    global $conn;
    $insertname = str_replace("'", "''", $name);

    $conn->query("INSERT INTO groups (groupname) VALUES ('{$insertname}');");

    $groupid = mysqli_insert_id($conn->getLink());

    $conn->query("INSERT INTO groupusers (groupid, userlogin, admin) VALUES ({$groupid}, '{$owner}', 1);");
    return $groupid;
  }

  public static function updateGroup(int $groupid, string $name)
  {
    global $conn;
    $insertname = str_replace("'", "''", $name);

    $conn->query("UPDATE groups SET groupname = '{$insertname}' WHERE id = {$groupid}");

    return $conn->getErrorCode();
  }

  public static function addUserToGroup(string $user, int $groupid)
  {
    global $conn;

    $conn->query("INSERT INTO groupusers (groupid, userlogin) VALUES ({$groupid}, '{$user}');");

    return $conn->getErrorCode();
  }

  public static function getGroupInfo(int $groupid)
  {
    global $conn;

    $ret = $conn->querySingleAssocArray("SELECT * FROM groups WHERE id = {$groupid};");

    return $ret;
  }

  public static function getUserGroups(string $user)
  {
    global $conn;

    $ret = $conn->queryAssocArray("SELECT * FROM groupusers INNER JOIN groups ON groupusers.groupid = groups.id WHERE userlogin = '{$user}';");

    return $ret;
  }

  public static function isUserInGroup(string $user, int $group) : bool
  {
    global $conn;

    $conn->query("SELECT * FROM groupusers WHERE groupid = {$group} AND userlogin = '{$user}'");

    return $conn->num_rows() > 0;
  }

  public static function isUserGroupAdmin(string $user, int $group) : bool
  {
    global $conn;

    $conn->query("SELECT * FROM groupusers WHERE groupid = {$group} AND userlogin = '{$user}' AND admin = 1");

    return $conn->num_rows() > 0;
  }
}

?>

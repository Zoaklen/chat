<?php

namespace DAO;

final class MessageDAO
{
  public static function addMessage(string $sender, string $receiver, string $content, bool $private, int $messageType = 0)
  {
    global $conn;

    if($private)
      $hash = self::getPrivateChatHash($sender, $receiver);
    else
      $hash = self::getGroupChatHash(intval($receiver));

    $conn->query("INSERT INTO messages (chat_hash, sender, content, message_type) VALUES ('{$hash}', '{$sender}', '{$content}', {$messageType})");
    return mysqli_insert_id($conn->getLink());
  }

  public static function getMessageList(string $login, string $contact)
  {
    $hash = self::getPrivateChatHash($login, $contact);
    return self::getMessagesFromHash($hash);
  }

  public static function getGroupMessageList(string $group)
  {
    $hash = self::getGroupChatHash($group);
    return self::getMessagesFromHash($hash);
  }

  public static function getMessagesFromHash(string $hash)
  {
    global $conn;

    $ret = $conn->queryAssocArray("SELECT * FROM messages WHERE chat_hash = '{$hash}' ORDER BY senttime ASC");
    for ($i=0; $i < count($ret); $i++) {
      if(boolval($ret[$i]['hidden']) == TRUE)
      {
        $ret[$i]['content'] = 'HIDDEN MESSAGE';
      }
    }
    return $ret;
  }

  public static function hideMessage(int $msgid, bool $toggle)
  {
    global $conn;
    $toggleNum = $toggle ? 1 : 0;

    $conn->query("UPDATE messages SET hidden = {$toggleNum} WHERE id = {$msgid}");
    return $conn->getErrorCode();
  }

  public static function editMessage(int $msgid, string $content)
  {
    global $conn;

    $conn->query("UPDATE messages SET content = '{$content}' WHERE id = {$msgid}");
    return $conn->getErrorCode();
  }

  public static function getMessageData(int $msgid)
  {
    global $conn;

    $ret = $conn->querySingleAssocArray("SELECT * FROM messages WHERE id = {$msgid}");

    return $ret;
  }

  public static function getPrivateChatHash(string $a, string $b): string
  {
    $arr = array($a, $b);
    sort($arr);
    $hash = hash('sha256', $arr[0].'###'.$arr[1]);
    print('Hash from '.$a.' and '.$b.': '.$hash.PHP_EOL);
    return $hash;
  }

  public static function getGroupChatHash(int $groupId) : string
  {
    $info = CommunityDAO::getGroupInfo($groupId);

    if(count($info) <= 0)
      return "";

    $hash = hash('sha256', "group ".$groupId);
    print("Group hash: ".$hash.PHP_EOL);

    return $hash;
  }
}

?>

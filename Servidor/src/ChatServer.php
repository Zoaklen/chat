<?php

namespace Chat;

use Exception;
use SplObjectStorage;
use Ratchet\ConnectionInterface;
use Ratchet\MessageComponentInterface;
use DAO\UserDAO;
use DAO\ContactDAO;
use DAO\MessageDAO;
use DAO\CommunityDAO;

final class ChatServer implements MessageComponentInterface
{
    private $clients;

    public function __construct()
    {
        $this->clients = new SplObjectStorage();
    }

    public function onOpen(ConnectionInterface $conn): void
    {
        $this->clients->attach($conn);
        $this->clients[$conn] = array();
    }

    public function onMessage(ConnectionInterface $from, $encodedmsg): void
    {
      $msg = json_decode($encodedmsg);
      //print(var_dump($msg));
      if($msg != null && property_exists($msg, 'info'))
      {
        if($msg->info == 'login')
        {
          $auth = UserDAO::authenticateUser($msg->login, $msg->password);
          if($auth)
          {
            $this->clients[$from] += ['id'=>$msg->login,'lastchat'=>null];
            print('A new client connected with id ['.$msg->login.']'.PHP_EOL);

            $contacts = ContactDAO::getContactList($msg->login);
            $groups = CommunityDAO::getUserGroups($msg->login);

            $response = [
              'info' => 'authconfirm',
              'id' => $msg->login,
              'contacts' => $contacts,
              'groups' => $groups
            ];

            $from->send(json_encode($response));
          }
          else
          {
            $response = [
              'info' => 'alert',
              'content' => 'Login e/ou senha invalido(s).'
            ];
            $from->send(json_encode($response));
          }
          return;
        }
        else if($msg->info == 'register')
        {
          if(!self::isValidName($msg->login))
          {
            self::alertUser($from, 'Seu nome é inválido.');
            return;
          }

          $code = UserDAO::registerUser($msg->login, $msg->senha);
          if($code == -1)
            print('Registered client: '.$msg->login.' | '.$msg->senha.PHP_EOL);
          else if($code == 1062)
          {
              $response = [
                'info' => 'alert',
                'content' => 'Login já está em uso.'
              ];
              $from->send(json_encode($response));
          }
          return;
        }

        // AUTHENTICATED ONLY
        if(!array_key_exists('id', $this->clients[$from]) || !isset($this->clients[$from]['id']))
        {
          print("Message attempt from unauthenticated user.".PHP_EOL);
          return;
        }

        if($msg->info == 'sendmsg')
        {
          if(strlen($msg->content) < 1 || strlen($msg->content) > 1024)
          {
            return;
          }

          $groupid = -1;
          if(!boolval($msg->group))
          {
            $blockState = ContactDAO::getBlockState($this->clients[$from]['id'], $msg->receiver);

            if($blockState == 1)
            {
              $response = [
                'info' => 'alert',
                'content' => 'Você bloqueou este usuário.'
              ];
              $from->send(json_encode($response));
              return;
            }
            else if($blockState == 2)
            {
              $response = [
                'info' => 'alert',
                'content' => 'Este usuário bloqueou você.'
              ];
              $from->send(json_encode($response));
              return;
            }
            $hash = MessageDAO::getPrivateChatHash($this->clients[$from]['id'], $msg->receiver);
          }
          else {
            $hash = MessageDAO::getGroupChatHash($msg->receiver);
            $groupid = intval($msg->receiver);
          }

          $msg->content = htmlentities($msg->content, ENT_QUOTES);

          $msgid = MessageDAO::addMessage($this->clients[$from]['id'], $msg->receiver, $msg->content, !boolval($msg->group), intval($msg->msgtype));

          $messageData = array(
            'sender' => $this->clients[$from]['id'],
            'content' => $msg->content,
            'id' => $msgid,
            'hidden' => false,
            'groupid' => $groupid,
            'message_type' => intval($msg->msgtype)
          );

          var_dump($messageData);

          $responsemsg = [
            'info' => 'sendmsg',
            'data' => $messageData,
            'selfMessage' => true
          ];
          $from->send(json_encode($responsemsg));

          foreach ($this->clients as $client)
          {
            print("Client ".$this->clients[$client]['id']." last chat/hash: ".PHP_EOL.$this->clients[$client]['lastchat'].PHP_EOL.$hash.PHP_EOL);
            if($client != $from && $this->clients[$client]['lastchat'] == $hash)
            {
              $responsemsg = [
                'info' => 'sendmsg',
                'data' => $messageData,
                'selfMessage' => false
              ];
              $client->send(json_encode($responsemsg));
              print('Message sent to '.$this->clients[$client]['id'].PHP_EOL);
            }
          }
          return;
        }
        else if($msg->info == 'requestmessage')
        {
          $list = null;
          $clientInfo = $this->clients[$from];
          if(boolval($msg->group))
          {
            $list = MessageDAO::getGroupMessageList($msg->other);
            $blockState = false;
            $clientInfo['lastchat'] = MessageDAO::getGroupChatHash($msg->other);
          }
          else
          {
            $list = MessageDAO::getMessageList($this->clients[$from]['id'], $msg->other);
            $blockState = ContactDAO::getBlockState($this->clients[$from]['id'], $msg->other);
            $clientInfo['lastchat'] = MessageDAO::getPrivateChatHash($this->clients[$from]['id'], $msg->other);
          }
          $this->clients[$from] = $clientInfo;
          print("Client ".$this->clients[$from]['id']." last chat: ".$this->clients[$from]['lastchat'].PHP_EOL);

          $response = [
            'info' => 'messagelist',
            'messages' => $list,
            'blocked' => $blockState
          ];
          $from->send(json_encode($response));
        }
        else if($msg->info == 'addcontact')
        {
          $code = ContactDAO::addContact($this->clients[$from]['id'], $msg->contact);
          if($code == 1452)
          {
            $response = [
              'info' => 'alert',
              'content' => 'Este usuário não existe.'
            ];
            $from->send(json_encode($response));
          }
          else
          {
            $response = [
              'info' => 'confirmcontact',
              'contact' => array('user_login'=>$this->clients[$from]['id'], 'contact_login'=>$msg->contact, 'blocked'=>false)
            ];
            $from->send(json_encode($response));
            print("Contact added from ".$this->clients[$from]['id'].", contact: ".$msg->contact.PHP_EOL);
          }
        }
        else if($msg->info == 'searchusers')
        {
          $users = UserDAO::getUsersByName($this->clients[$from]['id'], $msg->filter);
          $response = [
            'info' => 'searchusersresult',
            'users' => $users
          ];
          $from->send(json_encode($response));
        }
        else if($msg->info == 'blockuser')
        {
          $code = ContactDAO::setBlockUser($this->clients[$from]['id'], $msg->user, $msg->toggle);
          $blockState = ContactDAO::getBlockState($this->clients[$from]['id'], $msg->user);
          if($code == -1)
          {
            $response = [
              'info' => 'setblock',
              'user' => $msg->user,
              'toggle' => $msg->toggle,
              'state' => $blockState
            ];
            $from->send(json_encode($response));

            $blockStateReverse = $blockState;
            if($blockStateReverse == 1)
            {
              $blockStateReverse = 2;
            }
            else if($blockStateReverse == 2)
            {
              $blockStateReverse = 1;
            }

            foreach ($this->clients as $client)
            {
              if($this->clients[$client]['id'] == $msg->user)
              {
                $responsemsg = [
                  'info' => 'setblock',
                  'user' => $this->clients[$from]['id'],
                  'toggle' => $msg->toggle,
                  'state' => $blockStateReverse
                ];
                $client->send(json_encode($responsemsg));
                break;
              }
            }
          }
        }
        else if($msg->info == 'hidemsg')
        {
          $message = MessageDAO::getMessageData($msg->msgid);
          if($message != null)
          {
            if($message['sender'] != $this->clients[$from]['id'])
            {
              self::alertUser($from, 'Esta mensagem não pertence a você.');
              return;
            }

            MessageDAO::hideMessage($msg->msgid, $msg->toggle);

            $responsemsg = [
              'info' => 'hidemsg',
              'msgid' => $msg->msgid,
              'toggle' => $msg->toggle,
              'content' => ($msg->toggle ? '<< HIDDEN >>' : $message['content'])
            ];
            $from->send(json_encode($responsemsg));

            foreach ($this->clients as $client)
            {
              if($this->clients[$client]['lastchat'] == $message['chat_hash'])
              {
                $client->send(json_encode($responsemsg));
              }
            }
          }
        }
        else if($msg->info == 'editmsg')
        {
          $message = MessageDAO::getMessageData($msg->msgid);
          if($message != null)
          {
            if($message['sender'] != $this->clients[$from]['id'])
            {
              self::alertUser($from, 'Esta mensagem não pertence a você.');
              return;
            }

            MessageDAO::editMessage($msg->msgid, $msg->content);

            $responsemsg = [
              'info' => 'editmsg',
              'msgid' => $msg->msgid,
              'content' => $msg->content
            ];
            $from->send(json_encode($responsemsg));

            foreach ($this->clients as $client)
            {
              if($this->clients[$client]['lastchat'] == $message['chat_hash'])
              {
                $client->send(json_encode($responsemsg));
              }
            }
          }
        }
        else if($msg->info == 'createcomm')
        {
          $id = CommunityDAO::createGroup($msg->name, $this->clients[$from]['id']);

          $responsemsg = [
            'info' => 'confirmgroup',
            'group' => array('groupname' => $msg->name, 'groupid' => $id)
          ];
          $from->send(json_encode($responsemsg));
        }
        else if($msg->info == 'addtogroup')
        {
          if(!UserDAO::isValidUser($msg->user))
          {
            self::alertUser($from, "Usuário inválido.");
            return;
          }

          if(!CommunityDAO::isUserInGroup($this->clients[$from]['id'], $msg->groupid))
          {
            self::alertUser($from, "Você não pertence a este grupo.");
            return;
          }

          if(CommunityDAO::isUserInGroup($msg->user, $msg->groupid))
          {
            self::alertUser($from, "Este usuário já pertence a este grupo.");
            return;
          }

          CommunityDAO::addUserToGroup($msg->user, intval($msg->groupid));

          $groupinfos = CommunityDAO::getGroupInfo(intval($msg->groupid));

          foreach ($this->clients as $client)
          {
            if($this->clients[$client]['id'] == $msg->user)
            {
              $responsemsg = [
                'info' => 'confirmgroup',
                'group' => array('groupname' => $groupinfos['groupname'], 'groupid' => $msg->groupid)
              ];
              $client->send(json_encode($responsemsg));
              break;
            }
          }
        }
        else if($msg->info == 'editgroup')
        {
          if(!CommunityDAO::isUserGroupAdmin($this->clients[$from]['id'], $msg->groupid))
          {
            self::alertUser($from, "Você não é administrador do grupo.");
            return;
          }

          CommunityDAO::updateGroup($msg->groupid, $msg->name);

          foreach ($this->clients as $client)
          {
            if(CommunityDAO::isUserInGroup($this->clients[$client]['id'], $msg->groupid))
            {
              $responsemsg = [
                'info' => 'editgroup',
                'group' => array('groupname' => $msg->name, 'groupid' => $msg->groupid)
              ];
              $client->send(json_encode($responsemsg));
            }
          }
        }
      }
    }

    public static function isValidName(string $name): bool
    {
      if(str_contains($name, "###"))
        return false;

      if(str_contains($name, " "))
        return false;

      if(str_contains($name, "'") || str_contains($name, '"'))
        return false;

      return true;
    }

    public static function alertUser(ConnectionInterface $conn, string $content): void
    {
      $response = [
        'info' => 'alert',
        'content' => $content
      ];
      $conn->send(json_encode($response));
    }

    public function onClose(ConnectionInterface $conn): void
    {
        $this->disconnect($conn);
    }

    public function onError(ConnectionInterface $conn, Exception $exception): void
    {
        $conn->close();
    }

    public function disconnect(ConnectionInterface $conn): void
    {
        $this->clients->detach($conn);
    }
}

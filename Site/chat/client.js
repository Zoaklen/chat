let socket =  null;

function startSocket()
{
  socket = new WebSocket('ws://25.4.125.40:9990/chat');
}

function connect(useid, pass)
{
  if(socket == null)
  {
    startSocket();
    socket.onopen = () =>
    {
      sendConnectMessage(useid, pass);

      socket.addEventListener('message', function (event) {
          const data = JSON.parse(event.data);
          interpretate(data);
      });
    }

    socket.onerror = (error) =>
    {
      alert('Houve um erro ao tentar se conectar com o servidor, tente novamente mais tarde.');
    }
  }
  else {
    sendConnectMessage(useid, pass);
  }
}

function sendConnectMessage(useid, pass)
{
  const sendData = {
    login: useid,
    password: pass,
    info: 'login'
  };

  socket.send(JSON.stringify(sendData));
}

function register(login, pass)
{
  if(socket == null)
  {
    startSocket();
    socket.onopen = () =>
    {
      sendRegisterMessage(login, pass);
      socket.addEventListener('message', function (event) {
          // Deserializamos o objeto
          const data = JSON.parse(event.data);
          interpretate(data);
      });
    }

    socket.onerror = (error) =>
    {
      alert('Houve um erro ao tentar se conectar com o servidor, tente novamente mais tarde.');
    }
  }
  else
  {
    sendRegisterMessage(login, pass);
  }
}

function sendRegisterMessage(login, pass)
{
  const sendData = {
    login: login,
    senha: pass,
    info: 'register'
  };

  socket.send(JSON.stringify(sendData));
}

function interpretate(data)
{
  if(data.info == 'sendmsg')
  {
    addMessage(data.data, data.selfMessage);
  }
  else if(data.info == 'authconfirm')
  {
    myId = data.id;
    document.getElementById('pageBlocker').style.display = 'none';
    document.getElementById('authenticationScreen').style.display = 'none';
    document.getElementById('pageContainer').style.filter = '';
    loadContactList(data.contacts);
    loadGroupList(data.groups);
  }
  else if(data.info == 'alert')
  {
    alert(data.content);
  }
  else if(data.info == 'messagelist')
  {
    loadChatMessages(data.messages);
    updateChatBlockedState(JSON.parse(data.blocked));
  }
  else if(data.info == 'searchusersresult')
  {
    loadSearchUserList(data.users);
  }
  else if(data.info == 'setblock')
  {
    updateBlockStatus(data.user, JSON.parse(data.toggle), JSON.parse(data.state));
  }
  else if(data.info == 'confirmcontact')
  {
    addContactToList(data.contact);
  }
  else if(data.info == 'hidemsg')
  {
    hideChatMessage(data.msgid, JSON.parse(data.toggle), data.content);
  }
  else if(data.info == 'editmsg')
  {
    editChatMessage(data.msgid, data.content);
  }
  else if(data.info == 'confirmgroup')
  {
    addGroupToList(data.group);
  }
  else if(data.info == 'editgroup')
  {
    editGroup(data.group);
  }
}

function sendMessage(id, msg, group)
{
  const data = {
    info: 'sendmsg',
    receiver: id,
    content: msg,
    group: group,
    msgtype: 0
  };
  socket.send(JSON.stringify(data));
}

function sendSearchUsersMessage(filter)
{
  const data = {
    info: 'searchusers',
    filter: filter
  };
  socket.send(JSON.stringify(data));

}

function sendBlockMessage(user, toggle)
{
  const data = {
    info: 'blockuser',
    user: user,
    toggle: toggle
  };
  socket.send(JSON.stringify(data));
}

function sendHideMessage(msgid, toggle)
{
  const data = {
    info: 'hidemsg',
    msgid: msgid,
    toggle: toggle
  };
  socket.send(JSON.stringify(data));
}

function sendEditMessage(msgid, content)
{
  const data = {
    info: 'editmsg',
    msgid: msgid,
    content: content
  };
  socket.send(JSON.stringify(data));
}

function sendCreateCommunityMessage(name)
{
  const data = {
    info: 'createcomm',
    name: name
  };
  socket.send(JSON.stringify(data));
}

function sendAddToGroupMessage(name, groupid)
{
  const data = {
    info: 'addtogroup',
    user: name,
    groupid: groupid
  };
  socket.send(JSON.stringify(data));
}

function sendEditGroupMessage(name, groupid)
{
    const data = {
      info: 'editgroup',
      name: name,
      groupid: groupid
    };
    socket.send(JSON.stringify(data));
}

function sendImageMessage(id, msg, group)
{
  const data = {
    info: 'sendmsg',
    receiver: id,
    content: msg,
    group: group,
    msgtype: 1
  };
  socket.send(JSON.stringify(data));
}

function sendAudioMessage(id, msg, group)
{
  const data = {
    info: 'sendmsg',
    receiver: id,
    content: msg,
    group: group,
    msgtype: 2
  };
  socket.send(JSON.stringify(data));
}

var myId;
var conversaSelecionada = null;
var contextUser = "";
var contextMessage = null;
var contextMessageButton = null;
var contextGroup = -1;

var noChat;
var chatField;

function abreMenuContextoComunidade(event)
{
  document.getElementById("menuContextoComunidade").classList.remove("active");
  document.getElementById("menuContextoMensagem").classList.remove("active");
  document.getElementById("menuContexto").classList.remove("active");
  var contextElement = document.getElementById("menuContextoComunidade");
  contextElement.style.top = event.pageY+10  + "px";
  contextElement.style.left = event.pageX+10 + "px";
  contextElement.classList.add("active");
  event.preventDefault();
}

function abreMenuContexto(event)
{
  document.getElementById("menuContextoComunidade").classList.remove("active");
  document.getElementById("menuContextoMensagem").classList.remove("active");
  document.getElementById("menuContexto").classList.remove("active");
  var contextElement = document.getElementById("menuContexto");
  contextElement.style.top = event.pageY+10  + "px";
  contextElement.style.left = event.pageX+10 + "px";
  contextElement.classList.add("active");
  event.preventDefault();
}

function abreMenuContextoMensagem(event)
{
  document.getElementById("menuContextoComunidade").classList.remove("active");
  document.getElementById("menuContextoMensagem").classList.remove("active");
  document.getElementById("menuContexto").classList.remove("active");
  var contextElement = document.getElementById("menuContextoMensagem");
  if(contextMessageButton != null)
  {
    contextElement.style.top = contextMessageButton.getBoundingClientRect().top+10  + "px";
    contextElement.style.left = contextMessageButton.getBoundingClientRect().left-200 + "px";
  }
  else
  {
    contextElement.style.top = event.pageY+10  + "px";
    contextElement.style.left = event.pageX-200 + "px";
  }
  contextElement.classList.add("active");
  event.preventDefault();
}

function abreMenuComunidade(groupid) {
  window.removeEventListener("contextmenu", abreMenuContexto, false);
  window.removeEventListener("contextmenu", abreMenuContextoMensagem, false);
  window.addEventListener("contextmenu", abreMenuContextoComunidade);
  contextGroup = groupid;
}

function abreMenu(user) {
  /// alert("função chamada")
  window.removeEventListener("contextmenu", abreMenuContextoComunidade, false);
  window.removeEventListener("contextmenu", abreMenuContextoMensagem, false);
  window.addEventListener("contextmenu", abreMenuContexto);
  if(document.querySelector('[data-user='+user+']').classList.contains('blockedUser'))
  {
    document.getElementById('blockUser').style.display = "none";
    document.getElementById('unblockUser').style.display = "";
  }
  else {
    document.getElementById('blockUser').style.display = "";
    document.getElementById('unblockUser').style.display = "none";
  }
  contextUser = user;
}

function abreMenuMensagem(msgid) {
  /// alert("função chamada")
  window.removeEventListener("contextmenu", abreMenuContextoComunidade, false);
  window.removeEventListener("contextmenu", abreMenuContexto, false);
  window.addEventListener("contextmenu", abreMenuContextoMensagem);
  if(document.querySelector('[data-msgid="'+msgid+'"]').classList.contains('hiddenMsg'))
  {
    document.getElementById('hideMsg').style.display = "none";
    document.getElementById('revealMsg').style.display = "";
  }
  else {
    document.getElementById('hideMsg').style.display = "";
    document.getElementById('revealMsg').style.display = "none";
  }
  contextMessage = parseInt(msgid);
}

function abreMenuMensagem2(msgid, button) {
  /// alert("função chamada")
  abreMenuMensagem(msgid);
  window.removeEventListener('click', resetContext, false);

  contextMessage = parseInt(msgid);
  contextMessageButton = button;
  const event = new MouseEvent('contextmenu', {
    view: window,
    bubbles: true,
    cancelable: true
  });
  window.dispatchEvent(event);

  setTimeout(() => window.addEventListener('click', resetContext), 50);
}

function eventFire(el, etype){
  if (el.fireEvent) {
    el.fireEvent('on' + etype);
  } else {
    var evObj = document.createEvent('Events');
    evObj.initEvent(etype, true, false);
    el.dispatchEvent(evObj);
  }
}

function abreAddAmigo() {
  //alert("função chamada")
  var contextElement = document.getElementById("teste");
  var x = document.getElementById("opacity");
  x.style.visibility = 'visible';
  x.classList.add("active");
  contextElement.style.visibility = 'visible';
  contextElement.classList.add("active");
  //event.preventDefault();
  window.addEventListener("click",function(){
    document.getElementById("teste").classList.remove("active");
    document.getElementById("opacity").classList.remove("active")
});

}

function escondeMenu(event) {
  var contextElement = document.getElementById("teste");
  var x = document.getElementById("opacity");
  contextElement.style.visibility = 'hidden';
  x.style.visibility = 'hidden';
  document.getElementById("teste").classList.remove("active");
  document.getElementById("opacity").classList.remove("active");
  //event.preventDefault();
}

function abrirComunidade(event) {
  window.addEventListener("click",function(event){
  var contextElement = document.getElementById("comunityTab");
  contextElement.style.visibility = 'visible';
  contextElement.classList.add("active");
    //event.preventDefault();
});
}

function fecharComunidade(event) {
    window.addEventListener("click", function (event) {
      var contextElement = document.getElementById("comunityTab");
      var x = document.getElementById("comunityBar");
      if(event.target !== contextElement & event.target !== x) {
        contextElement.style.visibility = "hidden";
      }
    })
}

function abrirConversa(e) {
  if(conversaSelecionada != null)
  {
    conversaSelecionada.element.classList.remove('selectedChat');
  }
  else
  {
    conversaSelecionada = {};
  }
  conversaSelecionada.element = e;
  conversaSelecionada.element.classList.add('selectedChat');
  conversaSelecionada.id = e.querySelector('.nome').innerHTML;
  conversaSelecionada.grupo = false;
  noChat.style.display = 'none';
  chatField.style.display = 'initial';

  clearChat();

  const sendData = {
    info: 'requestmessage',
    other: conversaSelecionada.id,
    group: false
  };

  socket.send(JSON.stringify(sendData));
}

function abrirConversaGrupo(e) {
  if(conversaSelecionada != null)
  {
    conversaSelecionada.element.classList.remove('selectedChat');
  }
  else
  {
    conversaSelecionada = {};
  }
  conversaSelecionada.element = e;
  conversaSelecionada.element.classList.add('selectedChat');
  conversaSelecionada.id = parseInt(e.getAttribute('data-group'));
  conversaSelecionada.grupo = true;
  noChat.style.display = 'none';
  chatField.style.display = 'initial';

  clearChat();

  const sendData = {
    info: 'requestmessage',
    other: conversaSelecionada.id,
    group: true
  };

  socket.send(JSON.stringify(sendData));
}

function startPage()
{
  const inputArea = document.getElementById('messageSendInput');
  document.getElementById('pageContainer').style.filter = 'blur(2px)';
  inputArea.addEventListener('keydown', (e) =>{
    if(e.keyCode == 13)
    {
      if(conversaSelecionada !=  null)
        sendMessage(conversaSelecionada.id, inputArea.value, conversaSelecionada.grupo);
      inputArea.value = '';
    }
  });

  noChat = document.getElementById('noChat');
  chatField = document.getElementById('chatField');

  window.addEventListener("click",resetContext);
}

function resetContext(event)
{
  document.getElementById("menuContextoComunidade").classList.remove("active");
  document.getElementById("menuContexto").classList.remove("active");
  document.getElementById("menuContextoMensagem").classList.remove("active");
  window.removeEventListener("contextmenu", abreMenuContextoComunidade);
  window.removeEventListener("contextmenu", abreMenuContexto);
  window.removeEventListener("contextmenu", abreMenuContextoMensagem);
  contextUser = "";
  contextMessage = null;
  contextMessageButton = null;
}

function submitId()
{
  const login = document.getElementById('idText');
  const pass = document.getElementById('passText');
  connect(login.value, pass.value);
  myId = login.value;
}

function submitRegister()
{
  const login = document.getElementById('idText');
  const pass = document.getElementById('passText');
  register(login.value, pass.value);
}


function searchUser()
{
  const input = document.getElementById('userSearchBar');
  sendSearchUsersMessage(input.value);
}

function loadSearchUserList(list)
{
  const friendBar = document.querySelector('.friendBar > ul');
  const userStorage = document.querySelector('#userSearchResultStorage > li');
  while(friendBar.firstChild)
  {
    friendBar.removeChild(friendBar.firstChild);
  }

  for(var i = 0;i < list.length;i++)
  {
    const result = userStorage.cloneNode(true);
    result.querySelector('.messageContent').innerHTML = list[i];

    friendBar.appendChild(result);
  }
}

function addUserClick(result)
{
  const user = result.querySelector('.messageContent');
  const name = user.innerHTML;
  result.style.display = "none";

  addFriend(name);
}

function addContactToList(contact)
{
  const newUser = document.querySelector('#userStorage > li').cloneNode(true);
  newUser.querySelector('.nome').innerHTML = contact.contact_login;
  newUser.querySelector('.mensagem').innerHTML = 'Novo contato';
  newUser.setAttribute('data-user', contact.contact_login);
  if(JSON.parse(contact.blocked))
  {
    newUser.classList.add('blockedUser');
  }
  const friendList = document.querySelector('#lista');
  friendList.appendChild(newUser);
}

function addGroupToList(group)
{
  const newGroup = document.querySelector('#communityStorage > li').cloneNode(true);
  newGroup.querySelector('.nome').innerHTML = group.groupname;
  newGroup.querySelector('.mensagem').innerHTML = 'Novo grupo';
  newGroup.setAttribute('data-group', group.groupid);

  const friendList = document.querySelector('#lista');
  friendList.appendChild(newGroup);
}

function addFriend(name)
{
  const sendData = {
    info: 'addcontact',
    contact: name
  };

  socket.send(JSON.stringify(sendData));
}

function addMessageToScreen(data, self)
{
  const chat = document.querySelector('.chatfoda');

  const msgType = self ? 'msgMineStorage' : 'msgOtherStorage';
  const newMessage = document.querySelector('#'+msgType+' > div').cloneNode(true);

  const hidden = JSON.parse(data.hidden);

  const messageType = parseInt(data.message_type);

  if(!self)
  {
    newMessage.querySelector('.messageName').innerHTML = data.sender;
  }

  if(messageType == 0)
  {
    newMessage.querySelector('.messageContent').innerHTML = (hidden ? "Esta mensagem foi ocultada pelo autor" : data.content);
  }
  else if(messageType == 1)
  {
    var img = document.createElement("img");
    img.src = "imageloader.php?name=" + data.content;
    img.classList.add("chatimage");
    newMessage.querySelector('.messageContent').appendChild(img);
  }
  else if(messageType == 2)
  {
    //<audio controls> <source src="RICARDO MILOS U GOT THAT (320 kbps).mp3" type="audio/mpeg"> Your browser does not support the audio tag. </audio>
    var mimeType = "audio/mpeg";

    var extension = data.content.split('.').pop();

    switch(extension)
    {
      case "mp3":
      mimeType = "audio/mpeg";
      break;
      case "wav":
      mimeType = "audio/x-wav";
      break;
      case "weba":
      mimeType = "audio/webm";
      break;
      case "oga":
      mimeType = "audio/ogg";
      break;
    }

    var audio = document.createElement("audio");
    audio.setAttribute("controls", "")
    var source = document.createElement("source");
    source.src = "audioloader.php?name=" + data.content;
    source.type = mimeType;
    source.innerHTML = "Seu navegador não suporta áudios.";
    audio.appendChild(source);
    newMessage.querySelector('.messageContent').appendChild(audio);
  }

  if(hidden)
  {
    newMessage.classList.add('hiddenMsg');
  }
  newMessage.setAttribute('data-msgid', data.id);
  chat.appendChild(newMessage);
}

function addMessage(data, self)
{
  if(!self && data.groupid < 0)
  {
    var contains = false;
    const children = document.getElementById('lista').children;
    for (var i = 0; i < children.length; i++) {
      var c = children[i];
      if(c.querySelector('.nome').innerHTML == data.sender)
      {
        contains = true;
        break;
      }
    }

    if(!contains)
    {
      addFriend(data.sender);
    }
  }

  var myChat = (data.groupid > 0 ? conversaSelecionada.id == data.groupid : data.sender == conversaSelecionada.id);
  if(conversaSelecionada != null && (self || myChat))
  {
    addMessageToScreen(data, self);
  }
}

function loadChatMessages(messageList)
{
  clearChat();

  console.log(messageList);
  for(var i = 0;i < messageList.length;i++)
  {
    addMessageToScreen(messageList[i], messageList[i].sender == myId);
  }
}

function clearChat()
{
  const chat = document.querySelector('.chatfoda');
  while(chat.firstChild)
  {
    chat.removeChild(chat.firstChild);
  }
}

function loadContactList(contactList)
{
  for(var i = 0;i < contactList.length;i++)
  {
    addContactToList(contactList[i]);
  }
}

function loadGroupList(groupList)
{
  for(var i = 0;i < groupList.length;i++)
  {
    addGroupToList(groupList[i]);
  }
}

function blockSelectedUser(toggle)
{
  if(contextUser.length > 0)
    sendBlockMessage(contextUser, toggle);
}

function updateBlockStatus(user, toggle, state)
{
  var element = document.querySelector('[data-user='+user+']');
  if(element != null)
  {
    if(toggle)
      element.classList.add('blockedUser');
    else
      element.classList.remove('blockedUser');
  }

  if(conversaSelecionada.id == user)
  {
    updateChatBlockedState(state);
  }
}

function updateChatBlockedState(state)
{
  var textBar = document.getElementById('messageSendInput');
  if(textBar != null)
  {
    switch(state)
    {
      case 0:
      textBar.placeholder = "Digite sua mensagem";
      textBar.disabled = false;
      break;
      case 1:
      textBar.placeholder = "Você bloqueou este usuário.";
      textBar.value = "";
      textBar.disabled = true;
      break;
      case 2:
      textBar.placeholder = "Este usuário te bloqueou.";
      textBar.value = "";
      textBar.disabled = true;
      break;
    }
  }
}

function messageSetHidden(toggle)
{
  if(contextMessage == null || !Number.isInteger(contextMessage))
    return;

  sendHideMessage(contextMessage, toggle);
}

function hideChatMessage(msgid, toggle, content)
{
  var msg = document.querySelector('[data-msgid="'+msgid+'"]');
  if(msg != null)
  {
    msg.querySelector('.messageContent').innerHTML = (toggle ? "Esta mensagem foi ocultada pelo autor" : content);
    if(toggle)
    {
      msg.classList.add('hiddenMsg');
    }
    else
    {
      msg.classList.remove('hiddenMsg');
    }
  }
}

function showEditMessage()
{
    if(contextMessage == null || !Number.isInteger(contextMessage))
      return;

    document.getElementById('pageBlocker').style.display = '';
    document.getElementById('editMessage').style.display = "";
    document.getElementById('editMessage').setAttribute('edit-msgid', contextMessage);
    document.querySelector('#editMessage textarea').value = document.querySelector('[data-msgid="'+contextMessage+'"] > .messageContent').innerHTML;
    document.getElementById('pageContainer').style.filter = 'blur(2px)';
}

function submitEdit()
{
  var el = document.getElementById('editMessage');
  sendEditMessage(parseInt(el.getAttribute('edit-msgid')), el.querySelector('textarea').value);
  cancelEdit();
}

function cancelEdit()
{
  document.getElementById("editMessage").style.display = "none";
  document.getElementById('pageBlocker').style.display = 'none';
  document.getElementById('pageContainer').style.filter = '';
}

function editChatMessage(msgid, content)
{
  var el = document.querySelector('[data-msgid="'+msgid+'"]');
  if(el != null && !el.classList.contains("hiddenMsg"))
  {
    el.querySelector('.messageContent').innerHTML = content;
  }
}

function createCommunity()
{
  var el = document.getElementById('createCommunityName');
  if(el == null)
    return;

  sendCreateCommunityMessage(el.value);
}

function openEditGroupMenu()
{
  var groupid = contextGroup;

  document.getElementById('groupname').value = document.querySelector('[data-group="'+groupid+'"] .nome').innerHTML;

  document.getElementById('editGroupId').value = groupid;

  document.getElementById('pageBlocker').style.display = '';
  document.getElementById('editGroup').style.display = "";
  document.getElementById('pageContainer').style.filter = 'blur(2px)';
}

function openGroupSelectMenu()
{
  var list = document.querySelector('#lista').querySelectorAll('[data-group]');

  const selector  = document.querySelector('#groupSelection');
  while(selector.firstChild)
  {
    selector.removeChild(selector.firstChild);
  }

  for (var item in list) {
    if (list.hasOwnProperty(item)) {
      var el = list[item];
      const node = document.createElement("option");
      node.innerHTML = el.querySelector('.nome').innerHTML;
      node.value = el.getAttribute('data-group');
      selector.appendChild(node);
    }
  }

  document.getElementById('addGroupUser').value = contextUser;

  document.getElementById('pageBlocker').style.display = '';
  document.getElementById('groupSelectMenu').style.display = "";
  document.getElementById('pageContainer').style.filter = 'blur(2px)';
}

function addUserToGroup()
{
  var groupid = document.getElementById('groupSelection').value;
  var user = document.getElementById('addGroupUser').value;
  sendAddToGroupMessage(user, groupid);
  cancelAddGroup();
}

function cancelAddGroup()
{
    document.getElementById("groupSelectMenu").style.display = "none";
    document.getElementById('pageBlocker').style.display = 'none';
    document.getElementById('pageContainer').style.filter = '';
}

function confirmEditGroup()
{
  var name = document.getElementById('groupname').value;
  sendEditGroupMessage(name, document.getElementById('editGroupId').value);
  cancelEditGroup();
}

function cancelEditGroup()
{
    document.getElementById("editGroup").style.display = "none";
    document.getElementById('pageBlocker').style.display = 'none';
    document.getElementById('pageContainer').style.filter = '';
}

function editGroup(group)
{
  var el = document.querySelector('[data-group="'+group.groupid+'"]');
  if(el == null)
    return

  el.querySelector('.nome').innerHTML = group.groupname;
}

function onDropFile(ev)
{
  console.log('File(s) dropped');

  // Impedir o comportamento padrão (impedir que o arquivo seja aberto)
  ev.preventDefault();

  if (ev.dataTransfer.items) {
    // Use a interface DataTransferItemList para acessar o (s) arquivo (s)
    for (var i = 0; i < ev.dataTransfer.items.length; i++) {
      // Se os itens soltos não forem arquivos, rejeite-os
      if (ev.dataTransfer.items[i].kind === 'file') {
        var file = ev.dataTransfer.items[i].getAsFile();
        console.log('... file[' + i + '].name = ' + file.name);

        const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
        const validAudioTypes = ['audio/mpeg', 'audio/x-wav', 'audio/webm'];

        let photo = file;
        let formData = new FormData();
        formData.append("photo", photo);
        fetch('/chat/upload.php', {method: "POST", body: formData})
        .then(function(response) {
          return response.text();
        })
        .then(body => {
            console.log(body);
            var name = JSON.parse(body);
            if (validImageTypes.includes(file['type'])) {
              sendImageMessage(conversaSelecionada.id, name, conversaSelecionada.grupo);
            }
            else if(validAudioTypes.includes(file['type'])) {
              sendAudioMessage(conversaSelecionada.id, name, conversaSelecionada.grupo);
            }
        });
      }
    }
  } else {
    // Use a interface DataTransfer para acessar o (s) arquivo (s)
    for (var i = 0; i < ev.dataTransfer.files.length; i++) {
      const validImageTypes = ['image/gif', 'image/jpeg', 'image/png'];
      const validAudioTypes = ['audio/mpeg', 'audio/x-wav', 'audio/webm'];

      let photo = file;
      let formData = new FormData();
      formData.append("photo", photo);
      fetch('/chat/upload.php', {method: "POST", body: formData})
      .then(function(response) {
        return response.text();
      })
      .then(body => {
          console.log(body);
          var name = JSON.parse(body);
          if (validImageTypes.includes(file['type'])) {
            sendImageMessage(conversaSelecionada.id, name, conversaSelecionada.grupo);
          }
          else if(validAudioTypes.includes(file['type'])) {
            sendAudioMessage(conversaSelecionada.id, name, conversaSelecionada.grupo);
          }
      });
    }
  }
}

function onDragOver(ev)
{
  // console.log('File(s) in drop zone');

  // Impedir o comportamento padrão (impedir que o arquivo seja aberto)
  ev.preventDefault();
}

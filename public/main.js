$(function() {
  var FADE_TIME = 150;
  var TYPING_TIMER_LENGTH = 400;
  var COLORS = [
    '#94a19f', '#000000', '#7a7777', '#3b3b3b',
    '#3c4544', '#7a7a7a', '#4f5251', '#575757',
    'grey', 'darkgrey', 'black', '#404040'
  ];

  var $window = $(window);
  var $usernameInput = $('.usernameInput');
  var $messages = $('.messages');
  var $inputMessage = $('.inputMessage');

  var $loginPage = $('.login.page');
  var $chatPage = $('.chat.page');

  var username;
  var connected = false;
  var typing = false;
  var lastTypingTime;
  var $currentInput = $usernameInput;

  var socket = io();

  function addParticipantsMessage(data) {
    var message = '';
    if (data.numUsers === 1) {
      message += "Ты Одинокий";
    } else {
      message += "Тутоньки " + data.numUsers + "Друзей";
    }
    log(message);
  }

  function setUsername() {
    username = cleanInput($usernameInput.val().trim());
    if (username) {
      $loginPage.fadeOut();
      $chatPage.show();
      $loginPage.off('click');
      $currentInput = $inputMessage.focus();

      socket.emit('add user', username);
    }
  }

  function sendMessage() {
    var message = $inputMessage.val();
    message = cleanInput(message);
    if (message && connected) {
      $inputMessage.val('');
      addChatMessage({
        username: username,
        message: message
      });
      socket.emit('new message', message);
    }
  }

  function log(message, options) {
    var $el = $(
      message.match(/welcome/i) ? '<marquee scrollamount="50">' : '<li>'
    ).addClass('log').text(message);
    addMessageElement($el, options);
    $(document).ready(function() {

      var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
        url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g,

        linkThis = function() {
          var childNodes = this.childNodes,
            i = childNodes.length;
          while (i--) {
            var n = childNodes[i];
            if (n.nodeType == 3) {
              var html = $.trim(n.nodeValue);
              if (html) {
                html = html.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(url1, '$1 <a href="http://$2" style="color: white" target="_blank">$2</a>$3')
                  .replace(url2, '$1 <a href="$2" style="color: white" target="_blank">$2</a>$5');
                $(n).after(html).remove();
              }
            }
            else if (n.nodeType == 1 && !/^(a|button|textarea)$/i.test(n.tagName)) {
              linkThis.call(n);
            }
          }
        };
      $.fn.link = function() {
        return this.each(linkThis);
      };

      $('body').link();
    });

  }

  function addChatMessage(data, options) {
    var $typingMessages = getTypingMessages(data);
    options = options || {};
    if ($typingMessages.length !== 0) {
      options.fade = false;
      $typingMessages.remove();
    }

    var $usernameDiv = $('<span class="username"/>')
      .text(data.username)
      .css('color', getUsernameColor(data.username));
    var $messageBodyDiv = $('<span class="messageBody">')
      .text(data.message);

    var typingClass = data.typing ? 'typing' : '';
    var $messageDiv = $('<li class="message"/>')
      .data('username', data.username)
      .addClass(typingClass)
      .append($usernameDiv, $messageBodyDiv);

    addMessageElement($messageDiv, options);
    $(document).ready(function() {

      var url1 = /(^|&lt;|\s)(www\..+?\..+?)(\s|&gt;|$)/g,
        url2 = /(^|&lt;|\s)(((https?|ftp):\/\/|mailto:).+?)(\s|&gt;|$)/g,

        linkThis = function() {
          var childNodes = this.childNodes,
            i = childNodes.length;
          while (i--) {
            var n = childNodes[i];
            if (n.nodeType == 3) {
              var html = $.trim(n.nodeValue);
              if (html) {
                html = html.replace(/&/g, '&amp;')
                  .replace(/</g, '&lt;')
                  .replace(/>/g, '&gt;')
                  .replace(url1, '$1 <a href="http://$2" style="color: white" target="_blank"> $2</a>$3')
                  .replace(url2, '$1 <a href="$2" style="color: white" target="_blank"> $2</a>$5');
                $(n).after(html).remove();
              }
            }
            else if (n.nodeType == 1 && !/^(a|button|textarea)$/i.test(n.tagName)) {
              linkThis.call(n);
            }
          }
        };

      $.fn.link = function() {
        return this.each(linkThis);
      };

      $('body').link();
    });
  }

  function addChatTyping(data) {
    data.typing = true;
    data.message = 'Клацает По Клаве';
    addChatMessage(data);
  }

  function removeChatTyping(data) {
    getTypingMessages(data).fadeOut(function() {
      $(this).remove();
    });
  }
  function addMessageElement(el, options) {
    var $el = $(el);

    if (!options) {
      options = {};
    }
    if (typeof options.fade === 'undefined') {
      options.fade = true;
    }
    if (typeof options.prepend === 'undefined') {
      options.prepend = false;
    }

    if (options.fade) {
      $el.hide().fadeIn(FADE_TIME);
    }
    if (options.prepend) {
      $messages.prepend($el);
    } else {
      $messages.append($el);
    }
    $messages[0].scrollTop = $messages[0].scrollHeight;
  }

  function cleanInput(input) {
    return $('<div/>').text(input).html();
  }

  function updateTyping() {
    if (connected) {
      if (!typing) {
        typing = true;
        socket.emit('typing');
      }
      lastTypingTime = (new Date()).getTime();

      setTimeout(function() {
        var typingTimer = (new Date()).getTime();
        var timeDiff = typingTimer - lastTypingTime;
        if (timeDiff >= TYPING_TIMER_LENGTH && typing) {
          socket.emit('stop typing');
          typing = false;
        }
      }, TYPING_TIMER_LENGTH);
    }
  }

  function getTypingMessages(data) {
    return $('.typing.message').filter(function(i) {
      return $(this).data('username') === data.username;
    });
  }

  function getUsernameColor(username) {
    var hash = 7;
    for (var i = 0; i < username.length; i++) {
      hash = username.charCodeAt(i) + (hash << 5) - hash;
    }
    var index = Math.abs(hash % COLORS.length);
    return COLORS[index];
  }


  $window.keydown(function(event) {
    if (!(event.ctrlKey || event.metaKey || event.altKey)) {
      $currentInput.focus();
    }
    if (event.which === 13) {
      if (username) {
        sendMessage();
        socket.emit('stop typing');
        typing = false;
      } else {
        setUsername();
      }
    }
  });

  $inputMessage.on('input', function() {
    updateTyping();
  });


  $loginPage.click(function() {
    $currentInput.focus();
  });

  $inputMessage.click(function() {
    $inputMessage.focus();
  });

  socket.on('login', function(data) {
    connected = true;
    var message = "";
    log(message, {
      prepend: true
    });
    addParticipantsMessage(data);
  });

  socket.on('new message', function(data) {
    addChatMessage(data);
  });

  socket.on('user joined', function(data) {
    log(data.username + ' joined');
    addParticipantsMessage(data);
  });

  socket.on('user left', function(data) {
    log(data.username + 'Ушёл От Вас');
    addParticipantsMessage(data);
    removeChatTyping(data);
  });

  socket.on('typing', function(data) {
    addChatTyping(data);
  });

  socket.on('stop typing', function(data) {
    removeChatTyping(data);
  });

  socket.on('disconnect', function() {
    log('you have been disconnected');
  });

  socket.on('reconnect', function() {
    log('you have been reconnected');
    if (username) {
      socket.emit('add user', username);
    }
  });

  socket.on('reconnect_error', function() {
    log('attempt to reconnect has failed');
  });

});
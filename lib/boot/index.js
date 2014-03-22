
/**
 * Module dependencies.
 */

var messageInput = require('message-input');
var Connection = require('connection');
var shortcuts = require('shortcuts');
var settings = require('settings');
var settingsDialog = require('settings/dialog');
var Plugin = require('plugin');
var gui = node('nw.gui');
var log = require('log');

// XXX: most of this file is temporary junk
// until connection/channel management is added

var shortcuts = require('shortcuts');

shortcuts.bind('m', 'focus message input', function(e){
  e.preventDefault();
  input.el.focus();
});

shortcuts.bind('command + r', 'refresh the page', function(){ location.reload() });
shortcuts.bind('command + C', 'show connections', function(){});
shortcuts.bind('command + c', 'show channels', function(){});
shortcuts.bind('command + s', 'show settings', function(){
  settingsDialog.toggle();
});
shortcuts.bind('command + u', 'show users', function(){});
shortcuts.bind('command + k', 'clear chat log', function(){
  var focusedConnection = Connection.focused;
  var focusedChannel = focusedConnection.focused;
  focusedChannel.clearMessages();
});

shortcuts.bind('command + [', 'focus prev channel', function(){
  Connection.focused.focusPrevChannel();
});

shortcuts.bind('command + ]', 'focus next channel', function(){
  Connection.focused.focusNextChannel();
});

shortcuts.bind('shift + /', 'toggle this dialog', function(){
  shortcuts.toggle();
});

//shortcuts.show();

// window

var win = gui.Window.get();

// bootstrap

require('blur');
require('titlebar');

// load light theme

var theme = new Plugin({
  name: 'light',
  log: log
});

theme.load();

// initialize connections

settings.connections.forEach(function(opts){
  log.info('connect to %s:%s', opts.host, opts.port);

  opts.log = log;
  var conn = new Connection(opts);
  conn.connect();

  var channels = opts.channels || [];
  channels.forEach(function(channel){
    conn.join(channel);
  });
});

var input = messageInput(document.querySelector('#message-input'));

input.on('input', function(msg){
  msg = msg.trim();
  if (!msg) return;

  var conn = Connection.focused;
  var chan = Connection.focusedChannel;

  conn.send(chan.name, msg); // TODO: add chan.send()
});

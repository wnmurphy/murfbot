#! /usr/local/bin/node
'use strict'

var Botkit = require('botkit');
var Scrape = require('scrape');
var controller = Botkit.slackbot({
  debug: false
});
var api_token = 'REPLACE_STRING_WITH_YOUR_SLACK_API_TOKEN';

var params = {
  keywords : [
    'documentation',
    'docs',
    'Apiary',
    'apiary',
    'integration',
    'client_id',
    'client id',
    'client ID',
    'client secret'
  ],
  triggerEvents : [
    'message_received',
    'ambient',
    'direct_mention',
    'mention',
    'direct_message'
  ]
};

var keywords = {
  naughtyWords : [
    'fuck',
    'shit',
    'asshole',
    '\ ass\ ',
    'bitch',
    'fucker',
    'motherfucker',
    'damn',
    'dammit',
    'damn it'
  ],
  murfbotResponses : [
    'huh?',
    'what?',
    'what\'d you say?',
    'sorry, what?',
    'what is it now?',
    'didn\'t catch that... huh?'
  ],
  profanityResponses : [
    'How rude.',
    'Your words offend my gentle roboty senses.',
    'Whoa, buddy! Who invited the gosh-dang cursemonster?',
    'Watch yo mouf. I have tiny little robot ears.',
    'I\'m telling on you.',
    'I\'m gonna tell your mother!'
  ],
  // Store fun responses on mention of friends' names.
  friendResponses : {
    emily: [
      'Oh what a kahYOOtie!',
      'Snuggles... are for winners...',
      'My favorite inconvenience',
      'mew mew mew mew',
      'I heard she once took a shower with socks on, just to see.',
      'Raise your hand if you\'ve never tried cat food.'
    ],
    dan: [
      'Save Meshuggah for leg day.',
      'Shubbi Boutrite.',
      'FEED ME A STRAY CAT.',
      'https://www.youtube.com/watch?v=HAljRRV4JyI',
      'Reticulating splines...'
    ],
    courtney: [
      'Spin spin spin spin spin...',
      'She\'s crafty!',
      'Cuddle puddle!!!',
      'Wubba wubba wubba',
      'I have heard tell of this Courtney of which you speak.'
    ],
    neil: [
      'Well, actually...',
      'Hey! Did someone mention medicinal mushrooms?',
      'https://www.youtube.com/watch?v=wBqM2ytqHY4',
      'Well slap muh butt and call me Nancy!',
      'His mom fondly calls him "problematic."'
    ]
  }
};

controller.spawn({
  token: api_token
}).startRTM();


// Handle responses for whenever any of Neil's work-related keywords are mentioned.
//  This is a POC for the bot I wanted to make for work.
controller.hears(params.keywords, 'ambient', function(bot, message){
  bot.reply(message, 'Murfbot heard your message.');
});


// Handle fun random responses.
controller.hears('Emily', params.triggerEvents, function(bot, message){
  bot.reply(message, keywords.friendResponses.emily[randomIndex(keywords.friendResponses.emily)]);
});
controller.hears('Dan', params.triggerEvents, function(bot, message){
  bot.reply(message, keywords.friendResponses.dan[randomIndex(keywords.friendResponses.dan)]);
});
controller.hears('Courtney', params.triggerEvents, function(bot, message){
  bot.reply(message, keywords.friendResponses.courtney[randomIndex(keywords.friendResponses.courtney)]);
});
controller.hears('Neil', params.triggerEvents, function(bot, message){
  bot.reply(message, keywords.friendResponses.neil[randomIndex(keywords.friendResponses.neil)]);
});

// Handle naughty words
controller.hears(keywords.naughtyWords, params.triggerEvents, function(bot, message){
  bot.reply(message, keywords.profanityResponses[randomIndex(keywords.profanityResponses)]);
});

// Someone mentions murfbot
controller.hears('murfbot', params.triggerEvents, function(bot, message){
  bot.reply(message, keywords.murfbotResponses[randomIndex(keywords.murfbotResponses)]);
});

var availableCommands = 
'_When murfbot hears_: \n' +
'*meshuggah*: drops a random meshuggah video in the channel\n' +
'*someone\'s name*: says something fun and random\n' +
'`@murfbot` _commands_: \n' +
'*stats*: see uptime for current run in seconds\n' +
'*help*: see this list';

// Print a list of commands.
controller.hears('help', 'direct_mention', function(bot, message){
  bot.reply(message, availableCommands);
});

// Print uptime in seconds.
controller.hears('stats', 'direct_mention', function(bot, message){
  bot.reply(message, 'Murfbot has been running for ' + process.uptime() + ' seconds.');
});

// Handle serving up a Meshuggah video
controller.hears('Meshuggah', params.triggerEvents, function(bot,message) {
  Scrape.request('https://www.youtube.com/user/Meshuggah', function (err, $) {
    if (err) return console.error(err);
    var videos = $('.channels-content-item .yt-uix-tile-link');
    // ^ Returns array of video objects
    var video = videos[randomIndex(videos)]
    var url = "https://youtube.com" + video.attribs.href;
    bot.reply(message, url);
  });
});

controller.on('direct_mention', function(bot, message){
  bot.reply(message, 'Hey! I\'m Murfbot. See a list of commands so far with *@murfbot help*');
});

// Get random index.
function randomIndex (arr) {
  return Math.floor(Math.random() * arr.length);
}


/** Notes
  
An example message object:
{
  "type": "message",
  "channel": "U024BE7LH",
  "user": "R143CD7MP ",
  "text": "lunchtime now!",
  "ts": "1450416257.000003",
  "team": "F038DHKHK",
  "event": "direct_message"
}

*/
'use strict';

var natural = require('natural');

var ALPHANUM = /^\w+$/gi;
var LINK = /^http/i;

exports.generate = function (text) {
  var tokenizer = new natural.RegexpTokenizer({ pattern: /\s/ });

  var words = tokenizer.tokenize(text);
  var newText = [];
  console.log(text);
  //console.log(words);
  for (var i = 0; i < words.length; i ++) {
    var currWord = words[i];

    if (currWord.match(LINK)) {
      newText.push('<a href="' + currWord + '" target="_blank">' + currWord + '</a>');
    } else if (currWord.length > 2) {
      newText.push('<a href="/search/' + currWord.replace(/[^\w]/gi, '') +
        '" class="tag">' + currWord + '</a>');
    } else {
      newText.push(currWord);
    }
  }

  return newText.join(' ');
};

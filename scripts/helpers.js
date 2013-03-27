function createCorrectionMailURL(question) {
  var result = 'mailto:retroflections@hanoulle.be';
  result += '?subject=Retroflection corrected question&body=';
  result += escape('I have a proposal on improving the spelling of retroflection question '
    + question.id + ': \n' + '"' + question.question + '" by ' + question.author);
  result += encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n'
    + 'This retroflection was originally twittered by @retroflection'
    + '\nand is sent via the retroflection app available at http://retroflection.org');
  return result;
}

function createMailURL(question) {
  var result = 'mailto:?subject=Retroflection Question ' + question.id + '&body=';
  result += escape('"' + question.question + '"' + ' by ' + question.author);
  result += encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection'
    + '\nand is sent via the retroflection app available at http://retroflection.org');
  return result;
}

function createCorrectionMailURL(question) {
  return 'mailto:retroflections@hanoulle.be' +
    '?subject=Retroflection corrected question' +
    '&body=' + escape('I have a proposal on improving the spelling of retroflection question ' + question.number +
    ': \n' + '"' + question.question + '"' + ' by ' + question.author) +
    encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
      'This retroflection was originally twittered by @retroflection' +
      '\nand is sent via the retroflection app available at http://retroflection.org');
}

function createMailURL(question) {
  return 'mailto:?subject=Retroflection Question ' + question.number +
    '&body=' + escape('"' + question.question + '"' + ' by ' + question.author) +
    encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
      '\nand is sent via the retroflection app available at http://retroflection.org');
}

/*global retroflectionVersion */
/*eslint-env browser */
/*eslint no-unused-vars: 0 */
'use strict';

var React = require('react');
var Link = require('react-router').Link;

module.exports.Buttons = React.createClass({
  render: function () {
    var activeButton = this.props.for;

    function buttonClassName(buttonname) {
      return 'tab-item' + (activeButton === buttonname ? ' active' : '');
    }

    return <nav className="bar bar-tab">
      <Link className={buttonClassName('authors')} to="authors">
        <span className="icon icon-person"></span>
        <span className="tab-label">Authors</span>
      </Link>
      <Link className={buttonClassName('question')} to="question" params={{id: this.props.questions.next()}}>
        <span className="icon icon-refresh"></span>
        <span className="tab-label">Random</span>
      </Link>
      <Link className={buttonClassName('about')} to="about">
        <span className="icon icon-info"></span>
        <span className="tab-label">About</span>
      </Link>
    </nav>;
  }
});

module.exports.Twitterlink = React.createClass({
  render: function () {
    var lastauthor = this.props.authors[this.props.authors.length - 1];
    return <span>
        {this.props.authors.map(function (author) {
          return <span key={author}>
            <a href={'http://twitter.com/' + author.substr(1)}>{author}</a> {lastauthor !== author ? ' & ' : ''}
          </span>;
        })}
      </span>;
  }
});

module.exports.mailtoForCorrection = function (question) {
  return question ? 'mailto:retroflections@hanoulle.be?subject=Retroflection corrected question&body=' +
  encodeURI('I have a proposal on improving the spelling of retroflection question ' +
    question.id + ': \n' + '"' + question.question + '" by ' + question.author) +
  encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
    'This retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
};

module.exports.mailtoForQuestion = function (question) {
  return question ? 'mailto:?subject=Retroflection Question ' + question.id + '&body=' +
  encodeURI('"' + question.question + '"' + ' by ' + question.author) +
  encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
};

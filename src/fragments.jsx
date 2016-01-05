/*eslint no-unused-vars: 0 */
'use strict';

var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var questionsStore = require('./questionsStore').store;
var questionsTemplate = require('./questionsStore').template;

var nextNumber = 0;

function questionListenerTemplate(configuration) {
  return React.createClass(_.assign(configuration, questionsTemplate()));
}

module.exports.questionListenerTemplate = questionListenerTemplate;

module.exports.Buttons = React.createClass({
  componentDidMount: function () { questionsStore.addChangeListener(this.onChange); },
  componentWillUnmount: function () { questionsStore.removeChangeListener(this.onChange); },
  onChange: function () {
    nextNumber = questionsStore.service().next();
  },
  propTypes: {for: React.PropTypes.string.isRequired},
  render: function () {
    var self = this;

    function buttonClassName(buttonname) {
      return 'tab-item' + (self.props.for === buttonname ? ' active' : '');
    }

    return <nav className='bar bar-tab'>
      <Link className={buttonClassName('authors')} to='/authors'>
        <span className='icon icon-person'></span>
        <span className='tab-label'>Authors</span>
      </Link>
      <Link className={buttonClassName('question')} to={'/question/' + nextNumber} onClick={function() { self.onChange(); }}>
        <span className='icon icon-refresh'></span>
        <span className='tab-label'>Random</span>
      </Link>
      <Link className={buttonClassName('about')} to='/about'>
        <span className='icon icon-info'></span>
        <span className='tab-label'>About</span>
      </Link>
    </nav>;
  }
});

module.exports.Twitterlink = React.createClass({
  propTypes: {authors: React.PropTypes.array.isRequired},
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

/*eslint no-unused-vars: 0 */
'use strict';

var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var store = require('./questionsStore').store;

var nextNumber = 0;

class RetroPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.service();
    this.listener = this.onChange.bind(this);
  }

  componentDidMount() { store.addChangeListener(this.listener); }

  componentWillUnmount() { store.removeChangeListener(this.listener); }

  onChange() { this.setState(store.service()); }
}

class Buttons extends RetroPage {
  onChange() { super.onChange(); nextNumber = this.state.next(); }

  render() {
    let self = this;

    return <nav className='bar bar-tab'>
      <Link className={'tab-item' + (self.props.for === 'authors' ? ' active' : '')} to='/authors'>
        <span className='icon icon-person'></span>
        <span className='tab-label'>Authors</span>
      </Link>
      <Link className={'tab-item' + (self.props.for === 'question' ? ' active' : '')} to={`/question/${nextNumber}`}
            onClick={function() { self.onChange(); }}>
        <span className='icon icon-refresh'></span>
        <span className='tab-label'>Random</span>
      </Link>
      <Link className='tab-item' to='/about' activeClassName="active">
        <span className='icon icon-info'></span>
        <span className='tab-label'>About</span>
      </Link>
    </nav>;
  }
}
Buttons.propTypes = {for: React.PropTypes.string.isRequired};


class Twitterlink extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    var lastauthor = this.props.authors[this.props.authors.length - 1];
    return <span>
        {this.props.authors.map(function (author) {
          return <span key={author}>
            <a href={'http://twitter.com/' + author.substr(1)}>{author}</a> {lastauthor !== author ? ' & ' : ''}
          </span>;
        })}
      </span>;
  }
}
Twitterlink.propTypes = {authors: React.PropTypes.array.isRequired};

function mailtoForCorrection(question) {
  return question ? 'mailto:retroflections@hanoulle.be?subject=Retroflection corrected question&body=' +
  encodeURI('I have a proposal on improving the spelling of retroflection question ' +
    question.id + ': \n' + '"' + question.question + '" by ' + question.author) +
  encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
    'This retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
}

function mailtoForQuestion(question) {
  return question ? 'mailto:?subject=Retroflection Question ' + question.id + '&body=' +
  encodeURI('"' + question.question + '"' + ' by ' + question.author) +
  encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
}

module.exports.RetroPage = RetroPage;
module.exports.Buttons = Buttons;
module.exports.Twitterlink = Twitterlink;
module.exports.mailtoForCorrection = mailtoForCorrection;
module.exports.mailtoForQuestion = mailtoForQuestion;

import React from 'react';
import { Link } from 'react-router';
import { questionsService, addChangeListener, removeChangeListener } from './questionsStore';

export class RetroPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = questionsService;
    this.listener = this.onChange.bind(this);
  }

  componentDidMount() { addChangeListener(this.listener); }

  componentWillUnmount() { removeChangeListener(this.listener); }

  onChange() {
    let partialState = questionsService;
    this.setState(partialState); }
}

export class Buttons extends RetroPage {
  constructor(props) {
    super(props);
    this.nextNumber = this.state.next();
  }

  onChange() {
    super.onChange();
    this.nextNumber = this.state.next();
  }

  render() {
    return <nav className='bar bar-tab'>
      <Link className={'tab-item' + (this.props.for === 'authors' ? ' active' : '')} to='/authors'>
        <span className='icon icon-person'></span>
        <span className='tab-label'>Authors</span>
      </Link>
      <Link className={'tab-item' + (this.props.for === 'question' ? ' active' : '')}
            to={`/question/${this.nextNumber || ''}`} onClick={this.listener}>
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

export class Header extends React.Component {
  render() {
    return <header className='bar bar-nav'>
      <h1 className='title'>{this.props.title}</h1>
    </header>;
  }
}
Header.propTypes = {title: React.PropTypes.string.isRequired};

export class Twitterlink extends React.Component {
  render() {
    const lastauthor = this.props.authors[this.props.authors.length - 1];
    return <span>
        {this.props.authors.map(author =>
          <span key={author}>
            <a href={'http://twitter.com/' + author.substr(1)}>{author}</a> {lastauthor !== author ? ' & ' : ''}
          </span>
        )}
      </span>;
  }
}
Twitterlink.propTypes = {authors: React.PropTypes.array.isRequired};

export function mailtoForCorrection(question) {
  return question ? 'mailto:retroflections@hanoulle.be?subject=Retroflection corrected question&body=' +
  encodeURI('I have a proposal on improving the spelling of retroflection question ' +
    question.id + ': \n' + '"' + question.question + '" by ' + question.author) +
  encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
    'This retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
}

export function mailtoForQuestion(question) {
  return question ? 'mailto:?subject=Retroflection Question ' + question.id + '&body=' +
  encodeURI('"' + question.question + '"' + ' by ' + question.author) +
  encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
    '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
}

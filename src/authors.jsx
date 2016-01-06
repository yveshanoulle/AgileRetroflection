/*eslint no-unused-vars: 0 */

'use strict';
var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var fragments = require('./fragments.jsx');
var store = require('./questionsStore').store;
var currentAuthorStore = require('./currentAuthorStore');

class AuthorLi extends React.Component {
  render() {
    var author = this.props.author;
    return <li className='table-view-cell'>
      <Link className='navigate-right' to={`/authors/${encodeURIComponent(author.name)}`}>
        <span className='badge'>{author.questions.length}</span> {author.name}
      </Link>
    </li>;
  }
}
AuthorLi.propTypes = {author: React.PropTypes.object.isRequired};

class Header extends React.Component {
  render() {
    return <header className='bar bar-nav'>
      <h1 className='title'>{this.props.title}</h1>
    </header>;
  }
}
Header.propTypes = {title: React.PropTypes.string.isRequired};

class AuthorsPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.service();
    this.listener = this.onChange.bind(this);
  }

  componentDidMount() { store.addChangeListener(this.listener); }

  componentWillUnmount() { store.removeChangeListener(this.listener); }

  onChange() { this.setState(store.service()); }

  render() {
    return <div>
      <Header title='Authors'/>

      <div className='content'>
        <ul className='table-view'>
          {this.state.authors.all.map(function (author) {
            return <AuthorLi key={author.name} author={author}/>;
          })}
        </ul>
      </div>
      <fragments.Buttons for='authors'/>
    </div>;
  }
}

class AuthorPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.service();
    this.listener = this.onChange.bind(this);
  }

  componentDidMount() { currentAuthorStore.addChangeListener(this.listener); }

  componentWillUnmount() { currentAuthorStore.removeChangeListener(this.listener); }

  onChange() { this.setState(store.service()); }

  render() {
    let author = currentAuthorStore.authorNamed(this.props.params.name);
    return <div>
      <Header title={author.name || ''}/>

      <div className='content'>
        <ul className='table-view'>
          {author.questions.map(function (question) {
            return <li key={question.id} className='table-view-cell'>
              {question.question} <Link style={{display: 'inline'}} to='question' params={{id: question.id}}>
              <small>(#{question.id})</small>
            </Link>
              <a href={fragments.mailtoForCorrection(question)} className='btn icon icon-edit'
                 style={{padding: '0px'}}/>
            </li>;
          })}
        </ul>
      </div>
      <fragments.Buttons for='authors'/>
    </div>;
  }
}

module.exports.AuthorsPage = AuthorsPage;
module.exports.AuthorPage = AuthorPage;

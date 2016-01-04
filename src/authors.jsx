/*eslint no-unused-vars: 0 */

'use strict';
var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var fragments = require('./fragments.jsx');
var questionsStore = require('./questionsStore').store;
var currentAuthorStore = require('./currentAuthorStore');
var appMechanics = require('./appMechanics');

var AuthorLi = React.createClass({
  propTypes: {author: React.PropTypes.object.isRequired},
  render: function () {
    var author = this.props.author;
    return <li className='table-view-cell'>
      <Link className='navigate-right' to='author' params={{name: encodeURIComponent(author.name)}}>
        <span className='badge'>{author.questions.length}</span> {author.name}
      </Link>
    </li>;
  }
});

var Header = React.createClass({
  propTypes: {title: React.PropTypes.string.isRequired},
  render: function () {
    return <header className='bar bar-nav'>
      <h1 className='title'>{this.props.title}</h1>
    </header>;
  }
});

module.exports.AuthorsPage = React.createClass({
  getInitialState: function () { return questionsStore.service(); },
  componentDidMount: function () { questionsStore.addChangeListener(this.onChange); },
  componentWillUnmount: function () { questionsStore.removeChangeListener(this.onChange); },
  onChange: function () { this.setState(questionsStore.service()); },
  render: function () {
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
});

module.exports.AuthorPage = React.createClass({
  componentDidMount: function () { currentAuthorStore.addChangeListener(this.onChange); },
  componentWillUnmount: function () { currentAuthorStore.removeChangeListener(this.onChange); },
  onChange: function () { this.forceUpdate(); },
  render: function () {
    var author = currentAuthorStore.authorNamed(this.props.params.name);
    return <div>
      <Header title={author.name}/>

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
});

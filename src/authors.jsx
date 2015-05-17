/*eslint no-unused-vars: 0 */

'use strict';
var _ = require('lodash');
var React = require('react');
var Link = require('react-router').Link;
var fragments = require('./fragments.jsx');
var questionsStore = require('./questionsStore');

module.exports.AuthorsPage = React.createClass({
  getInitialState: function () {
    return questionsStore.service();
  },
  componentDidMount: function () {
    questionsStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    questionsStore.removeChangeListener(this.onChange);
  },
  onChange: function () {
    this.setState(questionsStore.service());
  },
  render: function () {
    var questions = this.state;

    return <div>
      <header className="bar bar-nav">
        <h1 className="title">Authors</h1>
      </header>
      <div className="content">
        <ul className="table-view">
          {questions.authors.all.map(function (author) {
            return <li key={author.name} className="table-view-cell">
              <Link className="navigate-right" to="author" params={{name: encodeURIComponent(author.name)}}>
                <span className="badge">{author.questions.length}</span> {author.name}
              </Link>
            </li>;
          })}
        </ul>
      </div>
      <fragments.Buttons for="authors" questions={questions}/>
    </div>;
  }
});

module.exports.AuthorPage = React.createClass({
  getInitialState: function () {
    return questionsStore.service();
  },
  componentDidMount: function () {
    questionsStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function() {
    questionsStore.removeChangeListener(this.onChange);
  },
  onChange: function () {
    this.setState(questionsStore.service());
  },
  render: function () {
    var
      questions = this.props.questions,
      name = decodeURIComponent(this.props.params.name),
      author = questions.authorNamed(name) || {questions: []};
    return <div>
      <header className="bar bar-nav">
        <h1 className="title">{name}</h1>
      </header>
      <div className="content">
        <ul className="table-view">
          {author.questions.map(function (question) {
            return <li key={question.id} className="table-view-cell">
              {question.question} <Link style={{display: 'inline'}} to="question" params={{id: question.id}}>
              <small>(#{question.id})</small>
            </Link>
              <a href={fragments.mailtoForCorrection(question)} className="btn icon icon-edit"
                 style={{padding: '0px'}}/>
            </li>;
          })}
        </ul>
      </div>
      <fragments.Buttons for="authors" questions={questions}/>
    </div>;
  }
});

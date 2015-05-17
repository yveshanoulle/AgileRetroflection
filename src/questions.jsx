/*eslint no-unused-vars: 0 */
'use strict';

var _ = require('lodash');
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var fragments = require('./fragments.jsx');
var questionsStore = require('./questionsStore');
var appMechanics = require('./appMechanics');

module.exports.QuestionPage = React.createClass({
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
    this.forceUpdate();
  },
  render: function () {
    var questions = this.state,
      id = this.props.params.id || questions.next().toString(),
      current = _.find(questions.all, {'id': id}) || {author: '', id: '', date: ''};

    return <div>
      <header className="bar bar-nav">
        <button className="btn btn-link btn-nav pull-left">
          <a href={fragments.mailtoForCorrection(current)}> <span className="icon icon-edit"></span> Correct It </a>
        </button>
        <button className="btn btn-link btn-nav pull-right">
          <a href={fragments.mailtoForQuestion(current)}> Mail <span className="icon icon-compose"></span> </a>
        </button>
        <h1 className="title">Retroflection</h1>
      </header>
      <div className="content">
        <h3 className="question">{current.question}</h3>

        <p className="author">
          <fragments.Twitterlink authors={current.author.match(/@(\w+)/g) || []}/>
          (#{current.id} - {current.date})
        </p>
      </div>
      <fragments.Buttons for="question" questions={questions}/>
    </div>;
  }
});

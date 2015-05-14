/*eslint no-unused-vars: 0 */
'use strict';

var _ = require('lodash');
var React = require('react');
var RouteHandler = require('react-router').RouteHandler;
var fragments = require('./fragments.jsx');
var questionsStore = require('./questionsStore');
var appCallbackID;

questionsStore.loadQuestions();

module.exports.app = React.createClass({
  getInitialState: function () {
    return questionsStore.service();
  },
  componentDidMount: function () {
    var self = this;
    appCallbackID = questionsStore.appDispatcher.register(function () {
      self.setState(questionsStore.service());
    });
  },
  componentWillUnmount: function() {
    questionsStore.appDispatcher.removeChangeListener(appCallbackID);
  },
  render: function () {
    return <RouteHandler questions={this.state}/>;
  }
});

module.exports.QuestionPage = React.createClass({
  render: function () {
    var questiones = this.props.questions,
      id = this.props.params.id || questiones.next().toString(),
      current = _.find(questiones.all, {'id': id}) || {author: '', id: '', date: ''};

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
      <fragments.Buttons for="question" questions={questiones}/>
    </div>;
  }
});

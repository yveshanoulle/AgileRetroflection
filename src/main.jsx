/*global retroflectionVersion */
'use strict';

var React = require('react');
var Router = require('react-router');
var PureRenderMixin = require('react/addons').addons.PureRenderMixin;
var QuestionPage = require('./questions.jsx').QuestionPage;
var app = require('./questions.jsx').app;
var authors = require('./authors.jsx');
var fragments = require('./fragments.jsx');

var About = React.createClass({
  mixins: [PureRenderMixin],
  propTypes: {
    questions: React.PropTypes.object.isRequired
  },
  render: function () {
    var questions = this.props.questions;

    return <div>
      <header className="bar bar-nav">
        <h1 className="title">About</h1>
      </header>
      <div className="content">
        <div className="content-padded">
          <h4>Please support us by:</h4>
          <ul style={{fontSize: '14px'}}>
            <li>Adding questions on the <a
              href="https://docs.google.com/spreadsheet/viewform?formkey=dFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE6MQ"
              target="_blank">google doc</a>.
            </li>
            <li>Contributing to the code on <a href="https://github.com/yveshanoulle/AgileRetroflection"
                                               target="_blank">github</a></li>
            <li>Correcting the spelling of the questions. Just leave us a note by clicking on this icon <a
              className="icon icon-edit" style={{fontSize: 'inherit'}}></a> inside the app.
            </li>
          </ul>
          <p>Originally tweeted by <a href="http://twitter.com/retroflection">@Retroflection</a></p>

          <p>Site by <a href="http://www.twitter.com/leiderleider">@leiderleider</a></p>

          <p>Version: {retroflectionVersion}</p>

          <p>We currently feature {questions.all.length} different questions
            by {questions.authors.distinct().length} distinct authors.</p>
        </div>
      </div>
      <fragments.Buttons for="about" questions={questions}/>
    </div>;
  }
});

var routes = (
  <Router.Route handler={app}>
    <Router.Route name="question" path="/question/:id" handler={QuestionPage}/>
    <Router.Route name="random" handler={QuestionPage}/>
    <Router.Route name="authors" handler={authors.AuthorsPage}/>
    <Router.Route name="author" path="authors/:name" handler={authors.AuthorPage}/>
    <Router.Route name="about" handler={About}/>
    <Router.DefaultRoute handler={QuestionPage}/>
  </Router.Route>
);

Router.run(routes, function (Handler) {
  /*eslint no-unused-vars: 0 */
  React.render(<Handler />, document.body);
});

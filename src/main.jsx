/*global retroflectionVersion */
/*eslint no-unused-vars: 0 */

'use strict';

var React = require('react');
var Router = require('react-router');
var render = require('react-dom').render;
var PureRenderMixin = require('react-addons-pure-render-mixin');
var QuestionPage = require('./questions.jsx').QuestionPage;
var authors = require('./authors.jsx');
var fragments = require('./fragments.jsx');
var appMechanics = require('./appMechanics');
var questionsStore = require('./questionsStore').store;
var currentAuthorStore = require('./currentAuthorStore');
var Route = Router.Route;

appMechanics.initQuestions();

var About = React.createClass({
  mixins: [PureRenderMixin],
  getInitialState: function () {
    return questionsStore.service();
  },
  componentDidMount: function () {
    questionsStore.addChangeListener(this.onChange);
  },
  componentWillUnmount: function () {
    questionsStore.removeChangeListener(this.onChange);
  },
  onChange: function () {
    this.setState(questionsStore.service());
  },
  render: function () {
    var questions = this.state;

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
            by {questions.authors.distinctCount()} distinct authors.</p>
        </div>
      </div>
      <fragments.Buttons for="about"/>
    </div>;
  }
});

var App = React.createClass({
  render: function () {
    return <div>
      {this.props.children}
    </div>;
  }
});

render((
  <Router.Router history={Router.browserHistory}>
    <Route path="/" component={App}>
      <Router.IndexRoute component={QuestionPage}/>
      <Route path="question/:id" name="question" component={QuestionPage}/>
      <Route name="random" component={QuestionPage}/>
      <Route path="authors" name="authors" component={authors.AuthorsPage}/>
      <Route path="authors/:name" name="author" component={authors.AuthorPage}/>
      <Route path="about" component={About}/>
    </Route>
  </Router.Router>
), document.getElementById('retroflection'));


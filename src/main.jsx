/*global retroflectionVersion */
/*eslint no-unused-vars: 0 */

'use strict';

var React = require('react');
var ReactRouter = require('react-router');
var render = require('react-dom').render;
var QuestionPage = require('./questions.jsx').QuestionPage;
var authors = require('./authors.jsx');
var fragments = require('./fragments.jsx');
var appMechanics = require('./appMechanics');

var Route = ReactRouter.Route;
var Router = ReactRouter.Router;

appMechanics.initQuestions();

class About extends fragments.RetroPage {
  render() {
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
}

class App extends React.Component {
  render () {
    return <div>
      {this.props.children}
    </div>;
  }
}

render((
  <Router history={ReactRouter.browserHistory}>
    <Route path="/" component={App}>
      <Router.IndexRoute component={QuestionPage}/>
      <Route path="question/:id" component={QuestionPage}/>
      <Route name="random" component={QuestionPage}/>
      <Route path="authors" component={authors.AuthorsPage}/>
      <Route path="authors/:name" component={authors.AuthorPage}/>
      <Route path="about" component={About}/>
    </Route>
  </Router>
), document.getElementById('retroflection'));


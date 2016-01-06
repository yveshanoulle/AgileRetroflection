/*global retroflectionVersion */
/*eslint no-unused-vars: 0 */

import React from 'react';
import { Route, Router, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';
import { QuestionPage } from './questions.jsx';
import { AuthorsPage, AuthorPage } from './authors.jsx';
import { Buttons, RetroPage } from './fragments.jsx';
import { initQuestions } from './appMechanics';

initQuestions();

class About extends RetroPage {
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
      <Buttons for="about"/>
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
  <Router history={browserHistory}>
    <Route path="/" component={App}>
      <IndexRoute component={QuestionPage}/>
      <Route path="question/:id" component={QuestionPage}/>
      <Route name="random" component={QuestionPage}/>
      <Route path="authors" component={AuthorsPage}/>
      <Route path="authors/:name" component={AuthorPage}/>
      <Route path="about" component={About}/>
    </Route>
  </Router>
), document.getElementById('retroflection'));


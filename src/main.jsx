/*global retroflectionVersion */

import React from 'react';
import { Route, Router, Link, IndexRoute, browserHistory } from 'react-router';
import { render } from 'react-dom';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

import { Buttons, RetroPage, Header, Twitterlink, mailtoForCorrection, mailtoForQuestion } from './fragments.jsx';
import { authorNamed, initQuestions } from './questionsStore';

initQuestions();

class AboutPage extends RetroPage {
  render() {
    const questions = this.state;

    return <div>
      <Header title='About'/>
      <ReactCSSTransitionGroup transitionName='standard' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key='about'>
          <div className='dummy40'>&nbsp;</div>
          <div className='content-padded'>
            <h4>Please support us by:</h4>
            <ul style={{fontSize: '14px'}}>
              <li>Adding questions on the <a
                href='https://docs.google.com/spreadsheet/viewform?formkey=dFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE6MQ'
                target='_blank'>google doc</a>.
              </li>
              <li>Contributing to the code on <a href='https://github.com/yveshanoulle/AgileRetroflection'
                                                 target='_blank'>github</a></li>
              <li>Correcting the spelling of the questions. Just leave us a note by clicking on this icon <a
                className='icon icon-edit' style={{fontSize: 'inherit'}}></a> inside the app.
              </li>
            </ul>
            <p>Originally tweeted by <a href='http://twitter.com/retroflection'>@Retroflection</a></p>
            <p>Site by <a href='http://www.twitter.com/leiderleider'>@leiderleider</a></p>
            <p>Version: {retroflectionVersion}</p>
            <p>We currently feature {questions.all.length} different questions
              by {questions.authors.distinctCount()} distinct authors.</p>
          </div>
        </div>
      </ReactCSSTransitionGroup>
      <Buttons for='about'/>
    </div>;
  }
}

class QuestionPage extends RetroPage {
  render() {
    const current = this.state.questionFor(this.props.params.id);

    return <div>
      <header className='bar bar-nav'>
        <button className='btn btn-link btn-nav pull-left'>
          <a href={mailtoForCorrection(current)}> <span className='icon icon-edit'></span> Correct It </a>
        </button>
        <button className='btn btn-link btn-nav pull-right'>
          <a href={mailtoForQuestion(current)}> Mail <span className='icon icon-compose'></span> </a>
        </button>
        <h1 className='title'>Retroflection</h1>
      </header>
      <ReactCSSTransitionGroup transitionName="retro-right" transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key={current.id}>
          <h3 className='question'>{current.question}</h3>
          <p className='author'>
            <Twitterlink authors={this.state.authornameToArray(current.author)}/>
            (#{current.id} - {current.date})
          </p>
        </div>
      </ReactCSSTransitionGroup>
      <Buttons for='question'/>
    </div>;
  }
}

class AuthorLi extends React.Component {
  render() {
    let author = this.props.author;
    return <li className='table-view-cell'>
      <Link className='navigate-right' to={`/authors/${encodeURIComponent(author.name)}`}>
        <span className='badge'>{author.questions.length}</span> {author.name}
      </Link>
    </li>;
  }
}
AuthorLi.propTypes = {author: React.PropTypes.object.isRequired};

class AuthorsPage extends RetroPage {
  render() {
    return <div>
      <Header title='Authors'/>
      <ReactCSSTransitionGroup transitionName='standard' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key='authors'>
          <div className='dummy22'>&nbsp;</div>
          <ul className='table-view'>
            {this.state.authors.all.map(author => <AuthorLi key={author.name} author={author}/>)}
          </ul>
        </div>
      </ReactCSSTransitionGroup>
      <Buttons for='authors'/>
    </div>;
  }
}

class QuestionLi extends React.Component {
  render() {
    let question = this.props.question;
    return <li className='table-view-cell'>
      {question.question} <Link style={{display: 'inline'}} to='question' params={{id: question.id}}>
      <small>(#{question.id})</small>
    </Link>
      <a href={mailtoForCorrection(question)} className='btn icon icon-edit'
         style={{padding: '0px'}}/>
    </li>;
  }
}
QuestionLi.propTypes = {question: React.PropTypes.object.isRequired};

export class AuthorPage extends RetroPage {
  render() {
    let author = authorNamed(this.props.params.name);
    return <div>
      <Header title={author.name || ''}/>
      <ReactCSSTransitionGroup transitionName='retro-right' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key={author.name}>
          <div className='dummy22'>&nbsp;</div>
          <ul className='table-view'>
            {author.questions.map(question => <QuestionLi key={question.id} question={question}/>)}
          </ul>
        </div>
      </ReactCSSTransitionGroup>
      <Buttons for='authors'/>
    </div>;
  }
}

class App extends React.Component {
  render() {
    return <div>
      {this.props.children}
    </div>;
  }
}

render((
  <Router history={browserHistory}>
    <Route path='/' component={App}>
      <IndexRoute component={QuestionPage}/>
      <Route path='question/:id' component={QuestionPage}/>
      <Route path='authors' component={AuthorsPage}/>
      <Route path='authors/:name' component={AuthorPage}/>
      <Route path='about' component={AboutPage}/>
    </Route>
  </Router>
), document.getElementById('retroflection'));


/*global retroflectionVersion */

const React = require('react');
const {Route, Router, Link, IndexRoute, browserHistory} = require('react-router');
const PropTypes = require('prop-types');

const render = require('react-dom').render;
const ReactCSSTransitionGroup = require('react-addons-css-transition-group');

const {Buttons, RetroPage, Header, Twitterlink, Realnames, mailtoForCorrection} = require('./fragments.jsx');

const questionsStore = require('./questionsStore');

class AboutPage extends RetroPage {
  render() {
    const questions = this.state;

    return <div>
      <Header title='About' noForward='true'/>
      <ReactCSSTransitionGroup transitionName='standard' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key='about'>
          <div className='dummy40'>&nbsp;</div>
          <div className='content-padded'>
            <h4>Please support us by:</h4>
            <ul style={{fontSize: '14px'}}>
              <li>Contributing to the code on <a href='https://github.com/yveshanoulle/AgileRetroflection'
                                                 target='_blank' rel='noopener noreferrer'>github</a></li>
              <li>Correcting the spelling of the questions. Just leave us a note by clicking on this icon <a
                className='icon icon-edit' style={{fontSize: 'inherit'}}></a> inside the app.
              </li>
            </ul>
            <p>Originally tweeted by <a href='http://twitter.com/retroflection'>@Retroflection</a></p>
            <p>Site by <a href='http://www.twitter.com/leiderleider'>@leiderleider</a></p>
            <p>Version: {retroflectionVersion}</p>
            <p>We feature {questions.all.length} different questions
              by {questions.authors.distinctAuthors().length} distinct authors.</p>
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
    const authors = this.state.authornameToArray(current.author);
    const realnames = authors.map(author => this.state.authorNamed(author).realname);
    return <div>
      <Header title='Retroflection'/>
      <ReactCSSTransitionGroup transitionName="retro-right" transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key={current.id}>
          <h3 className='question'>{current.question}</h3>
          <p className='author'>
            <b><Realnames authors={realnames}/>({current.date})</b><br/>
            <Twitterlink authors={authors}/> (#{current.id})
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
    return <li className='table-view-cell media'>
      <Link className='navigate-right' to={`/authors/${encodeURIComponent(author.name)}`}>
        <div className='media-object pull-left avatar'>
          <img src={this.props.image}/>
        </div>
        <div className='media-body authorname-in-list'>
          <b>{author.realname}</b><br/>
          {author.name}
        </div>
        <span className='badge'>{author.questions.length}</span>
      </Link>
    </li>;
  }
}
AuthorLi.propTypes = {author: PropTypes.object.isRequired, image: PropTypes.string};

class AuthorsPage extends RetroPage {
  render() {
    return <div>
      <Header title='Authors' noForward='true'/>
      <ReactCSSTransitionGroup transitionName='standard' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key='authors'>
          <div className='dummy22'>&nbsp;</div>
          <ul className='table-view'>
            {this.state.authors.all.map(author => <AuthorLi key={author.name} author={author}
                                                            image={author.image}/>)}
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
QuestionLi.propTypes = {question: PropTypes.object.isRequired};

class AuthorPage extends RetroPage {
  render() {
    let author = questionsStore.authorNamed(this.props.params.name);
    return <div>
      <Header title={author.realname || ''} noForward='true'/>
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

App.propTypes = {children: PropTypes.array.isRequired};

render((
  <Router history={browserHistory}>
    <Route path='/(online)' component={App}>
      <IndexRoute component={QuestionPage}/>
      <Route path='question/:id' component={QuestionPage}/>
      <Route path='authors' component={AuthorsPage}/>
      <Route path='authors/:name' component={AuthorPage}/>
      <Route path='about' component={AboutPage}/>
    </Route>
  </Router>
), document.getElementById('retroflection'));


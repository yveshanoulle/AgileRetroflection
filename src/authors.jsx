/*eslint no-unused-vars: 0 */

import React from 'react';
import { Link } from 'react-router';
import { RetroPage, Buttons, mailtoForCorrection } from './fragments.jsx';
import { store } from './questionsStore';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

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

class Header extends React.Component {
  render() {
    return <header className='bar bar-nav'>
      <h1 className='title'>{this.props.title}</h1>
    </header>;
  }
}
Header.propTypes = {title: React.PropTypes.string.isRequired};

export class AuthorsPage extends RetroPage {
  render() {
    return <div>
      <Header title='Authors'/>
      <ReactCSSTransitionGroup transitionName='standard' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key='authors'>
          <div className='dummy22'>&nbsp;</div>
          <ul className='table-view'>
            {this.state.authors.all.map((author) => {
              return <AuthorLi key={author.name} author={author}/>;
            })}
          </ul>
        </div>
      </ReactCSSTransitionGroup>
      <Buttons for='authors'/>
    </div>;
  }
}

export class AuthorPage extends RetroPage {
  render() {
    let author = store.authorNamed(this.props.params.name);
    return <div>
      <Header title={author.name || ''}/>
      <ReactCSSTransitionGroup transitionName='retro-right' transitionAppear={true}
                               transitionAppearTimeout={500} transitionEnterTimeout={500} transitionLeaveTimeout={500}>
        <div className='content' key={author.name}>
          <div className='dummy22'>&nbsp;</div>
          <ul className='table-view'>
            {author.questions.map((question) => {
              return <QuestionLi key={question.id} question={question}/>;
            })}
          </ul>
        </div>
      </ReactCSSTransitionGroup>
      <Buttons for='authors'/>
    </div>;
  }
}

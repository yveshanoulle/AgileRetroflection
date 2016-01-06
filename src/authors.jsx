/*eslint no-unused-vars: 0 */

import React from 'react';
import { Link } from 'react-router';
import { RetroPage, Buttons, mailtoForCorrection } from './fragments.jsx';
import { store } from './questionsStore';

class AuthorLi extends React.Component {
  render() {
    var author = this.props.author;
    return <li className='table-view-cell'>
      <Link className='navigate-right' to={`/authors/${encodeURIComponent(author.name)}`}>
        <span className='badge'>{author.questions.length}</span> {author.name}
      </Link>
    </li>;
  }
}
AuthorLi.propTypes = {author: React.PropTypes.object.isRequired};

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

      <div className='content'>
        <ul className='table-view'>
          {this.state.authors.all.map(function (author) {
            return <AuthorLi key={author.name} author={author}/>;
          })}
        </ul>
      </div>
      <Buttons for='authors'/>
    </div>;
  }
}

export class AuthorPage extends RetroPage {
  render() {
    let author = store.authorNamed(this.props.params.name);
    return <div>
      <Header title={author.name || ''}/>

      <div className='content'>
        <ul className='table-view'>
          {author.questions.map((question) => {
            return <li key={question.id} className='table-view-cell'>
              {question.question} <Link style={{display: 'inline'}} to='question' params={{id: question.id}}>
              <small>(#{question.id})</small>
            </Link>
              <a href={mailtoForCorrection(question)} className='btn icon icon-edit'
                 style={{padding: '0px'}}/>
            </li>;
          })}
        </ul>
      </div>
      <Buttons for='authors'/>
    </div>;
  }
}

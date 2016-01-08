/*eslint no-unused-vars: 0 */

import React from 'react';
import { Buttons, RetroPage, Twitterlink, mailtoForCorrection, mailtoForQuestion } from './fragments.jsx';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';

export class QuestionPage extends RetroPage {
  render() {
    var current = this.state.questionFor(this.props.params.id);

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
      <ReactCSSTransitionGroup transitionName="retro-left" transitionAppear={true}
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

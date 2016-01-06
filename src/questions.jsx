/*eslint no-unused-vars: 0 */
'use strict';

var _ = require('lodash');
var React = require('react');
var fragments = require('./fragments.jsx');
var store = require('./questionsStore').store;

class QuestionPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = store.service();
    this.listener = this.onChange.bind(this);
  }

  componentDidMount() { store.addChangeListener(this.listener); }

  componentWillUnmount() { store.removeChangeListener(this.listener); }

  onChange() { this.setState(store.service()); }

  render() {
    var current = this.state.questionFor(this.props.params.id);

    return <div>
      <header className='bar bar-nav'>
        <button className='btn btn-link btn-nav pull-left'>
          <a href={fragments.mailtoForCorrection(current)}> <span className='icon icon-edit'></span> Correct It </a>
        </button>
        <button className='btn btn-link btn-nav pull-right'>
          <a href={fragments.mailtoForQuestion(current)}> Mail <span className='icon icon-compose'></span> </a>
        </button>
        <h1 className='title'>Retroflection</h1>
      </header>
      <div className='content'>
        <h3 className='question'>{current.question}</h3>

        <p className='author'>
          <fragments.Twitterlink authors={this.state.authornameToArray(current.author)}/>
          (#{current.id} - {current.date})
        </p>
      </div>
      <fragments.Buttons for='question'/>
    </div>;
  }
}
module.exports.QuestionPage = QuestionPage;

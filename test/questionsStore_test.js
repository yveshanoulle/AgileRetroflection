const expect = require('must');
const sinon = require('sinon');

const questionsStore = require('../src/questionsStore');
const rawQuestions = JSON.stringify(require('../test/dummydata/test-questions.json'));
const noQuestions = '[]';

describe('the questionStore', () => {
  afterEach(() => {
    questionsStore.dispatcher.questionsLoaded(noQuestions);
  });

  it('inits the store with the received questions', () => {
    expect(questionsStore.service().all).to.have.length(0);
    questionsStore.dispatcher.questionsLoaded(rawQuestions);
    expect(questionsStore.service().all).to.have.length(15);
  });

  it('returns an author when initialized', () => {
    questionsStore.dispatcher.questionsLoaded(rawQuestions);
    expect(questionsStore.authorNamed('@Deborahh')).to.not.be.undefined();
  });

  it('informs interested parties of changes only if there have not been questions loaded before', () => {
    let listener = sinon.spy();
    questionsStore.addChangeListener(listener);
    questionsStore.dispatcher.questionsLoaded(noQuestions);
    expect(listener.called).to.be.true();
  });

  it('does not inform interested parties of changes only if there have been questions loaded before', () => {
    let listener = sinon.spy();
    questionsStore.dispatcher.questionsLoaded(rawQuestions);
    questionsStore.addChangeListener(listener);
    questionsStore.dispatcher.questionsLoaded(noQuestions);
    expect(listener.called).to.be.false();
  });

  it('allows interested parties to deregister', () => {
    let listener = sinon.spy();
    questionsStore.addChangeListener(listener);
    questionsStore.removeChangeListener(listener);
    questionsStore.dispatcher.questionsLoaded(noQuestions);
    expect(listener.called).to.be.false();
  });
});

jest.dontMock('../src/questionsStore');
jest.dontMock('../src/repo/questionsRepository');
jest.dontMock('../test/test-questions.json');

describe('the questionStore', () => {
  const questionsStore = require('../src/questionsStore');
  const rawQuestions = JSON.stringify(require('../test/dummydata/test-questions.json'));
  const noQuestions = '[]';

  it('inits the store with the received questions', () => {
    expect(questionsStore.service().all.length).toBe(0);
    questionsStore.dispatcher.questionsLoaded(rawQuestions);
    expect(questionsStore.service().all.length).toBe(15);
  });

  it('returns an author when initialized', () => {
    questionsStore.dispatcher.questionsLoaded(rawQuestions);
    expect(questionsStore.authorNamed('@Deborahh')).toBeDefined();
  });

  it('informs interested parties of changes', () => {
    let listener = jest.genMockFunction();
    questionsStore.addChangeListener(listener);
    questionsStore.dispatcher.questionsLoaded(noQuestions);
    expect(listener).toBeCalled();
  });

  it('allows interested parties to deregister', () => {
    let listener = jest.genMockFunction();
    questionsStore.addChangeListener(listener);
    questionsStore.removeChangeListener(listener);
    questionsStore.dispatcher.questionsLoaded(noQuestions);
    expect(listener).not.toBeCalled();
  });
});

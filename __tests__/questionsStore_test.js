jest.dontMock('../src/questionsStore');
jest.dontMock('../src/repo/questionsRepository');
jest.dontMock('../test/test-questions.json');

describe('the questionStore', () => {
  const questionsStore = require('../src/questionsStore');
  const callback = questionsStore.dispatcher.register.mock.calls[0][0];
  const rawQuestions = JSON.stringify(require('../test/test-questions.json'));
  const allQuestions = {
    type: questionsStore.QUESTIONS_LOADED,
    rawQuestions: rawQuestions
  };
  const noQuestions = {
    type: questionsStore.QUESTIONS_LOADED,
    rawQuestions: '[]'
  };

  it('registers a callback with the dispatcher', () => {
    expect(questionsStore.dispatcher.register.mock.calls.length).toBe(1);
  });

  it('inits the store with the received questions', () => {
    expect(questionsStore.service().all.length).toBe(0);
    callback(allQuestions);
    expect(questionsStore.service().all.length).toBe(15);
  });

  it('returns an author when initialized', () => {
    callback(allQuestions);
    expect(questionsStore.authorNamed('@Deborahh')).toBeDefined();
  });

  it('informs interested parties of changes', () => {
    let listener = jest.genMockFunction();
    questionsStore.addChangeListener(listener);
    callback(noQuestions);
    expect(listener).toBeCalled();
  });

  it('allows interested parties to deregister', () => {
    let listener = jest.genMockFunction();
    questionsStore.addChangeListener(listener);
    questionsStore.removeChangeListener(listener);
    callback(noQuestions);
    expect(listener).not.toBeCalled();
  });
});

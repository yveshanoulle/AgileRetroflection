import { Dispatcher } from 'flux';

export const dispatcher = new Dispatcher();

export const actionTypes = {
  QUESTIONS_LOADED: 'questionsLoaded'
};

export function questionsLoaded(rawQuestions) {
  dispatcher.dispatch({
    type: actionTypes.QUESTIONS_LOADED,
    rawQuestions: rawQuestions
  });
}

export function initQuestions() {
// trying to update the questions from server, fallback is local storage
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.onreadystatechange = () => {
    if (xmlhttp.readyState === XMLHttpRequest.DONE) {
      if (xmlhttp.status === 200) { localStorage.setItem('questions', xmlhttp.response); }
      questionsLoaded(localStorage.getItem('questions'));
    }
  };
  xmlhttp.open('GET', '/questions.json', true);
  xmlhttp.send();
}


var currentIndex = -1;
var questionNumbers = [];
var questions = [];

function randomQuestion() {
  questionNumbers.push(Math.floor(Math.random() * questions.length));
  currentIndex++;
}

function currentQuestionNumber() {
  if (currentIndex === -1) {
    randomQuestion();
  }
  return questionNumbers[Math.max(0, currentIndex)];
}

function currentQuestion() {
  return questions[currentQuestionNumber()];
}

function nextQuestion() {
  randomQuestion();
}

function previousQuestion() {
  if (currentIndex > 0) {
    questionNumbers.pop();
    currentIndex--;
  }
}
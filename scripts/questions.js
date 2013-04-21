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

function latestUpdate() {
  var maxUpdateTime = 0;
  if (questions) {
    questions.forEach(function (question) {
      maxUpdateTime = Math.max(maxUpdateTime, question.lastSave);
    });
  }
  return maxUpdateTime;
}

function replaceOrAddQuestions(newQuestions) {
  newQuestions.forEach(function(question) {
    var index = indexOfQuestionWithId(question.id);
    if (index > -1) {
        questions[index] = question;
    } else {
      questions.push(question);
    }
  });
}

var indexOfQuestionWithId = function (id) {
  for (var i = 0; i < questions.length; i++) {
    if (id === questions[i].id) {
      return i;
    }
  };
  return -1;
}

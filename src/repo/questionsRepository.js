// do not convert to import until node.js fully supports modules
'use strict';

const flatten = require('lodash/array/flatten');

function authornameToArray(name) { return name.match(/@(\w+)/g) || []; }

class Authors {
  constructor(questions) {
    this.all = [];

    // React does not reliably retain in state
    this.authorNamed = (name) => {
      let result = this.all.find(each => each.name === name);
      if (!result) {
        result = {name: name, questions: []};
        this.all.push(result);
      }
      return result;
    };

    this.distinctAuthors = () => {
      return new Set(flatten(this.all.map(each => each.name).map(authornameToArray)));
    };

    this.distinctCount = () => this.distinctAuthors().size;

    questions.forEach(question => this.authorNamed(question.author).questions.push(question));
    this.all.sort((a, b) => { return a.name.localeCompare(b.name); });
  }
}

class Questions {
  constructor(questionstring) {
    this.all = JSON.parse(questionstring);
    this.authors = new Authors(this.all);
    this.authorNamed = this.authors.authorNamed;
    this.authornameToArray = authornameToArray;

    // React does not reliably retain in state
    this.next = () => { return Math.floor(Math.random() * this.all.length); };
    this.questionFor = (idString) => {
      const id = idString || this.next().toString();
      return this.all.find(each => each.id === id) || {question: '', author: '', id: '', date: ''};
    };
  }
}

module.exports = Questions;

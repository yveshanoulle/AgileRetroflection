// do not convert to import until node.js fully supports modules
'use strict';

const flatten = require('lodash/array/flatten');

function authornameToArray(name) { return name.match(/@(\w+)/g) || []; }

class Authors {
  constructor() {
    this.all = [];
    this.authorImages = [];

    this.initQuestions = questions => {
      questions.forEach(question => this.authorNamed(question.author).questions.push(question));
      this.all.sort((a, b) => { return a.name.localeCompare(b.name); });
      this.addImageURLsToAuthors();
      return this;
    };

    this.initAuthorImages = authorimages => {
      this.authorImages = authorimages;
      this.addImageURLsToAuthors();
      return this;
    };

    this.authorNamed = name => {
      let result = this.all.find(each => each.name.toLowerCase() === name.toLowerCase());
      if (!result) {
        result = {name: name, questions: []};
        this.all.push(result);
      }
      return result;
    };

    this.distinctAuthors = () => {
      return new Set(flatten(this.all.map(each => each.name).map(authornameToArray)));
    };

    this.distinctCount = () => { return this.distinctAuthors().size; };

    this.addImageURLsToAuthors = () => {
      if (!this.imagesAlreadyAdded && this.all.length > 0 && Object.keys(this.authorImages).length > 0) {
        this.all.forEach(each => {
          let firstOfNames = authornameToArray(each.name)[0].toLowerCase();
          each.imageURL = (this.authorImages[firstOfNames] || {}).imageURL;
          each.realname = (this.authorImages[firstOfNames] || {}).realname;
        });
      }
    };
  }

}

class Questions {
  constructor() {
    this.all = [];
    this.authors = new Authors();
    this.authorNamed = this.authors.authorNamed;
    this.authornameToArray = authornameToArray;

    // react throws away type info therefor we have to declare the functions as properties
    this.initQuestions = questionstring => {
      this.all = JSON.parse(questionstring);
      this.authors.initQuestions(this.all);
      return this;
    };

    this.initAuthorImages = authorimagesstring => {
      this.authors.initAuthorImages(JSON.parse(authorimagesstring));
      return this;
    };

    this.next = () => { return Math.floor(Math.random() * this.all.length); };

    this.questionFor = idString => {
      const id = idString || this.next().toString();
      return this.all.find(each => each.id === id) || {question: '', author: '', id: '', date: ''};
    };
  }
}

module.exports = Questions;

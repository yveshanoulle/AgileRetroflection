'use strict';

const flatten = require('lodash/array/flatten');

function authornameToArray(name) { return name.match(/@(\w+)/g) || []; }

class Authors {
  constructor() {
    this.all = [];
    this.authorImages = [];

    this.initQuestions = questions => {
      function pushToAllAuthors(question) {
        authornameToArray(question.author).forEach(author => this.authorNamed(author).questions.push(question));
      }

      questions.forEach(question => pushToAllAuthors.call(this, question));
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
          const authors = authornameToArray(each.name);
          let firstOfNames = authors[0].toLowerCase();
          const firstAuthor = (this.authorImages[firstOfNames] || {});
          each.image = firstAuthor.image;
          each.realname = authors.length > 1 ? 'Multiple Persons' : firstAuthor.realname;
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
      const potentialResult = this.all.find(each => each.id === id);
      if (potentialResult) {
        return potentialResult;
      }
      const nextLowerId = parseInt(id, 10) - 1;
      return nextLowerId === 0 ? { question: '', author: '', id: '', date: ''} : this.questionFor(nextLowerId.toString());
    };
  }
}

module.exports = Questions;

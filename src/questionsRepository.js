function authornameToArray(name) { return name.match(/@(\w+)/g) || []; }

class Authors {
  constructor() {
    this.all = [];
    this.authorImages = [];

    this.initQuestions = questions => {
      const addQuestionToAuthor = (question, author) => {
        const authorsQuestions = this.authorNamed(author).questions;
        if (authorsQuestions.map(q => q.id).indexOf(question.id) < 0) {
          authorsQuestions.push(question);
        }
      };
      questions.forEach(question => authornameToArray(question.author).forEach(author => addQuestionToAuthor(question, author)));
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

    this.distinctAuthors = () => this.all.map(each => each.name);

    this.addImageURLsToAuthors = () => {
      if (!this.imagesAlreadyAdded && this.all.length > 0 && Object.keys(this.authorImages).length > 0) {
        this.all.forEach(author => {
          const firstAuthor = (this.authorImages[author.name.toLowerCase()] || {});
          author.image = firstAuthor.image;
          author.realname = firstAuthor.realname;
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
      return nextLowerId < 1 ? {question: '', author: '', id: '', date: ''} : this.questionFor(nextLowerId.toString());
    };
  }
}

module.exports = Questions;

/*global React, ReactRouter, retroflection_version */

(function () {
  'use strict';

  var Router = ReactRouter,
    DefaultRoute = Router.DefaultRoute,
    Link = Router.Link,
    Route = Router.Route,
    RouteHandler = Router.RouteHandler;

  function authors(questions) {
    var internal = [];

    function addAuthor(author) {
      internal.push({name: author, questions: []});
    }

    function getAuthorNamed(name) {
      return _.find(internal, {name: name});
    }

    _.each(questions, function (question) {
      var name = question.author;
      if (!getAuthorNamed(name)) {
        addAuthor(name);
      }
      getAuthorNamed(name).questions.push(question);
    });

    internal.sort(function (a, b) {
      return a.name.localeCompare(b.name);
    });

    return {
      all: internal,
      distinct: function () {
        return _(internal).pluck('name').map(function (each) {
          return each.match(/@(\w+)/g);
        }).flatten().unique().value();
      }
    };
  }

  function Questions(questionstring) {

    var
      questionjson = JSON.parse(questionstring),
      questionNumbers = [];

    function currentQuestionNumber() {
      return questionNumbers[questionNumbers.length - 1] || 0;
    }

    function nextQuestion() {
      questionNumbers.push(Math.floor(Math.random() * questionjson.length));
      return currentQuestionNumber();
    }

    function previousQuestion() {
      if (questionNumbers.length > 1) {
        questionNumbers.pop();
      }
      return currentQuestionNumber();
    }

    return {
      next: nextQuestion,
      all: questionjson,
      authors: authors(questionjson)
    };
  }

  var Buttons = React.createClass({
    render: function () {
      var self = this;

      function buttonClassName(buttonname) {
        return "tab-item" + (self.props.for === buttonname ? " active" : "");
      }

      return <nav className="bar bar-tab">
        <Link className={buttonClassName("authors")} to="authors">
          <span className="icon icon-person"></span>
          <span className="tab-label">Authors</span>
        </Link>
        <Link className={buttonClassName("question")} to="question" params={{id: this.props.questions.next()}}>
          <span className="icon icon-refresh"></span>
          <span className="tab-label">Random</span>
        </Link>
        <Link className={buttonClassName("about")} to="about">
          <span className="icon icon-info"></span>
          <span className="tab-label">About</span>
        </Link>
      </nav>;
    }
  });

  var Twitterlink = React.createClass({
    render: function () {
      var lastauthor = this.props.authors[this.props.authors.length - 1];
      return <span>
        {this.props.authors.map(function (author) {
          return <span key={author}>
            <a href={"http://twitter.com/" + author.substr(1)}>{author}</a> {lastauthor !== author ? " & " : ""} 
          </span>;
        })}
      </span>
    }
  });

  var MailQuestion = React.createClass({
    render: function () {
      var question = this.props.question;
      var link = question ? 'mailto:?subject=Retroflection Question ' + question.id + '&body=' +
      encodeURI('"' + question.question + '"' + ' by ' + question.author) +
      encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
        '\nand is sent via the retroflection app available at http://retroflection.org') : '#';

      return <a href={link}> Mail <span className="icon icon-compose"></span> </a>
    }
  });

  function mailtoForCorrection(question) {
    return question ? 'mailto:retroflections@hanoulle.be?subject=Retroflection corrected question&body=' +
    encodeURI('I have a proposal on improving the spelling of retroflection question ' +
      question.id + ': \n' + '"' + question.question + '" by ' + question.author) +
    encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
      'This retroflection was originally twittered by @retroflection' +
      '\nand is sent via the retroflection app available at http://retroflection.org') : '#';
  }

  var Question = React.createClass({
    render: function () {
      var questions = this.props.questions,
        id = this.props.params.id || questions.next().toString(),
        current = _.find(questions.all, {'id': id}) || {author: "", id: "", date: ""};

      return <div>
        <header className="bar bar-nav">
          <button className="btn btn-link btn-nav pull-left">
            <a href={mailtoForCorrection(current)}> <span className="icon icon-edit"></span> Correct It </a>
          </button>
          <button className="btn btn-link btn-nav pull-right">
            <MailQuestion question={current}/>
          </button>
          <h1 className="title">Retroflection</h1>
        </header>
        <div className="content">
          <h3 className="question">{current.question}</h3>

          <p className="author">
            <Twitterlink authors={current.author.match(/@(\w+)/g) || []}/>
            (#{current.id} - {current.date})
          </p>
        </div>
        <Buttons for="question" questions={questions}/>
      </div>
    }
  });

  var Authors = React.createClass({
    render: function () {
      var questions = this.props.questions;

      return <div>
        <header className="bar bar-nav">
          <h1 className="title">Authors</h1>
        </header>
        <div className="content">
          <ul className="table-view">
            {questions.authors.all.map(function (author) {
              return <li key={author.name} className="table-view-cell">
                <Link className="navigate-right" to="author" params={{name: encodeURIComponent(author.name)}}>
                  <span className="badge">{author.questions.length}</span> {author.name}
                </Link>
              </li>;
            })}
          </ul>
        </div>
        <Buttons for="authors" questions={questions}/>
      </div>
    }
  });

  var Author = React.createClass({
    render: function () {
      var
        questions = this.props.questions,
        name = decodeURIComponent(this.props.params.name),
        author = _.find(questions.authors.all, {name: name}) || {questions: []};
      return <div>
        <header className="bar bar-nav">
          <Link className="btn pull-left" to="authors">back</Link>

          <h1 className="title">{name}</h1>
        </header>
        <div className="content">
          <ul className="table-view">
            {author.questions.map(function (question) {
              return <li key={question.id} className="table-view-cell">
                {question.question} <Link style={{display: "inline"}} to="question" params={{id: question.id}}>
                <small>(#{question.id})</small>
              </Link>
                <a href={mailtoForCorrection(question)} className="btn icon icon-edit" style={{padding: "0px"}}/>
              </li>;
            })}
          </ul>
        </div>
        <Buttons for="authors" questions={questions}/>
      </div>
    }
  });

  var About = React.createClass({
    render: function () {
      var questions = this.props.questions;

      return <div>
        <header className="bar bar-nav">
          <h1 className="title">About</h1>
        </header>
        <div className="content">
          <div className="content-padded">
            <h4>Please support us by:</h4>
            <ul style={{fontSize: "14px"}}>
              <li>Adding questions on the <a href="https://docs.google.com/spreadsheet/viewform?formkey=dFg2aXdNbE5qdzlzNjBmM1pKaFJFYkE6MQ" target="_blank">google doc</a>. </li>
              <li>Contributing to the code on <a href="https://github.com/yveshanoulle/AgileRetroflection" target="_blank">github</a></li>
              <li>Correcting the spelling of the questions. Just leave us a note by clicking on this icon <a className="icon icon-edit" style={{fontSize: "inherit"}}></a> inside the app. </li>
            </ul>
            <p>Originally tweeted by <a href="http://twitter.com/retroflection">@Retroflection</a></p>
            <p>Site by <a href="http://www.twitter.com/leiderleider">@leiderleider</a></p>
            <p>Version: {retroflection_version}</p>
            <p>We currently feature {questions.all.length} different questions by {questions.authors.distinct().length} distinct authors.</p>
          </div>
        </div>
        <Buttons for="about" questions={questions}/>
      </div>;
    }
  });

  var App = React.createClass({
    getInitialState: function () {
      return {data: Questions("[]")};
    },
    componentDidMount: function () {
      var xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function() {
        if (xmlhttp.readyState == XMLHttpRequest.DONE ) {
          if(xmlhttp.status == 200){
            var data = xmlhttp.response;
            localStorage.setItem('questions', data);
            this.setState({data: Questions(data)});
          } else {
            this.setState({data: Questions(localStorage.getItem('questions'))});
          }
        }
      }.bind(this);

      xmlhttp.open("GET", "/questions.json", true);
      xmlhttp.send();
      
      
      //$.ajax({
      //  url: '/questions.json',
      //  dataType: 'json',
      //  cache: false,
      //  success: function (data) {
      //    localStorage.setItem('questions', JSON.stringify(data));
      //    this.setState({data: Questions(data)});
      //  }.bind(this),
      //  error: function () {
      //    this.setState({data: Questions(JSON.parse(localStorage.getItem('questions')))});
      //  }.bind(this)
      //});
    },
    render: function () {
      return <RouteHandler questions={this.state.data}/>;
    }
  });

  var routes = (
    <Route handler={App}>
      <Route name="question" path="/question/:id" handler={Question}/>
      <Route name="random" handler={Question}/>
      <Route name="authors" handler={Authors}/>
      <Route name="author" path="authors/:name" handler={Author}/>
      <Route name="about" handler={About}/>
      <DefaultRoute handler={Question}/>
    </Route>
  );

  Router.run(routes, function (Handler) {
    React.render(<Handler />, document.body);
  });
}());

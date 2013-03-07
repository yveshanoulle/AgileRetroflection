var persistence = {};
(function() {
	this.get_id = function() {
		if (!localStorage.getItem("id")) {
			localStorage.setItem("id", 0);
		}
		return Math.floor(localStorage.getItem("id"))
	}

	this.set_id = function(token) {
		localStorage.setItem("id", token)
	}
}).apply(persistence)

var arotd = {};
(function() {
	var currentNumber = persistence.get_id();

	var authorWithQuestions;

	this.currentQuestion = function() {
		return questions[currentNumber];
	}

	this.previousQuestion = function() {
		currentNumber++;
		if (currentNumber > questions.length - 1) {
			currentNumber = 0;
		}
		persistence.set_id(currentNumber);
	}

	this.nextQuestion = function() {
		currentNumber--;
		if (currentNumber < 0) {
			currentNumber = questions.length - 1;
		}
		persistence.set_id(currentNumber);
	}

	this.randomQuestion = function() {
		currentNumber = Math.floor(Math.random() * questions.length);
		persistence.set_id(currentNumber);
	}

	this.firstQuestion = function() {
		currentNumber = questions.length - 1;
		persistence.set_id(currentNumber);
	}

	this.lastQuestion = function() {
		currentNumber = 0;
		persistence.set_id(currentNumber);
	}

	this.authorWithQuestions = function() {
		if (!authorWithQuestions) {
			authorWithQuestions = [];

			for (var i in questions) {
				var question = questions[i]
				if (!authorWithQuestions[question.author]) {
					authorWithQuestions[question.author] = [];
				}
				authorWithQuestions[question.author].push(question);
			}
		}

		return authorWithQuestions;
	}

}).apply(arotd)

var display = {};
(function() {
	this.show = function() {
		var current = arotd.currentQuestion();
		$("#question").html(current.question);
		$("#author").html(this.linkToTwitter(current.author));
		$("#number").html("Question #" + current.number);
	}

	this.bindButtons = function() {
		$("#next").unbind()
		$("#next").click(function() {
			arotd.nextQuestion();
			display.show()
		})

		$("#previous").unbind()
		$("#previous").click(function() {
			arotd.previousQuestion();
			display.show()
		})

		$("#random").unbind()
		$("#random").click(function() {
			arotd.randomQuestion();
			display.show()
		})

		$("#first").unbind()
		$("#first").click(function() {
			arotd.firstQuestion();
			display.show()
		})

		$("#last").unbind()
		$("#last").click(function() {
			arotd.lastQuestion();
			display.show()
		})
	}

	this.link = function(name) {
		return name;
	}

	this.linkToTwitter = function(name) {
		if (name.charAt(0) == "@") {
			return "<a href='http://twitter.com/" + name.substr(1) + "'>" + name + "</a>";
		} else {
			return name;
		}
	}

}).apply(display)

jQuery.fn.arotd = function() {
	display.show();
	display.bindButtons();
	$("div:jqmData(role=page)").bind ("swipeleft", function (event)
	{
		if (this.id == "authors-page") {
			return;
		}
		event.stopImmediatePropagation();
		arotd.nextQuestion();
		display.show();
	});

	$("div:jqmData(role=page)").bind ("swiperight", function (event)
	{
		if (this.id == "authors-page") {
			return;
		}
		event.stopImmediatePropagation();
		arotd.previousQuestion();
		display.show();
	});
}

jQuery.fn.contrib = function() {
	var map = arotd.authorWithQuestions();
	var sortedAuthors = Object.keys(map).sort();
	for (index in sortedAuthors) {
		var author = sortedAuthors[index];
		var ul = "<ul data-role='listview'>";
		for (questionIndex in map[author]) {
			var question = map[author][questionIndex];
			ul += "<li><small>" + question.question + "</small></li>";
		}
		ul += "</ul>";
		var lastElement = $("#authors").append("<div data-role='collapsible'><h3>" + author + "  (" + map[author].length + ")</h3>" + ul + "</div>");
		var last = lastElement;
	}
}

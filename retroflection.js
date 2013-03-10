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

var retroflection = {};
(function() {
	var currentNumber = persistence.get_id();

	var authorWithQuestions;

	this.currentQuestion = function() {
		return questions[currentNumber];
	}

	this.previousQuestion = function(number) {
		currentNumber++;
		if (currentNumber > questions.length - 1) {
			currentNumber = 0;
		}
		persistence.set_id(currentNumber);
		display.show(number)
	}

	this.nextQuestion = function(number) {
		currentNumber--;
		if (currentNumber < 0) {
			currentNumber = questions.length - 1;
		}
		persistence.set_id(currentNumber);
		display.show(number)
	}

	this.randomQuestion = function(number) {
		currentNumber = Math.floor(Math.random() * questions.length);
		persistence.set_id(currentNumber);
		display.show(number)
	}

	this.firstQuestion = function(number) {
		currentNumber = questions.length - 1;
		persistence.set_id(currentNumber);
		display.show(number)
	}

	this.lastQuestion = function(number) {
		currentNumber = 0;
		persistence.set_id(currentNumber);
		display.show(number)
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

}).apply(retroflection)

var display = {};
(function() {
	this.show = function(number) {
		var current = retroflection.currentQuestion();
		$("#question" + number).html(current.question);
		$("#author" + number).html(this.linkToTwitter(current.author));
		$("#number" + number).html("Question #" + current.number);
	}

	this.bindButtons = function(buttonNumber, number) {
		this.bindButtonsNumbered(1,2);
		this.bindButtonsNumbered(2,1);
	}


	this.bindButtonsNumbered = function(buttonNumber, number) {
		$("#next" + buttonNumber).click(function() {
			retroflection.nextQuestion(number);
		})

		$("#previous" + buttonNumber).click(function() {
			retroflection.previousQuestion(number);
		})

		$("#random" + buttonNumber).click(function() {
			retroflection.randomQuestion(number);
		})

		$("#first" + buttonNumber).click(function() {
			retroflection.firstQuestion(number);
		})

		$("#last" + buttonNumber).click(function() {
			retroflection.lastQuestion(number);
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

jQuery.fn.retroflection = function() {
	display.show(1);
	display.show(2);
	display.bindButtons();

	$("#page1").children("#content").bind ("swipeleft", function (event)
	{
		event.stopImmediatePropagation();
		$("#next" + 1).trigger("click");
		return false;
	});

	$("#page2").children("#content").bind ("swipeleft", function (event)
	{
		event.stopImmediatePropagation();
		$("#next" + 2).trigger("click");
		return false;
	});

	$("#page1").children("#content").bind ("swiperight", function (event)
	{
		event.stopImmediatePropagation();
		$("#previous" + 1).trigger("click");
		return false;
	});
	
	$("#page2").children("#content").bind ("swiperight", function (event)
	{
		event.stopImmediatePropagation();
		$("#previous" + 2).trigger("click");
		return false;
	});
	
	$("#page1").children("#content").bind ("swipedown", function (event)
	{
		event.stopImmediatePropagation();
		$("#random" + 1).trigger("click");
		return false;
	});
	
	$("#page2").children("#content").bind ("swipedown", function (event)
	{
		event.stopImmediatePropagation();
		$("#random" + 2).trigger("click");
		return false;
	});
	
	$("#page1").children("#content").bind ("swipeup", function (event)
	{
		event.stopImmediatePropagation();
		$("#random" + 1).trigger("click");
		return false;
	});
	
	$("#page2").children("#content").bind ("swipeup", function (event)
	{
		event.stopImmediatePropagation();
		$("#random" + 2).trigger("click");
		return false;
	});
	
}

jQuery.fn.contrib = function() {
	var map = retroflection.authorWithQuestions();
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

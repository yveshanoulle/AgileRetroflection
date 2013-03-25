var persistence = {};
(function () {
    this.get_id = function () {
        if (!localStorage.getItem("id")) {
            localStorage.setItem("id", 0);
        }
        return Math.floor(localStorage.getItem("id"))
    }

    this.set_id = function (token) {
        localStorage.setItem("id", token)
    }
}).apply(persistence)

var retroflection = {};
(function () {

    this.currentQuestion = function () {
        return questions[Math.floor(Math.random() * questions.length)];
    }

}).apply(retroflection)

var display = {};
(function () {
    var linkToTwitter = function (name) {
        if (name.charAt(0) == "@") {
            return "<a href='http://twitter.com/" + name.substr(1) + "'>" + name + "</a>";
        }
        return name;
    }

    var createEmail = function (question) {
//        return '<a data-role="button" data-icon="edit" data-iconpos="notext"' +
//          'href=\'mailto:?subject=Retroflection #' + question.number +
//            '&body=' + escape('"' + question.question + '"' + ' by ' + question.author) +
//            encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
//                '\nand is sent via the retroflection app available at http://retroflection.org') + '\'/>';
        return 'mailto:?subject=Retroflection Question ' + question.number +
            '&body=' + encodeURIComponent('"' + question.question + '"' + ' by ' + question.author) +
            encodeURIComponent('\n\n---\nThis retroflection was originally twittered by @retroflection' +
                '\nand is sent via the retroflection app available at http://retroflection.org');
    }

    this.show = function (number) {
        var current = retroflection.currentQuestion();
        $("#question" + number).html(current.question);
        $("#author" + number).html(linkToTwitter(current.author) + " (#" + current.number + ")");
        $("#emaillink" + number).attr('href', createEmail(current));
    }

    this.bindEvents = function () {
        bindButtonsNumbered(1, 2);
        bindButtonsNumbered(2, 1);
        bindGesturesForPage(1);
        bindGesturesForPage(2);
    }

    var bindButtonsNumbered = function (buttonNumber, number) {
        $("#page" + number).bind("pagebeforeshow", function () {
            display.show(number);
        })
    }

    var bindGesturesForPage = function (pageNumber) {
        $("#content" + pageNumber).bind("swipedown", function (event) {
            event.stopImmediatePropagation();
            $("#random" + pageNumber).trigger("click");
            return false;
        });
    }

}).apply(display)

jQuery.fn.retroflection = function () {
    display.show(1);
    display.show(2);
    display.bindEvents();
}

jQuery.fn.contrib = function () {
    var map = new Authors(questions).internal;
    for (index in map) {
        var author = map[index];
        $("#authors").append(author.asListItem());
    }
}

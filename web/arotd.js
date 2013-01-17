(function(jQuery, undefined) {
    Question = function(question, author){
        this.question = question
        this.author = author
    }

    $.questions = []
    $.convert_list = function() {
        for (i in $._questions) {
            var q = $._questions[i]
            $.questions.push(new Question(q[0], q[1]))
        }
    }
    $.convert_list()

    $.display_current = function() {
        var current = $.questions[$.i]
        $.question.html(current.question)
		$.author.html($.link(current.author))
    }

    $.next_question_id = function() {
        $.i++
        if ($.i > $.questions.length - 1) {
            $.i = 0
        }
        $.set_id($.i)
    }

     $.previous_question_id = function() {
        $.i--
        if ($.i < 0) {
            $.i = 0
        }
     }

    $.fn.arotd = function(question, author, previous, next) {
        $.question = $(question)
        $.author = $(author)
        $.previous = $(previous)

        $.get_id($.display_current)

        $(next).unbind()
        $(next).bind('touchstart', function() {
            $.next_question_id()
            $.display_current()
        })

        $.previous.unbind()
        $.previous.bind('touchstart', function() {
            $.previous_question_id()
			$.display_current()
        })
    }

    $.fn.contrib = function() {
        var counted = {}
        for (var i in $.questions) {
            var q = $.questions[i]
            if (counted[q.author]) {
                counted[q.author]++
            } else {
                counted[q.author] = 1
            }
        }

        var sortable = new Array()
        for (var author in counted) {
            sortable.push([author, counted[author]])
        }
        function compare(sortable_1, sortable_2) {
            return sortable_2[1] - sortable_1[1]
        }

        var sorted = sortable.sort(compare)
        for (tuple in sorted) {
            var contrib = sorted[tuple]
            $(this).find("ul").append("<li id='" + contrib[0].substr(1) + "'>" + $.link(contrib[0]) + " (" + contrib[1] + " q.)" + "</li>")
		}
    }
 
	$.link = function(name) {
		if (name.charAt(0) == "@") {
			return "<a href='http://twitter.com/" + name.substr(1) + "'>" + name + "</a>";
		} else {
			return name;
		}
	}
})(jQuery)


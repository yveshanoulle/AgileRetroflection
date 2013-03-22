function Author(name) {
    this.name = name;
    this.questions = [];
    this.twitterNames = [];


    var authors = name.split(/(,|&| and )/);
    for (var i in authors) {
        var each = authors[i];
        if (each.match(/@/)) {
            this.twitterNames.push(each.trim());
        }
    }
    console.log(this);

    if (typeof(this.addQuestion) == 'undefined') //guarantees one time prototyping
    {
        Author.prototype.addQuestion = function (question) {
            this.questions.push(question);
        };
    }

    function createCorrection(question) {
        return '<a data-role="button" data-icon="edit" data-iconpos="notext" class="mailbutton" href=\'mailto:Yves@PairCoaching.net' +
            '?subject=Retroflection corrected question' +
            '&body=' + escape("I have a proposal on improving the spelling of retroflection #" + question.number +
            ': \n' + '"' + question.question + '"' + ' by ' + question.author) +
            encodeURIComponent('\n\nI would write it as follows:\n\n\n---\n' +
                'This retroflection was originally twittered by @retroflection' +
                '\nand is sent via the retroflection app available at http://retroflection.org') + '\'>' +
            'correct<br>spelling</a>';
    }

    if (typeof(this.asListItem) == 'undefined') //guarantees one time prototyping
    {
        Author.prototype.asListItem = function () {
            var ul = "<ul data-role='listview'>";
            for (questionIndex in this.questions) {
                var question = this.questions[questionIndex];
                ul += "<li><small>" + question.question + "</small>" +
                    "<p class='ui-li-aside'>" +
                    createCorrection(question) + "</p>" +
                    "</li>";
            }
            ul += "</ul>";
            return "<div data-role='collapsible'><h3>" + this.name + "  (" + this.questions.length + ")</h3>" + ul + "</div>";
        };
    }

}



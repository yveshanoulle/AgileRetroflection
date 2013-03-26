function Authors(questions) {
    this.internal = [];

    this.addAuthor = function (author) {
        this.internal.push(author);
    };

    this.containsAuthorNamed = function (name) {
        for (i in this.internal) {
            if (this.internal[i].name == name) {
                return true;
            }
        }
        return false;
    };

    this.getAuthorNamed = function (name) {
        for (i in this.internal) {
            if (this.internal[i].name == name) {
                return this.internal[i];
            }
        }
        return null;
    }

    this.sort = function () {
        this.internal.sort(function (a, b) {
            return a.name.localeCompare( b.name);
        });
    }

    for (var i in questions) {
        var question = questions[i];
        var name = question.author;
        if (!this.containsAuthorNamed(name)) {
            this.addAuthor(new Author(name));
        }
        this.getAuthorNamed(name).addQuestion(question);
    }
    this.sort();

}

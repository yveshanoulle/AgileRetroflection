var twitterInfos = {};
(function () {
    var Set = function () {
    }
    Set.prototype.add = function (o) {
        this[o] = true;
    }
    Set.prototype.remove = function (o) {
        delete this[o];
    }

    var set = new Set();

    this.loadTweets = function (authors) {
        for (i in authors) {
            var author = authors[i];
            for (var j in author.twitterNames) {
                set.add(author.twitterNames[j])
            }
        }
        console.log(set);
        profileURL = 'http://search.twitter.com/search.json?'
        $.ajax({
            url: profileURL,
            type: 'GET',
            data: {
                q: '@leiderleider'
            },
            success: function (data, textStatus, xhr) {
                for (i in authors) {
                    var author = authors[i];
                    for (var j in author.twitterNames) {
                        var url = data.results[0].profile_image_url;
                        author.addAvatar(url);
                        console.log(url)
                    }
                }
            }

        });
    }
}).apply(twitterInfos);


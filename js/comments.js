var CurrentPage = 0;

function ParseLinkHeader(link)
{
    if(entries)
    var entries = link.split(",");
    var links = { };
    for (var i in entries)
    {
        var entry = entries[i];
        var link = { };
        link.name = entry.match(/rel=\"([^\"]*)/)[1];
        link.url = entry.match(/<([^>]*)/)[1];
        link.page = entry.match(/page=(\d+).*$/)[1];
        links[link.name] = link;
    }
    return links;
}

function DoGithubComments(comment_id, page_id)
{
    var repo_name = "MrRobotjs/BetterDocs";

    if (page_id === undefined)
        page_id = 1;

    var api_url = "https://betterdocs-comments.herokuapp.com/repos/" + repo_name;
    var api_issue_url = "https://api.github.com/repos/" + "/issues/" + comment_id;
    var api_comments_url = api_url + "/issues/" + comment_id + "/comments" + "?page=" + page_id;

    var url = "https://github.com/MrRobotjs/BetterDocs/issues/" + comment_id;

    $(document).ready(function ()
    {
        $.getJSON(api_issue_url, function(data) {
            NbComments = data.comments;
        });

        $.ajax(api_comments_url, {
            headers: {Accept: "application/vnd.github.v3.html+json"},
            dataType: "json",
            success: function(comments, textStatus, jqXHR) {

                // Add post button to first page
                if (page_id == 1)
                    $("#gh-comments-list").append("<div class='button small'><a href='" + url + "#new_comment_field' rel='nofollow'>Leave a Review</a></div>");

                // Individual comments
                $.each(comments, function(i, comment) {

                    var date = new Date(comment.created_at);

                    var t = "<div id='gh-comment'>";
                    t += "<img src='" + comment.user.avatar_url + "' width='34px'>";
                    t += "<div class='user'><b><a href='" + comment.user.html_url + "'>" + comment.user.login + "</a></b></div>";
                    t += " ";
                    t += "<div class='date'><em>" + date.toUTCString() + "</em></div>";
                    t += "<div id='gh-comment-hr'></div>";
                    t += comment.body_html;
                    t += "</div>";
                    $("#gh-comments-list").append(t);
                });

                // Setup comments button if there are more pages to display
                var links = ParseLinkHeader(jqXHR.getResponseHeader("Link"));
                if ("next" in links)
                {
                    $("#gh-load-comments").attr("onclick", "DoGithubComments(" + comment_id + "," + (page_id + 1) + ");");
                    $("#gh-load-comments").show();
                }
                else
                {
                    $("#gh-load-comments").hide();
                }
            },
            error: function() {
                $("#gh-comments-list").append("Comments are not open for this post yet.");
            }
        });
    });
}
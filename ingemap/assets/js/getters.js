function getNote(id) {
    $.post(
        'note.php', {
            "idEcole": id
        },
        function (data) {
            $("#note").html(data);
        },
        'text'
    );
}

function getCommentaires(id) {
    $.post(
        'commentaire.php', {
            "idEcole": id
        },
        function (data) {
            data = $.parseJSON(data);
            if (data.length != 0) {
                $.each(data.reviews, function (key, value) {
                    $("#commentaires").append("<hr> <div class=\"panel panel-default\"><div class=\"panel-heading\"><strong>" + value.username + "</strong> <span class=\"text-muted\">a donné une note de " + value.note + "</span> </div><div class=\"panel-body\">" + value.review + "</div></div>");
                });
            } else {
                $("#commentaires").html("<hr> Il n'y a pas de commentaires.");
            }
        },
        'text'
    );
}
/*jslint browser: true*/
/*jslint node: true */
/*global $, jQuery, alert, List, */
$(document).ready(function () {
    $("#submit").click(function () {
        $.post(
            'connexion.php', {
                username: $("#username").val(),
                password: $("#password").val()
            },
            function (data) {
                if (data != 'Failed') {
                    session = data;
                    $("#loginModal").modal("hide");
                    connecte = "true";
                    $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se déconnecter");
                } else {
                    $("#error").html("<div class=\"panel-heading panel panel-info\">Mauvais identifiants</div>");
                }
            },
            'text'
        );
    });

    $(document).on("click", "#commenter", function () {
        session = JSON.parse(session);
        $.post(
            'ajouterCommentaire.php', {
                username: session.username,
                message: $("#message").val(),
                idEcole: $("#feature-info table").attr("id"),
                note: $("select[id=note]").val()
            },
            function (data) {
                if (data != "Success") {
                    $("#commenter-error").html("<div class=\"panel-heading panel panel-info\">" + data + "</div>");
                } else {
                    $("#featureModal").modal("hide");
                }
            },
            'text'
        );
    });
});
/*jslint browser: true*/
/*jslint node: true */
/*global $, jQuery, alert, List, */
$(document).ready(function () {
    /*
        Connexion.        
    */
    $("#submit").click(function () {
        $.post(
            'connexion.php', {
                username: $("#username").val(),
                password: $("#password").val()
            },
            function (data) {
                switch (data) {
                case "AuthFailException":
                    $("#error").html("<div class=\"panel-heading panel panel-info\">Mauvais identifiants</div>");
                    break;
                case "MissingFieldException":
                    $("#error").html("<div class=\"panel-heading panel panel-info\">Veuillez remplir tous les champs</div>");
                    break;
                default:
                    session = $.parseJSON(data);
                    connecte = "true";
                    $("#loginModal").modal("hide");
                    $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se déconnecter");
                    $("#inscrire-btn").html(" ");
                    break;
                }
            },
            'text'
        );
    });

    /*
        Inscription.
    */
    $("#inscrire").click(function () {
        $.post(
            'inscription.php', {
                username: $("#username-inscription").val(),
                password: $("#password-inscription").val()
            },
            function (data) {
                switch (data) {
                case "ExistantIDException":
                    $("#error-inscrire").html("<div class=\"panel-heading panel panel-info\">Cet identifiant existe déjà</div>");
                    break;
                case "MissingFieldException":
                    $("#error-inscrire").html("<div class=\"panel-heading panel panel-info\">Veuillez remplir tous les champs</div>");
                    break;
                default:
                    session = $.parseJSON(data);
                    alert(data);
                    $("#inscrireModal").modal("hide");
                    connecte = "true";
                    $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se déconnecter");
                    $("#inscrire-btn").html("");
                    break;
                }
            },
            'text'
        );
    });

    /* 
        Commenter.
    */
    $(document).on("click", "#commenter", function () {
        $.post(
            'ajouterCommentaire.php', {
                username: session.username,
                message: $("#message").val(),
                idEcole: $("#feature-info table").attr("id"),
                note: $("select[id=note]").val()
            },
            function (data) {
                switch (data) {
                case "MissingFieldException":
                    $("#commenter-error").html("<div class=\"panel-heading panel panel-info\">Veuillez remplir tous les champs</div>");
                    break;
                case "ExistingCommentException":
                    $("#commenter-error").html("<div class=\"panel-heading panel panel-info\">Vous avez déjà commenté.</div>");
                    break;
                default:
                    $("#featureModal").modal("hide");
                    break;
                }
            },
            'text'
        );
    });
});
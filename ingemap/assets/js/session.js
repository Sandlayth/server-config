/*jslint browser: true*/
/*jslint node: true */
/*global $, jQuery, alert, List, */
var session;

$(document).ready(function () {
    $.get('session.php', function (data) {
        session = JSON.parse(data);
        if (session.length != 0) {
            connecte = "true";
            $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se déconnecter");
            $("#inscrire-btn").html(" ");
        } else {
            connecte = "false";
        }
    });
});
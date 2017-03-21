// À propos
$("#about-btn").click(function () {
    $("#aboutModal").modal("show");
    $(".navbar-collapse.in").collapse("hide");
    return false;
});

// Connexion
$("#login-btn").click(function () {
    if (connecte == "false") {
        $("#loginModal").modal("show");
    } else {
        $.get('detruire_session.php', function (data) {});
        $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se connecter");
        $("#inscrire-btn").html("<i class=\"fa fa - user white\"></i>&nbsp;&nbsp;S'inscrire");
        session = "{}";
        connecte = "false";
    }
    return false;
});

//Inscription

$("#inscrire-btn").click(function () {
    if (connecte == "false") {
        $("#inscrireModal").modal("show");
    } else {
        $("#login-btn").html("<i class=\"fa fa-user white\"></i>&nbsp;&nbsp;Se connecter");
        session = "{}";
        connecte = "false";
    }
    return false;
});

// Navbar sur mobile
$("#nav-btn").click(function () {
    $(".navbar-collapse").collapse("toggle");
    return false;
});
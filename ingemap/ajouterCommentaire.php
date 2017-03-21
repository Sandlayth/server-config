<?php
    require_once 'configurerBDD.php';

    if(!empty($_POST['username']) AND !empty($_POST['note']) AND !empty($_POST['idEcole'])) {
        try {
            $username = $_POST['username'];
            $message = $_POST['message'];
            $idEcole = $_POST['idEcole'];
            $note = $_POST['note'];

            $stmt = $db_con->prepare('INSERT INTO review VALUES(:username, :idEcole, :message, :note)');
            $stmt->execute(array('username' => $username,'message' => $message,'note' => $note,'idEcole' => $idEcole));
            echo "Success";
        } catch (PDOException $e) {
            echo "ExistingCommentException";
        }
    } else {
        echo "MissingFieldException";
    }
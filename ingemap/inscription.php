<?php
    session_start();
    require_once 'configurerBDD.php';

    if( !(empty($_POST['username']) || empty($_POST['password'])) ){
         try {
            $stmt = $db_con->prepare('INSERT INTO user(username, password) VALUES(:username, :password)');
            $stmt->execute(array('username' => $_POST['username'],'password' => $_POST['password']));
    
            $_SESSION['username'] = $_POST['username'];
            echo json_encode($_SESSION);
        } catch (PDOException $e) {
            echo "ExistantIDException";
        }
    } else {
        echo "MissingFieldException"; 
    }
  
?>
<?php
    session_start();
    require_once 'configurerBDD.php';

    if( !(empty($_POST['username']) || empty($_POST['password'])) ){
        $usernameGiven = trim($_POST['username']);
        $passwordGiven = trim($_POST['password']);
        
        try
        { 
            $stmt = $db_con->prepare("SELECT * FROM user WHERE username=:usernameGiven");
            $stmt->execute(array(":usernameGiven"=>$usernameGiven));
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();
   
            if( $row['password'] == $passwordGiven ){
                $_SESSION['username'] = $row['username'];
                echo json_encode($_SESSION);
            } else {
                echo "AuthFailException";
            } 
        } catch ( PDOException $e ) {
            
        }

    } else {
        echo "MissingFieldException"; 
    }
  
  
?>
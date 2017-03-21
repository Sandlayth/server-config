<?php
    require_once 'configurerBDD.php';

    if(isset($_POST['idEcole'])){
        $idEcole = trim($_POST['idEcole']);
        try
        { 
            $stmt = $db_con->prepare("SELECT * FROM review WHERE idEcole=:idEcole");
            $stmt->execute(array(":idEcole"=>$idEcole));

            $data = array();

            while($row=$stmt->fetch(PDO::FETCH_ASSOC)) {
                $data['reviews'][] = $row;
            }       
            
            header('Content-Type: application/json');
            echo json_encode($data);  
        } catch (PDOException $e) {
            echo $e;
        }
    } 
?>
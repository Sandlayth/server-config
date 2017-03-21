<?php
    require_once 'configurerBDD.php';

    if(isset($_POST['idEcole'])){
        $idEcole = trim($_POST['idEcole']);
        try
        { 
            $stmt = $db_con->prepare("SELECT avg(note),2 FROM review WHERE idEcole=:idEcole");
            $stmt->execute(array(":idEcole"=>$idEcole));
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            $count = $stmt->rowCount();
            
            if($row['avg(note)'] != null) {
                echo $row['avg(note)'] + "" ;
            } else {
                echo "Pas de note";
            }
        } catch (PDOException $e) {
            echo $e;
        }
   
    }
  
?>
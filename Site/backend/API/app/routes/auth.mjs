import {dbConnection} from "../db/dbConnexion.mjs";
import express from "express";

const router = express();

const databaseConnection = async (req,res,next) => {
    try{
        // met la connexion à la db dans la variable connection de req
        req.connectionToDB = await dbConnection();
        next();
    }
    catch(error){
        console.error("Impossible de se connecter à la base de donnée",error);
        res.status(500).json({error:"internal Server Error"})
    }
};

router.post('/', databaseConnection, async (req,res) =>{
    // prend les infos du body
    let { username, password } = req.body;
    
    // vérifie si l'utilisateur existe
    const authenticationString = 'SELECT * FROM t_user WHERE useNickName = ? AND usePassWord = ?'
    try{
        const [dbResponse] = await req.connectionToDB.execute(authenticationString, [username, password]);
        if(dbResponse.length > 0){
            res.send(`Utilisateur: ${username} connecté`);
        }
        else{
            console.log(`dbResponse : ${dbResponse}`)
        }
    }
    catch(error){
        console.error("Une erreur d'authentification est survenue",error);
        res.status(500).json({ error: "Internal Server Error" });
        console.log(`on s'en bat les couilles : ${req.body}`);
    }
});
export default router;
import {dbConnection} from "../db/dbConnexion.mjs";
import express from "express";
import { databaseConnection } from "../db/dbConnexion.mjs";
const router = express();

const getMaxId = async(req,res,next) =>{
    const getMaxIdString = "SELECT MAX(idUser) AS maxID FROM t_user;"
    try{
        const [dbResponseMaxId] = await req.connectionToDB.execute(getMaxIdString)
        req.maxID = dbResponseMaxId[0].maxID;
        console.log("maaaaaaaaaxIIIIDDD"+req.maxID);
        next();
    }
    catch{
        console.error("Erreur lors de la récupération des IDs");
    }
};
router.post('/',databaseConnection, getMaxId,async(req,res) =>{
    let { username, password } = req.body;
    let newUserID = req.maxID +1;
    // vérifie si l'utilisateur existe
    const authenticationString = 'INSERT INTO t_user (idUser, useNickName, usePassWord) VALUES (?,?,?);'
    try{
        const [dbResponse] = await req.connectionToDB.execute(authenticationString, [newUserID,username, password]);
        res.send(`Nouvelle utilisateur: ${username} créée`);
    }
    catch(error){
        console.error("Impossible de créer l'utilisateur " + username,error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
export default router;
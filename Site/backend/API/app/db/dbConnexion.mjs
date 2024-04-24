import mysql from "mysql2/promise";

const dbConfig = {
    host: 'db',
    user:'root',
    password:'root',
    database:'db_webSecurity'
};

export const dbConnection = async() => {
    try{
        const connect = await mysql.createConnection(dbConfig);
        console.log("Connexion établie")
        return connect;
    }
    catch(error){
        console.error("Impossoble de se connecter à la connexion", error);
        throw error;
    }
};
export const databaseConnection = async (req,res,next) => {
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


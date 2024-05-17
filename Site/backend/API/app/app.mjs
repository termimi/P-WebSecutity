import express from "express";
import authRouter, { getCertificateFromFolder, getPrivateKeyFromFolder } from "./routes/auth.mjs";
import createRouter from "./routes/createUser.mjs"
import userRouter from "./routes/users.mjs"
import https from "https";


const privateKey = getPrivateKeyFromFolder();
const certificate = getCertificateFromFolder();

const credentials = {
    key: privateKey,
    cert: certificate
};

const app = express();
app.use(express.json());
const port = 8080;

const httpsServer = https.createServer(credentials, app);

app.get("/", (req, res) => {
    res.send("API REST of a eShopWebsite !");
});
app.use('/login',authRouter);
app.use('/create',createRouter);
app.use('/users',userRouter);

// Démarrage du serveur
httpsServer.listen(port, () => {
    console.log('Server running on port 8080');
});




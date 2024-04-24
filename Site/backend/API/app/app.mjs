import express from "express";
import authRouter from "./routes/auth.mjs";


const app = express();
app.use(express.json());
const port = 8080;

app.get("/", (req, res) => {
    res.send("API REST of a eShopWebsite !");
});
app.use('/auth',authRouter);

// Démarrage du serveur
app.listen(port, () => {
    console.log('Server running on port 8080');
});


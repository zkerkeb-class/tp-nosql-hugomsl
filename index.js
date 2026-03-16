// Charger les variables d'environnement en PREMIER (avant tout autre import)
// dotenv lit le fichier .env et rend les variables accessibles via process.env
import 'dotenv/config';

import express from 'express';
import cors from 'cors';
import pokemonsRouter from './routes/pokemons.js';
import authRouter from './routes/auth.js';
import favoritesRouter from './routes/favorites.js';
import statsRouter from './routes/stats.js';
import teamsRouter from './routes/teams.js';
import connectDB from "./connect.js";

const app = express();

app.use(cors()); // Permet les requêtes cross-origin (ex: frontend sur un autre port)

app.use('/assets', express.static('assets')); // Permet d'accéder aux fichiers dans le dossier "assets" via l'URL /assets/...

app.use(express.json());


app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// Utiliser le router des Pokémon
app.use('/api/pokemons', pokemonsRouter);

// Utiliser le router d'authentification
app.use('/api/auth', authRouter);

// Utiliser le router des favoris
app.use('/api/favorites', favoritesRouter);

// Utiliser le router des statistiques
app.use('/api/stats', statsRouter);

// Utiliser le router des équipes
app.use('/api/teams', teamsRouter);

// Démarrer le serveur après la connexion à MongoDB
const startServer = async () => {
    await connectDB();
    app.listen(process.env.PORT || 3000, () => {
        console.log(`Server is running on http://localhost:${process.env.PORT || 3000}`);
    });
};

startServer();

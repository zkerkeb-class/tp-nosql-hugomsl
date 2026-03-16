import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/user.js';

const router = express.Router();

// POST /api/auth/register - Créer un utilisateur
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier que username et password sont fournis
    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    // Créer l'utilisateur (le pre-save hashera le password)
    const user = await User.create({ username, password });

    res.status(201).json({ message: 'Utilisateur créé avec succès', username: user.username });
  } catch (error) {
    // Erreur de doublon
    if (error.code === 11000) {
      return res.status(400).json({ error: 'Username déjà utilisé' });
    }
    console.error('Erreur register:', error);
    res.status(400).json({ error: error.message });
  }
});

// POST /api/auth/login - Connexion et génération de JWT
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Vérifier que username et password sont fournis
    if (!username || !password) {
      return res.status(400).json({ error: 'Username et password requis' });
    }

    // Chercher l'utilisateur
    const user = await User.findOne({ username });

    if (!user) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Vérifier le password
    const isValid = await user.comparePassword(password);

    if (!isValid) {
      return res.status(401).json({ error: 'Identifiants invalides' });
    }

    // Générer le JWT
    if (!process.env.JWT_SECRET) {
      return res.status(500).json({ error: 'JWT_SECRET non configuré' });
    }

    const token = jwt.sign(
      { id: user._id, username: user.username },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({ token });
  } catch (error) {
    console.error('Erreur login:', error);
    res.status(500).json({ error: error.message });
  }
});

export default router;

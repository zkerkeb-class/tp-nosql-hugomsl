import express from 'express';
import Pokemon from '../models/pokemon.js';

const router = express.Router();

// GET /api/stats - Récupérer les statistiques avancées avec agrégation
router.get('/', async (req, res) => {
  try {
    // Nombre de Pokémon par type
    const byType = await Pokemon.aggregate([
      { $unwind: '$type' },
      { $group: { _id: '$type', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // Moyenne des HP par type
    const hpByType = await Pokemon.aggregate([
      { $unwind: '$type' },
      { $group: { _id: '$type', avgHP: { $avg: '$base.HP' } } },
      { $sort: { avgHP: -1 } }
    ]);

    // Pokémon avec le plus d'attaque
    const strongestAttack = await Pokemon.aggregate([
      { $sort: { 'base.Attack': -1 } },
      { $limit: 1 }
    ]);

    // Pokémon avec le plus de HP
    const highestHP = await Pokemon.aggregate([
      { $sort: { 'base.HP': -1 } },
      { $limit: 1 }
    ]);

    res.json({
      pokemonByType: byType,
      averageHPByType: hpByType,
      strongestAttack: strongestAttack[0],
      highestHP: highestHP[0]
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;

import mongoose from 'mongoose';
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  favorites: {
    type: [Number],
    default: []
  }
}, { timestamps: true });

// Pre-save middleware pour hasher le mot de passe
userSchema.pre('save', async function () {
  // Si le password n'a pas été modifié, ne pas le re-hasher
  if (!this.isModified('password')) return;

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
  } catch (error) {
    throw new Error('Erreur lors du hashage du mot de passe');
  }
});

// Méthode pour comparer les passwords
userSchema.methods.comparePassword = async function (passwordToCheck) {
  return await bcrypt.compare(passwordToCheck, this.password);
};

export default mongoose.model('User', userSchema);

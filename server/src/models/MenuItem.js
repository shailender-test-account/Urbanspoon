import mongoose from 'mongoose';

const menuItemSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    description: { type: String, trim: true },
    category: {
      type: String,
      enum: ['pizza', 'chicken', 'drinks', 'desserts', 'sides'],
      required: true,
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    image: { type: String },
    portion: { type: String, enum: ['regular', 'large', 'family'], default: 'regular' },
    dietary: [{ type: String, enum: ['vegetarian', 'vegan', 'spicy', 'gluten-free'] }],
    rating: { type: Number, default: 4.5, min: 0, max: 5 },
    reviews: { type: Number, default: 0 },
    popularity: { type: Number, default: 50 },
    prepTime: { type: String, default: '12-15 min' },
    badge: { type: String },
    available: { type: Boolean, default: true },
  },
  { timestamps: true }
);

export default mongoose.model('MenuItem', menuItemSchema);

const express = require('express');
const cors = require('cors');
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// In-memory storage
let ingredients = [];
let recipes = [];

// Ingredient routes
app.get('/api/ingredients', (req, res) => {
  res.json(ingredients);
});

app.post('/api/ingredients', (req, res) => {
  const ingredient = {
    id: Date.now(),
    ...req.body
  };
  ingredients.push(ingredient);
  res.status(201).json(ingredient);
});

app.delete('/api/ingredients/:id', (req, res) => {
  const id = parseInt(req.params.id);
  ingredients = ingredients.filter(ing => ing.id !== id);
  res.json({ success: true });
});

// Recipe routes
app.get('/api/recipes', (req, res) => {
  res.json(recipes);
});

app.post('/api/recipes', (req, res) => {
  const recipe = {
    id: Date.now(),
    ...req.body
  };
  recipes.push(recipe);
  res.status(201).json(recipe);
});

app.delete('/api/recipes/:id', (req, res) => {
  const id = parseInt(req.params.id);
  recipes = recipes.filter(recipe => recipe.id !== id);
  res.json({ success: true });
});

// Add sample data
ingredients = [
  {
    id: 1,
    name: 'Coffee Beans (Arabica)',
    costPerUnit: 800,
    unit: 'kg',
    stock: 10
  },
  {
    id: 2,
    name: 'Milk',
    costPerUnit: 60,
    unit: 'liter',
    stock: 50
  },
  {
    id: 3,
    name: 'Sugar',
    costPerUnit: 40,
    unit: 'kg',
    stock: 25
  }
];

recipes = [
  {
    id: 1,
    name: 'Classic Cappuccino',
    ingredients: [
      { ingredientId: 1, quantity: 0.018 },
      { ingredientId: 2, quantity: 0.18 }
    ],
    sellingPrice: 180,
    averageMonthlySales: 450
  }
];

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

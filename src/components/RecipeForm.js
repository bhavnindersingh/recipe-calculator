import React, { useState } from 'react';
import '../styles/RecipeForm.css';

const RecipeForm = ({ onSaveRecipe }) => {
  const [recipeName, setRecipeName] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '', cost: '' }]);

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: '', quantity: '', cost: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const calculateTotalCost = () => {
    return ingredients.reduce((total, ing) => total + (parseFloat(ing.cost) || 0), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const totalCost = calculateTotalCost();
    const recipe = {
      name: recipeName,
      ingredients,
      totalCost,
      timestamp: new Date().toISOString(),
    };
    onSaveRecipe(recipe);
    setRecipeName('');
    setIngredients([{ name: '', quantity: '', cost: '' }]);
  };

  return (
    <div className="recipe-form">
      <h2>Add New Recipe</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>Recipe Name:</label>
          <input
            type="text"
            value={recipeName}
            onChange={(e) => setRecipeName(e.target.value)}
            required
          />
        </div>

        {ingredients.map((ingredient, index) => (
          <div key={index} className="ingredient-row">
            <input
              type="text"
              placeholder="Ingredient name"
              value={ingredient.name}
              onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
              required
            />
            <input
              type="text"
              placeholder="Quantity"
              value={ingredient.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
              required
            />
            <input
              type="number"
              placeholder="Cost"
              value={ingredient.cost}
              onChange={(e) => handleIngredientChange(index, 'cost', e.target.value)}
              required
            />
          </div>
        ))}

        <button type="button" onClick={handleAddIngredient}>
          Add Ingredient
        </button>

        <div className="total-cost">
          Total Cost: ${calculateTotalCost().toFixed(2)}
        </div>

        <button type="submit">Save Recipe</button>
      </form>
    </div>
  );
};

export default RecipeForm;

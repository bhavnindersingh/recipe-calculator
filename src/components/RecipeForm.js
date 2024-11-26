import React, { useState } from 'react';
import '../styles/RecipeForm.css';

const RecipeForm = ({ onSaveRecipe, availableIngredients }) => {
  const [recipeName, setRecipeName] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [selectedIngredients, setSelectedIngredients] = useState([{ ingredientId: '', quantity: '' }]);

  const handleAddIngredient = () => {
    setSelectedIngredients([...selectedIngredients, { ingredientId: '', quantity: '' }]);
  };

  const handleIngredientChange = (index, field, value) => {
    const newIngredients = [...selectedIngredients];
    newIngredients[index][field] = value;
    setSelectedIngredients(newIngredients);
  };

  const calculateTotalCost = () => {
    return selectedIngredients.reduce((total, selected) => {
      const ingredient = availableIngredients.find(i => i.id === selected.ingredientId);
      if (ingredient && selected.quantity) {
        return total + (parseFloat(ingredient.cost) * parseFloat(selected.quantity));
      }
      return total;
    }, 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const recipeIngredients = selectedIngredients.map(selected => {
      const ingredient = availableIngredients.find(i => i.id === selected.ingredientId);
      return {
        ...ingredient,
        quantity: selected.quantity
      };
    });

    const recipe = {
      id: Date.now(),
      name: recipeName,
      ingredients: recipeIngredients,
      totalCost: calculateTotalCost(),
      sellingPrice,
      timestamp: new Date().toISOString(),
    };

    onSaveRecipe(recipe);
    setRecipeName('');
    setSellingPrice('');
    setSelectedIngredients([{ ingredientId: '', quantity: '' }]);
  };

  return (
    <div className="recipe-form">
      <h2>Create New Recipe</h2>
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

        <div className="form-group">
          <label>Selling Price (MRP):</label>
          <input
            type="number"
            step="0.01"
            value={sellingPrice}
            onChange={(e) => setSellingPrice(e.target.value)}
            required
          />
        </div>

        <h3>Ingredients</h3>
        {selectedIngredients.map((selected, index) => (
          <div key={index} className="ingredient-row">
            <select
              value={selected.ingredientId}
              onChange={(e) => handleIngredientChange(index, 'ingredientId', e.target.value)}
              required
            >
              <option value="">Select Ingredient</option>
              {availableIngredients.map(ingredient => (
                <option key={ingredient.id} value={ingredient.id}>
                  {ingredient.name} (${ingredient.cost}/{ingredient.unit})
                </option>
              ))}
            </select>
            <input
              type="number"
              step="0.01"
              placeholder="Quantity"
              value={selected.quantity}
              onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
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

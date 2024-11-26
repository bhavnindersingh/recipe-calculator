import React, { useState } from 'react';
import '../styles/RecipeForm.css';

function RecipeForm({ onSaveRecipe, availableIngredients }) {
  const [recipe, setRecipe] = useState({
    name: '',
    ingredients: [],
    sellingPrice: '',
    totalCost: 0
  });
  const [currentIngredient, setCurrentIngredient] = useState({
    ingredientId: '',
    quantity: ''
  });
  const [error, setError] = useState(null);

  const calculateTotalCost = (ingredients) => {
    return ingredients.reduce((total, item) => {
      const ingredient = availableIngredients.find(i => i._id === item.ingredientId);
      return total + (ingredient ? ingredient.cost * item.quantity : 0);
    }, 0);
  };

  const handleAddIngredient = (e) => {
    e.preventDefault();
    setError(null);

    if (!currentIngredient.ingredientId || !currentIngredient.quantity) {
      setError('Please select an ingredient and specify quantity');
      return;
    }

    const newIngredients = [...recipe.ingredients, currentIngredient];
    const totalCost = calculateTotalCost(newIngredients);

    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients,
      totalCost
    }));

    setCurrentIngredient({
      ingredientId: '',
      quantity: ''
    });
  };

  const handleRemoveIngredient = (index) => {
    const newIngredients = recipe.ingredients.filter((_, i) => i !== index);
    const totalCost = calculateTotalCost(newIngredients);

    setRecipe(prev => ({
      ...prev,
      ingredients: newIngredients,
      totalCost
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (!recipe.name || recipe.ingredients.length === 0 || !recipe.sellingPrice) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      await onSaveRecipe({
        ...recipe,
        sellingPrice: parseFloat(recipe.sellingPrice)
      });

      // Reset form
      setRecipe({
        name: '',
        ingredients: [],
        sellingPrice: '',
        totalCost: 0
      });
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
    }
  };

  return (
    <div className="recipe-form">
      <h2>Create New Recipe</h2>

      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label>
            Recipe Name*:
            <input
              type="text"
              value={recipe.name}
              onChange={(e) => setRecipe({ ...recipe, name: e.target.value })}
              placeholder="Enter recipe name"
            />
          </label>
        </div>

        <div className="ingredients-section">
          <h3>Add Ingredients</h3>
          <div className="add-ingredient-form">
            <select
              value={currentIngredient.ingredientId}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                ingredientId: e.target.value
              })}
            >
              <option value="">Select Ingredient</option>
              {availableIngredients.map((ingredient) => (
                <option key={ingredient._id} value={ingredient._id}>
                  {ingredient.name} (${ingredient.cost}/{ingredient.unit})
                </option>
              ))}
            </select>

            <input
              type="number"
              value={currentIngredient.quantity}
              onChange={(e) => setCurrentIngredient({
                ...currentIngredient,
                quantity: parseFloat(e.target.value)
              })}
              placeholder="Quantity"
              step="0.01"
              min="0"
            />

            <button
              type="button"
              onClick={handleAddIngredient}
              className="add-ingredient-btn"
            >
              Add
            </button>
          </div>

          <div className="ingredients-list">
            <h4>Recipe Ingredients</h4>
            <table>
              <thead>
                <tr>
                  <th>Ingredient</th>
                  <th>Quantity</th>
                  <th>Cost</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipe.ingredients.map((item, index) => {
                  const ingredient = availableIngredients.find(i => i._id === item.ingredientId);
                  return (
                    <tr key={index}>
                      <td>{ingredient?.name}</td>
                      <td>{item.quantity} {ingredient?.unit}</td>
                      <td>${(ingredient?.cost * item.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => handleRemoveIngredient(index)}
                          className="remove-btn"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <div className="form-group">
          <label>
            Selling Price*:
            <input
              type="number"
              value={recipe.sellingPrice}
              onChange={(e) => setRecipe({ ...recipe, sellingPrice: e.target.value })}
              placeholder="Enter selling price"
              step="0.01"
              min="0"
            />
          </label>
        </div>

        <div className="recipe-summary">
          <p>Total Cost: ${recipe.totalCost.toFixed(2)}</p>
          {recipe.sellingPrice && (
            <>
              <p>Profit: ${(recipe.sellingPrice - recipe.totalCost).toFixed(2)}</p>
              <p>Margin: {((recipe.sellingPrice - recipe.totalCost) / recipe.sellingPrice * 100).toFixed(1)}%</p>
            </>
          )}
        </div>

        <button type="submit" className="submit-button">Save Recipe</button>
      </form>
    </div>
  );
}

export default RecipeForm;

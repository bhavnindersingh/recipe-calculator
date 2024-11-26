import React from 'react';
import { api } from '../services/api';
import '../styles/RecipeList.css';

function RecipeList({ recipes }) {
  const [error, setError] = React.useState(null);

  const handleDelete = async (id) => {
    try {
      await api.deleteRecipe(id);
      // Refresh recipes list through parent component
      window.location.reload();
    } catch (err) {
      setError('Failed to delete recipe. Please try again.');
    }
  };

  if (recipes.length === 0) {
    return (
      <div className="recipe-list empty">
        <h3>No Recipes</h3>
        <p>Start by creating a new recipe above.</p>
      </div>
    );
  }

  return (
    <div className="recipe-list">
      <h3>Saved Recipes</h3>
      
      {error && <div className="error-message">{error}</div>}

      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Ingredients</th>
            <th>Total Cost</th>
            <th>Selling Price</th>
            <th>Profit</th>
            <th>Margin</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {recipes.map((recipe) => {
            const profit = recipe.sellingPrice - recipe.totalCost;
            const margin = (profit / recipe.sellingPrice * 100).toFixed(1);
            
            return (
              <tr key={recipe._id}>
                <td>{recipe.name}</td>
                <td>
                  <ul>
                    {recipe.ingredients.map((item, index) => {
                      const ingredient = item.ingredientId;
                      return (
                        <li key={index}>
                          {ingredient.name}: {item.quantity} {ingredient.unit}
                        </li>
                      );
                    })}
                  </ul>
                </td>
                <td>${recipe.totalCost.toFixed(2)}</td>
                <td>${recipe.sellingPrice.toFixed(2)}</td>
                <td>${profit.toFixed(2)}</td>
                <td>{margin}%</td>
                <td>
                  <button 
                    onClick={() => handleDelete(recipe._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default RecipeList;

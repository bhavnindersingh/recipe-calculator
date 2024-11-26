import React from 'react';
import '../styles/RecipeList.css';

const RecipeList = ({ recipes }) => {
  return (
    <div className="recipe-list">
      <h2>Saved Recipes</h2>
      <div className="recipes-grid">
        {recipes.map((recipe, index) => (
          <div key={index} className="recipe-card">
            <h3>{recipe.name}</h3>
            <div className="ingredients-list">
              <h4>Ingredients:</h4>
              <ul>
                {recipe.ingredients.map((ing, idx) => (
                  <li key={idx}>
                    {ing.name} - {ing.quantity} (${parseFloat(ing.cost).toFixed(2)})
                  </li>
                ))}
              </ul>
            </div>
            <div className="recipe-analytics">
              <p>Total Cost: ${recipe.totalCost.toFixed(2)}</p>
              <p>Date Added: {new Date(recipe.timestamp).toLocaleDateString()}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecipeList;

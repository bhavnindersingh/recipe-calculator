import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import './App.css';

function App() {
  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleSaveRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Calculator & Profitability Analytics</h1>
      </header>
      <main>
        <RecipeForm onSaveRecipe={handleSaveRecipe} />
        <RecipeList recipes={recipes} />
      </main>
    </div>
  );
}

export default App;

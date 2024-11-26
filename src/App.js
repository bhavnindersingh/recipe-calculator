import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import IngredientsManager from './components/IngredientsManager';
import ProfitabilityAnalysis from './components/ProfitabilityAnalysis';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [ingredients, setIngredients] = useState(() => {
    const savedIngredients = localStorage.getItem('ingredients');
    return savedIngredients ? JSON.parse(savedIngredients) : [];
  });

  const [recipes, setRecipes] = useState(() => {
    const savedRecipes = localStorage.getItem('recipes');
    return savedRecipes ? JSON.parse(savedRecipes) : [];
  });

  useEffect(() => {
    localStorage.setItem('ingredients', JSON.stringify(ingredients));
  }, [ingredients]);

  useEffect(() => {
    localStorage.setItem('recipes', JSON.stringify(recipes));
  }, [recipes]);

  const handleSaveRecipe = (recipe) => {
    setRecipes([...recipes, recipe]);
  };

  const handleAddIngredient = (ingredient) => {
    setIngredients([...ingredients, ingredient]);
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Recipe Calculator & Profitability Analytics</h1>
        <nav className="nav-tabs">
          <button 
            className={activeTab === 'ingredients' ? 'active' : ''} 
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button 
            className={activeTab === 'recipes' ? 'active' : ''} 
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button 
            className={activeTab === 'analysis' ? 'active' : ''} 
            onClick={() => setActiveTab('analysis')}
          >
            Profitability Analysis
          </button>
        </nav>
      </header>
      <main>
        {activeTab === 'ingredients' && (
          <IngredientsManager 
            onIngredientAdd={handleAddIngredient}
            ingredients={ingredients}
          />
        )}
        {activeTab === 'recipes' && (
          <>
            <RecipeForm 
              onSaveRecipe={handleSaveRecipe}
              availableIngredients={ingredients}
            />
            <RecipeList recipes={recipes} />
          </>
        )}
        {activeTab === 'analysis' && (
          <ProfitabilityAnalysis recipes={recipes} />
        )}
      </main>
    </div>
  );
}

export default App;

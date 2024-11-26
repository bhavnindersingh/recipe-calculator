import React, { useState, useEffect } from 'react';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import IngredientsManager from './components/IngredientsManager';
import ProfitabilityAnalysis from './components/ProfitabilityAnalysis';
import { api } from './services/api';
import './App.css';

function App() {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [ingredients, setIngredients] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [ingredientsData, recipesData] = await Promise.all([
          api.getIngredients(),
          api.getRecipes()
        ]);
        setIngredients(ingredientsData);
        setRecipes(recipesData);
        setLoading(false);
      } catch (err) {
        setError('Failed to fetch data. Please try again later.');
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleSaveRecipe = async (recipe) => {
    try {
      const newRecipe = await api.addRecipe(recipe);
      setRecipes([...recipes, newRecipe]);
    } catch (err) {
      setError('Failed to save recipe. Please try again.');
    }
  };

  const handleAddIngredient = async (ingredient) => {
    try {
      const newIngredient = await api.addIngredient(ingredient);
      setIngredients([...ingredients, newIngredient]);
    } catch (err) {
      setError('Failed to add ingredient. Please try again.');
    }
  };

  if (loading) {
    return <div className="loading">Loading...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

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

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

  if (loading) return <div className="loading">Loading...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="App">
      <header className="App-header">
        <h1>Conscious Cafe Recipe Calculator & MRP Analysis</h1>
      </header>
      
      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
          onClick={() => setActiveTab('ingredients')}
        >
          Ingredients
        </button>
        <button 
          className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
          onClick={() => setActiveTab('recipes')}
        >
          Recipes
        </button>
        <button 
          className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
          onClick={() => setActiveTab('analysis')}
        >
          Profitability Analysis
        </button>
      </div>

      <div className="tab-content">
        {activeTab === 'ingredients' && (
          <div className="tab-pane">
            <h2>Ingredients Management</h2>
            <IngredientsManager 
              ingredients={ingredients} 
              onAddIngredient={handleAddIngredient}
            />
          </div>
        )}
        
        {activeTab === 'recipes' && (
          <div className="tab-pane">
            <h2>Recipe Management</h2>
            <RecipeForm 
              ingredients={ingredients} 
              onSave={handleSaveRecipe}
            />
            <RecipeList recipes={recipes} />
          </div>
        )}
        
        {activeTab === 'analysis' && (
          <div className="tab-pane">
            <h2>Profitability Analysis</h2>
            <ProfitabilityAnalysis 
              recipes={recipes}
              ingredients={ingredients}
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

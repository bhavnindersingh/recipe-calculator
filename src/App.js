import React, { useState } from 'react';
import './App.css';
import IngredientsManager from './components/IngredientsManager';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import ProfitabilityAnalysis from './components/ProfitabilityAnalysis';
import { sampleIngredients, sampleRecipes } from './data/sampleData';

function App() {
  const [activeTab, setActiveTab] = useState('ingredients');
  const [ingredients, setIngredients] = useState(sampleIngredients);
  const [recipes, setRecipes] = useState(sampleRecipes);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>Conscious Cafe Recipe Calculator & MRP Analysis</h1>
        <div className="tab-container">
          <button
            className={`tab-button ${activeTab === 'ingredients' ? 'active' : ''}`}
            onClick={() => handleTabChange('ingredients')}
          >
            Ingredients
          </button>
          <button
            className={`tab-button ${activeTab === 'recipes' ? 'active' : ''}`}
            onClick={() => handleTabChange('recipes')}
          >
            Recipes
          </button>
          <button
            className={`tab-button ${activeTab === 'analysis' ? 'active' : ''}`}
            onClick={() => handleTabChange('analysis')}
          >
            Profitability Analysis
          </button>
        </div>
      </header>

      <main className="app-content">
        {activeTab === 'ingredients' && (
          <IngredientsManager 
            ingredients={ingredients}
            setIngredients={setIngredients}
          />
        )}
        {activeTab === 'recipes' && (
          <div className="recipes-container">
            <RecipeForm
              ingredients={ingredients}
              recipes={recipes}
              setRecipes={setRecipes}
            />
            <RecipeList
              recipes={recipes}
              setRecipes={setRecipes}
              ingredients={ingredients}
            />
          </div>
        )}
        {activeTab === 'analysis' && (
          <ProfitabilityAnalysis
            recipes={recipes}
            ingredients={ingredients}
          />
        )}
      </main>
    </div>
  );
}

export default App;

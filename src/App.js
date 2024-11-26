import React, { useState } from 'react';
import IngredientsManager from './components/IngredientsManager';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import { sampleIngredients, sampleRecipes } from './data/sampleData';
import './styles/shared.css';
import './styles/App.css';

function App() {
  const [ingredients, setIngredients] = useState(sampleIngredients);
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [activeTab, setActiveTab] = useState('ingredients');
  const [editingRecipe, setEditingRecipe] = useState(null);

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setActiveTab('create');
  };

  const handleUpdateRecipe = (updatedRecipe) => {
    setRecipes(prevRecipes => 
      prevRecipes.map(recipe => 
        recipe.id === updatedRecipe.id ? updatedRecipe : recipe
      )
    );
    setEditingRecipe(null);
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setActiveTab('recipes');
  };

  return (
    <div className="app-container">
      <header className="glass-card mb-4">
        <div className="header-content">
          <h1>Conscious Cafe Recipe Calculator</h1>
          <p className="text-secondary">Manage your recipes and track costs efficiently</p>
        </div>
      </header>

      <nav className="glass-card mb-4">
        <div className="nav-tabs">
          <button 
            className={`btn ${activeTab === 'ingredients' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('ingredients')}
          >
            Ingredients
          </button>
          <button 
            className={`btn ${activeTab === 'recipes' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('recipes')}
          >
            Recipes
          </button>
          <button 
            className={`btn ${activeTab === 'create' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setEditingRecipe(null);
              setActiveTab('create');
            }}
          >
            {editingRecipe ? 'Editing Recipe' : 'Create Recipe'}
          </button>
        </div>
      </nav>

      <main className="main-content">
        {activeTab === 'ingredients' && (
          <section className="glass-card fade-in">
            <IngredientsManager 
              ingredients={ingredients} 
              setIngredients={setIngredients} 
            />
          </section>
        )}

        {activeTab === 'recipes' && (
          <section className="glass-card fade-in">
            <RecipeList 
              recipes={recipes} 
              ingredients={ingredients}
              onEditRecipe={handleEditRecipe}
              setRecipes={setRecipes}
            />
          </section>
        )}

        {activeTab === 'create' && (
          <section className="glass-card fade-in">
            <RecipeForm 
              ingredients={ingredients}
              recipes={recipes}
              setRecipes={editingRecipe ? handleUpdateRecipe : setRecipes}
              editingRecipe={editingRecipe}
              onCancelEdit={handleCancelEdit}
            />
          </section>
        )}
      </main>

      <footer className="glass-card mt-4">
        <div className="footer-content">
          <p className="text-secondary text-center">
            {new Date().getFullYear()} Kavas Conscious Living LLP. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default App;

import React, { useState } from 'react';
import IngredientsManager from './components/IngredientsManager';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Analytics from './components/Analytics';
import Login from './components/Login';
import { sampleIngredients, sampleRecipes } from './data/sampleData';
import './styles/shared.css';
import './styles/App.css';

function App() {
  const [ingredients, setIngredients] = useState(sampleIngredients);
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [activeTab, setActiveTab] = useState('recipes');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setActiveTab('form');
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

  const handleAddRecipe = (recipe) => {
    if (editingRecipe) {
      setRecipes(recipes.map(r => r.id === recipe.id ? recipe : r));
      setEditingRecipe(null);
    } else {
      setRecipes([...recipes, { ...recipe, id: Date.now() }]);
    }
  };

  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  return (
    <>
      {!isAuthenticated ? (
        <Login onLogin={handleLogin} />
      ) : (
        <div className="app-container">
          <header className="glass-card mb-4">
            <div className="header-content">
              <h1>Conscious Cafe Recipe Calculator</h1>
              <p className="text-secondary">Manage your recipe's cost & track margin simbly</p>
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
                className={`btn ${activeTab === 'analytics' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => setActiveTab('analytics')}
              >
                Analytics
              </button>
              <button 
                className={`btn ${activeTab === 'form' ? 'btn-primary' : 'btn-secondary'}`}
                onClick={() => {
                  setEditingRecipe(null);
                  setActiveTab('form');
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

            {activeTab === 'analytics' && (
              <section className="glass-card fade-in">
                <Analytics recipes={recipes} />
              </section>
            )}

            {activeTab === 'form' && (
              <section className="glass-card fade-in">
                <RecipeForm 
                  ingredients={ingredients}
                  recipes={recipes}
                  setRecipes={editingRecipe ? handleUpdateRecipe : handleAddRecipe}
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
      )}
    </>
  );
}

export default App;

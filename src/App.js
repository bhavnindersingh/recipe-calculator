import React, { useState, useEffect, useRef } from 'react';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set } from 'firebase/database';
import IngredientsManager from './components/IngredientsManager';
import RecipeForm from './components/RecipeForm';
import RecipeList from './components/RecipeList';
import Analytics from './components/Analytics';
import Login from './components/Login';
import { sampleIngredients, sampleRecipes } from './data/sampleData';
import * as XLSX from 'xlsx';
import './styles/shared.css';
import './styles/App.css';

// Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_FIREBASE_DATABASE_URL,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

function App() {
  const fileInputRef = useRef(null);
  
  // Initialize state from Firebase or use sample data as fallback
  const [ingredients, setIngredients] = useState(sampleIngredients);
  const [recipes, setRecipes] = useState(sampleRecipes);
  const [activeTab, setActiveTab] = useState('recipes');
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Subscribe to Firebase data changes
  useEffect(() => {
    if (isAuthenticated) {
      const ingredientsRef = ref(database, 'ingredients');
      const recipesRef = ref(database, 'recipes');

      // Listen for ingredients changes
      const unsubIngredients = onValue(ingredientsRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setIngredients(data);
        }
      });

      // Listen for recipes changes
      const unsubRecipes = onValue(recipesRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          setRecipes(data);
        }
      });

      // Cleanup subscriptions
      return () => {
        unsubIngredients();
        unsubRecipes();
      };
    }
  }, [isAuthenticated]);

  // Save to Firebase whenever data changes
  useEffect(() => {
    if (isAuthenticated) {
      set(ref(database, 'ingredients'), ingredients);
    }
  }, [ingredients, isAuthenticated]);

  useEffect(() => {
    if (isAuthenticated) {
      set(ref(database, 'recipes'), recipes);
    }
  }, [recipes, isAuthenticated]);

  // Function to generate a sync code for current data
  const generateSyncCode = () => {
    const data = {
      ingredients,
      recipes,
      timestamp: new Date().toISOString()
    };
    const jsonString = JSON.stringify(data);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `recipe-sync-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  // Function to apply sync code
  const applySyncCode = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);
          if (data.ingredients && data.recipes) {
            setIngredients(data.ingredients);
            setRecipes(data.recipes);
            set(ref(database, 'ingredients'), data.ingredients);
            set(ref(database, 'recipes'), data.recipes);
            alert('Data synchronized successfully!');
          } else {
            alert('Invalid sync file format');
          }
        } catch (error) {
          alert('Error synchronizing data: ' + error.message);
        }
      };
      reader.readAsText(file);
    }
    event.target.value = '';
  };

  const handleEditRecipe = (recipe) => {
    setEditingRecipe(recipe);
    setActiveTab('form');
  };

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
    }
  };

  const handleCancelEdit = () => {
    setEditingRecipe(null);
    setActiveTab('recipes');
  };

  const handleRecipeSubmit = (recipe) => {
    setRecipes(prevRecipes => {
      if (editingRecipe) {
        return prevRecipes.map(r => r.id === editingRecipe.id ? recipe : r);
      } else {
        return [...prevRecipes, recipe];
      }
    });
    setEditingRecipe(null);
    setActiveTab('recipes');
  };

  const exportData = () => {
    // Prepare recipes worksheet
    const recipeRows = recipes.map(recipe => ({
      'Recipe Name': recipe.name,
      'Description': recipe.description,
      'Selling Price': recipe.sellingPrice,
      'Monthly Sales': recipe.averageMonthlySales,
      'Total Cost': recipe.totalCost,
      'Profit Margin': recipe.profitMargin,
      'Monthly Revenue': recipe.monthlyRevenue,
      'Monthly Profit': recipe.monthlyProfit
    }));

    // Prepare ingredients worksheet
    const ingredientRows = ingredients.map(ingredient => ({
      'Ingredient Name': ingredient.name,
      'Cost': ingredient.cost,
      'Cost Per Unit': ingredient.costPerUnit,
      'Unit': ingredient.unit,
      'Category': ingredient.category
    }));

    // Create recipe ingredients worksheet
    const recipeIngredientsRows = [];
    recipes.forEach(recipe => {
      recipe.ingredients.forEach(ing => {
        recipeIngredientsRows.push({
          'Recipe Name': recipe.name,
          'Ingredient Name': ing.name,
          'Quantity': ing.quantity,
          'Unit': ing.unit
        });
      });
    });

    // Create workbook with multiple sheets
    const wb = XLSX.utils.book_new();
    
    // Add worksheets
    const wsRecipes = XLSX.utils.json_to_sheet(recipeRows);
    const wsIngredients = XLSX.utils.json_to_sheet(ingredientRows);
    const wsRecipeIngredients = XLSX.utils.json_to_sheet(recipeIngredientsRows);
    
    XLSX.utils.book_append_sheet(wb, wsRecipes, 'Recipes');
    XLSX.utils.book_append_sheet(wb, wsIngredients, 'Ingredients');
    XLSX.utils.book_append_sheet(wb, wsRecipeIngredients, 'Recipe Ingredients');

    // Save the file
    XLSX.writeFile(wb, `recipe-data-${new Date().toISOString().split('T')[0]}.xlsx`);
  };

  const importData = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const workbook = XLSX.read(e.target.result, { type: 'array' });
          
          // Read ingredients
          const ingredientsSheet = workbook.Sheets['Ingredients'];
          if (ingredientsSheet) {
            const importedIngredients = XLSX.utils.sheet_to_json(ingredientsSheet)
              .map(row => ({
                id: Date.now() + Math.random(),
                name: row['Ingredient Name'],
                cost: parseFloat(row['Cost']) || 0,
                costPerUnit: parseFloat(row['Cost Per Unit']) || 0,
                unit: row['Unit'],
                category: row['Category']
              }));
            setIngredients(importedIngredients);
            set(ref(database, 'ingredients'), importedIngredients);
          }

          // Read recipes
          const recipesSheet = workbook.Sheets['Recipes'];
          const recipeIngredientsSheet = workbook.Sheets['Recipe Ingredients'];
          
          if (recipesSheet && recipeIngredientsSheet) {
            const recipesData = XLSX.utils.sheet_to_json(recipesSheet);
            const recipeIngredientsData = XLSX.utils.sheet_to_json(recipeIngredientsSheet);
            
            const importedRecipes = recipesData.map(row => {
              const recipeIngredients = recipeIngredientsData
                .filter(ri => ri['Recipe Name'] === row['Recipe Name'])
                .map(ri => ({
                  name: ri['Ingredient Name'],
                  quantity: parseFloat(ri['Quantity']) || 0,
                  unit: ri['Unit']
                }));

              return {
                id: Date.now() + Math.random(),
                name: row['Recipe Name'],
                description: row['Description'],
                sellingPrice: parseFloat(row['Selling Price']) || 0,
                averageMonthlySales: parseFloat(row['Monthly Sales']) || 0,
                ingredients: recipeIngredients,
                totalCost: parseFloat(row['Total Cost']) || 0,
                profitMargin: parseFloat(row['Profit Margin']) || 0,
                monthlyRevenue: parseFloat(row['Monthly Revenue']) || 0,
                monthlyProfit: parseFloat(row['Monthly Profit']) || 0
              };
            });

            setRecipes(importedRecipes);
            set(ref(database, 'recipes'), importedRecipes);
          }

          alert('Data imported successfully!');
        } catch (error) {
          console.error('Import error:', error);
          alert('Error importing data: ' + error.message);
        }
      };
      reader.readAsArrayBuffer(file);
    }
    event.target.value = '';
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
              <button 
                className={`btn`}
                onClick={exportData}
              >
                Export to Excel
              </button>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: 'none' }}
                accept=".xlsx, .xls"
                onChange={importData}
              />
              <button 
                className={`btn`}
                onClick={() => fileInputRef.current.click()}
              >
                Import from Excel
              </button>
              <button 
                className={`btn btn-info`}
                onClick={generateSyncCode}
              >
                Sync to Mobile
              </button>
              <input
                type="file"
                id="syncInput"
                style={{ display: 'none' }}
                accept=".json"
                onChange={applySyncCode}
              />
              <button 
                className={`btn btn-info`}
                onClick={() => document.getElementById('syncInput').click()}
              >
                Sync from Desktop
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
                  onEditRecipe={handleEditRecipe}
                  onDeleteRecipe={handleDeleteRecipe}
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
                  setRecipes={handleRecipeSubmit}
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

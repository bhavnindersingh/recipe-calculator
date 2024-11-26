import React, { useState, useMemo } from 'react';
import { RECIPE_CATEGORIES } from '../data/sampleData';
import '../styles/RecipeList.css';

const ITEMS_PER_PAGE = 10;

const RecipeList = ({ recipes, ingredients, onEditRecipe, setRecipes }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('asc');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);

  const handleDeleteRecipe = (recipeId) => {
    if (window.confirm('Are you sure you want to delete this recipe?')) {
      setRecipes(prevRecipes => prevRecipes.filter(recipe => recipe.id !== recipeId));
    }
  };

  // Filter and sort recipes
  const filteredAndSortedRecipes = useMemo(() => {
    return recipes
      .filter(recipe => {
        const matchesSearch = recipe.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            recipe.description.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = selectedCategory === 'all' || recipe.category === selectedCategory;
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => {
        let compareA, compareB;
        switch (sortBy) {
          case 'profitMargin':
            compareA = a.profitMargin;
            compareB = b.profitMargin;
            break;
          case 'monthlySales':
            compareA = a.averageMonthlySales;
            compareB = b.averageMonthlySales;
            break;
          default:
            compareA = a.name.toLowerCase();
            compareB = b.name.toLowerCase();
        }
        return sortOrder === 'asc' 
          ? compareA > compareB ? 1 : -1
          : compareA < compareB ? 1 : -1;
      });
  }, [recipes, searchTerm, selectedCategory, sortBy, sortOrder]);

  // Pagination
  const totalPages = Math.ceil(filteredAndSortedRecipes.length / ITEMS_PER_PAGE);
  const paginatedRecipes = filteredAndSortedRecipes.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleSort = (newSortBy) => {
    if (sortBy === newSortBy) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(newSortBy);
      setSortOrder('asc');
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
    setExpandedRecipeId(null);
  };

  const toggleRecipeExpansion = (recipeId) => {
    setExpandedRecipeId(expandedRecipeId === recipeId ? null : recipeId);
  };

  if (recipes.length === 0) {
    return (
      <div className="recipe-list-container">
        <div className="glass-card text-center text-secondary p-4">
          No recipes created yet. Create your first recipe to get started!
        </div>
      </div>
    );
  }

  return (
    <div className="recipe-list-container">
      <div className="recipe-controls">
        <input
          type="text"
          placeholder="Search recipes..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1);
          }}
          className="search-input"
        />
        
        <select
          value={selectedCategory}
          onChange={(e) => {
            setSelectedCategory(e.target.value);
            setCurrentPage(1);
          }}
          className="category-select"
        >
          <option value="all">All Categories</option>
          {RECIPE_CATEGORIES.map(category => (
            <option key={category} value={category}>{category}</option>
          ))}
        </select>

        <div className="sort-controls">
          <button 
            onClick={() => handleSort('name')}
            className={`sort-button ${sortBy === 'name' ? 'active' : ''}`}
          >
            Name {sortBy === 'name' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('profitMargin')}
            className={`sort-button ${sortBy === 'profitMargin' ? 'active' : ''}`}
          >
            Profit Margin {sortBy === 'profitMargin' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
          <button 
            onClick={() => handleSort('monthlySales')}
            className={`sort-button ${sortBy === 'monthlySales' ? 'active' : ''}`}
          >
            Monthly Sales {sortBy === 'monthlySales' && (sortOrder === 'asc' ? '↑' : '↓')}
          </button>
        </div>
      </div>

      <div className="recipes-summary">
        <p>Showing {paginatedRecipes.length} of {filteredAndSortedRecipes.length} recipes</p>
      </div>

      <div className="recipe-grid">
        {paginatedRecipes.map(recipe => (
          <div key={recipe.id} className="recipe-card">
            <div className="recipe-header">
              <h3>{recipe.name}</h3>
              <span className="recipe-category">{recipe.category}</span>
            </div>
            
            <div className="recipe-metrics">
              <div>Profit Margin: {recipe.profitMargin.toFixed(1)}%</div>
              <div>Monthly Sales: {recipe.averageMonthlySales}</div>
            </div>

            <div className="recipe-actions">
              <button onClick={() => toggleRecipeExpansion(recipe.id)}>
                {expandedRecipeId === recipe.id ? 'Show Less' : 'Show More'}
              </button>
              <button onClick={() => onEditRecipe(recipe)}>Edit</button>
              <button onClick={() => handleDeleteRecipe(recipe.id)}>Delete</button>
            </div>

            {expandedRecipeId === recipe.id && (
              <div className="recipe-details">
                <p>{recipe.description}</p>
                <h4>Ingredients:</h4>
                <ul>
                  {recipe.ingredients.map((ing, index) => (
                    <li key={index}>
                      {ing.name}: {ing.quantity} {ing.unit}
                    </li>
                  ))}
                </ul>
                <div className="financial-details">
                  <p>Cost: ₹{recipe.totalCost.toFixed(2)}</p>
                  <p>Price: ₹{Number(recipe.sellingPrice).toFixed(2)}</p>
                  <p>Monthly Revenue: ₹{recipe.monthlyRevenue.toFixed(2)}</p>
                  <p>Monthly Profit: ₹{recipe.monthlyProfit.toFixed(2)}</p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button 
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Previous
          </button>
          {[...Array(totalPages)].map((_, i) => (
            <button
              key={i + 1}
              onClick={() => handlePageChange(i + 1)}
              className={currentPage === i + 1 ? 'active' : ''}
            >
              {i + 1}
            </button>
          ))}
          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default RecipeList;

import React, { useState, useEffect } from 'react';
import { RECIPE_CATEGORIES } from '../data/sampleData';
import '../styles/shared.css';
import '../styles/RecipeForm.css';

const RecipeForm = ({ ingredients, recipes, setRecipes, editingRecipe, onCancelEdit }) => {
  const [recipe, setRecipe] = useState({
    name: '',
    description: '',
    category: '',
    ingredients: [],
    sellingPrice: '',
    averageMonthlySales: ''
  });
  const [selectedIngredient, setSelectedIngredient] = useState({
    id: '',
    quantity: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    if (editingRecipe) {
      setRecipe(editingRecipe);
    }
  }, [editingRecipe]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setRecipe(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
  };

  const handleIngredientSelect = (e) => {
    const { name, value } = e.target;
    setSelectedIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const addIngredientToRecipe = () => {
    if (!selectedIngredient.id || !selectedIngredient.quantity) {
      setError('Please select an ingredient and specify quantity');
      return;
    }

    const ingredient = ingredients.find(i => i.id === parseInt(selectedIngredient.id));
    if (!ingredient) {
      setError('Invalid ingredient selected');
      return;
    }

    const quantity = parseFloat(selectedIngredient.quantity);
    if (isNaN(quantity) || quantity <= 0) {
      setError('Quantity must be a positive number');
      return;
    }

    const existingIndex = recipe.ingredients.findIndex(i => i.id === parseInt(selectedIngredient.id));
    if (existingIndex !== -1) {
      setRecipe(prev => ({
        ...prev,
        ingredients: prev.ingredients.map((item, index) => 
          index === existingIndex 
            ? { ...item, quantity: item.quantity + quantity }
            : item
        )
      }));
    } else {
      setRecipe(prev => ({
        ...prev,
        ingredients: [...prev.ingredients, { ...ingredient, quantity }]
      }));
    }

    setSelectedIngredient({ id: '', quantity: '' });
    setError('');
  };

  const removeIngredient = (id) => {
    setRecipe(prev => ({
      ...prev,
      ingredients: prev.ingredients.filter(i => i.id !== id)
    }));
  };

  const calculateTotalCost = () => {
    return recipe.ingredients.reduce((total, { cost, quantity }) => total + (cost * quantity), 0);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!recipe.name.trim()) {
      setError('Recipe name is required');
      return;
    }

    if (!recipe.category) {
      setError('Please select a category');
      return;
    }

    if (recipe.ingredients.length === 0) {
      setError('Add at least one ingredient');
      return;
    }

    if (!recipe.sellingPrice || isNaN(recipe.sellingPrice) || Number(recipe.sellingPrice) <= 0) {
      setError('Selling price must be a positive number');
      return;
    }

    if (!recipe.averageMonthlySales || isNaN(recipe.averageMonthlySales) || Number(recipe.averageMonthlySales) <= 0) {
      setError('Average monthly sales must be a positive number');
      return;
    }

    const totalCost = calculateTotalCost();
    const sellingPrice = Number(recipe.sellingPrice);
    const averageMonthlySales = Number(recipe.averageMonthlySales);
    const profit = sellingPrice - totalCost;
    const profitMargin = (profit / sellingPrice) * 100;
    const monthlyRevenue = sellingPrice * averageMonthlySales;
    const monthlyProfit = profit * averageMonthlySales;

    const updatedRecipe = {
      ...recipe,
      id: editingRecipe ? editingRecipe.id : Date.now(),
      totalCost,
      profit,
      profitMargin,
      monthlyRevenue,
      monthlyProfit
    };

    setRecipes(prevRecipes => {
      if (editingRecipe) {
        return prevRecipes.map(recipe => recipe.id === editingRecipe.id ? updatedRecipe : recipe);
      } else {
        return [...prevRecipes, updatedRecipe];
      }
    });

    if (!editingRecipe) {
      setRecipe({
        name: '',
        description: '',
        category: '',
        ingredients: [],
        sellingPrice: '',
        averageMonthlySales: ''
      });
    }

    setError('');
  };

  const totalCost = calculateTotalCost();
  const profit = recipe.sellingPrice ? Number(recipe.sellingPrice) - totalCost : 0;
  const profitMargin = recipe.sellingPrice ? (profit / Number(recipe.sellingPrice)) * 100 : 0;
  const monthlyRevenue = recipe.sellingPrice && recipe.averageMonthlySales 
    ? Number(recipe.sellingPrice) * Number(recipe.averageMonthlySales) 
    : 0;
  const monthlyProfit = profit * (recipe.averageMonthlySales ? Number(recipe.averageMonthlySales) : 0);

  return (
    <div className="recipe-form">
      <div className="form-header mb-4">
        <h2>{editingRecipe ? 'Edit Recipe' : 'Create New Recipe'}</h2>
        {editingRecipe && (
          <button 
            type="button" 
            className="btn btn-secondary"
            onClick={onCancelEdit}
          >
            Cancel Edit
          </button>
        )}
      </div>

      <form onSubmit={handleSubmit} className="neo-card mb-4">
        <div className="form-grid">
          <div className="form-group">
            <label className="form-label" htmlFor="name">Recipe Name</label>
            <input
              type="text"
              id="name"
              name="name"
              className="form-input"
              value={recipe.name}
              onChange={handleInputChange}
              placeholder="Enter recipe name"
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="category">Category</label>
            <select
              id="category"
              value={recipe.category}
              onChange={handleInputChange}
              className="form-input form-select"
              name="category"
            >
              <option value="">Select a category</option>
              {RECIPE_CATEGORIES.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              className="form-input"
              value={recipe.description}
              onChange={handleInputChange}
              placeholder="Enter recipe description"
              rows="3"
            />
          </div>
        </div>

        <div className="ingredients-section glass-card mb-4">
          <h3 className="mb-3">Add Ingredients</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="ingredientId">Select Ingredient</label>
              <select
                id="ingredientId"
                name="id"
                className="form-input form-select"
                value={selectedIngredient.id}
                onChange={handleIngredientSelect}
              >
                <option value="">Choose ingredient</option>
                {ingredients.map(ingredient => (
                  <option key={ingredient.id} value={ingredient.id}>
                    {ingredient.name} (₹{ingredient.cost}/{ingredient.unit})
                  </option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="quantity">Quantity</label>
              <input
                type="number"
                id="quantity"
                name="quantity"
                className="form-input"
                value={selectedIngredient.quantity}
                onChange={handleIngredientSelect}
                placeholder="Enter quantity"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">&nbsp;</label>
              <button
                type="button"
                className="btn btn-secondary"
                onClick={addIngredientToRecipe}
              >
                Add to Recipe
              </button>
            </div>
          </div>

          {recipe.ingredients.length > 0 && (
            <div className="table-container mt-4">
              <table className="modern-table">
                <thead>
                  <tr>
                    <th>Ingredient</th>
                    <th>Quantity</th>
                    <th>Unit Cost</th>
                    <th>Total</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {recipe.ingredients.map(ingredient => (
                    <tr key={ingredient.id}>
                      <td>{ingredient.name}</td>
                      <td>{ingredient.quantity} {ingredient.unit}</td>
                      <td>₹{ingredient.cost}</td>
                      <td>₹{(ingredient.cost * ingredient.quantity).toFixed(2)}</td>
                      <td>
                        <button
                          type="button"
                          onClick={() => removeIngredient(ingredient.id)}
                          className="btn btn-danger"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="pricing-section glass-card mb-4">
          <h3 className="mb-3">Pricing & Sales Analysis</h3>
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label" htmlFor="sellingPrice">Selling Price (₹)</label>
              <input
                type="number"
                id="sellingPrice"
                name="sellingPrice"
                className="form-input"
                value={recipe.sellingPrice}
                onChange={handleInputChange}
                placeholder="Enter selling price"
                step="0.01"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="averageMonthlySales">Average Monthly Sales</label>
              <input
                type="number"
                id="averageMonthlySales"
                name="averageMonthlySales"
                className="form-input"
                value={recipe.averageMonthlySales}
                onChange={handleInputChange}
                placeholder="Enter average monthly sales"
                min="0"
              />
            </div>

            <div className="form-group">
              <label className="form-label">Total Cost</label>
              <div className="form-static">₹{totalCost.toFixed(2)}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Profit per Unit</label>
              <div className="form-static">₹{profit.toFixed(2)}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Profit Margin</label>
              <div className="form-static">{profitMargin.toFixed(1)}%</div>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Revenue</label>
              <div className="form-static">₹{monthlyRevenue.toFixed(2)}</div>
            </div>

            <div className="form-group">
              <label className="form-label">Monthly Profit</label>
              <div className="form-static">₹{monthlyProfit.toFixed(2)}</div>
            </div>
          </div>
        </div>

        {error && <p className="error-message text-error mb-3">{error}</p>}

        <div className="form-actions">
          <button type="submit" className="btn btn-primary">
            {editingRecipe ? 'Update Recipe' : 'Create Recipe'}
          </button>
          {editingRecipe && (
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={onCancelEdit}
            >
              Cancel
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default RecipeForm;

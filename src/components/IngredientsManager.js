import React, { useState } from 'react';
import { api } from '../services/api';
import '../styles/IngredientsManager.css';

function IngredientsManager({ ingredients, onIngredientAdd }) {
  const [newIngredient, setNewIngredient] = useState({
    name: '',
    unit: '',
    cost: '',
    supplier: '',
    minQuantity: ''
  });
  const [error, setError] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewIngredient(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    // Validate inputs
    if (!newIngredient.name || !newIngredient.unit || !newIngredient.cost) {
      setError('Please fill in all required fields (name, unit, cost)');
      return;
    }

    try {
      await onIngredientAdd({
        ...newIngredient,
        cost: parseFloat(newIngredient.cost),
        minQuantity: newIngredient.minQuantity ? parseFloat(newIngredient.minQuantity) : 0
      });

      // Reset form
      setNewIngredient({
        name: '',
        unit: '',
        cost: '',
        supplier: '',
        minQuantity: ''
      });
    } catch (err) {
      setError('Failed to add ingredient. Please try again.');
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.deleteIngredient(id);
      // Refresh ingredients list through parent component
      window.location.reload();
    } catch (err) {
      setError('Failed to delete ingredient. Please try again.');
    }
  };

  return (
    <div className="ingredients-manager">
      <h2>Manage Ingredients</h2>
      
      {error && <div className="error-message">{error}</div>}

      <form onSubmit={handleSubmit} className="ingredient-form">
        <div className="form-group">
          <label>
            Name*:
            <input
              type="text"
              name="name"
              value={newIngredient.name}
              onChange={handleInputChange}
              placeholder="Ingredient name"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Unit*:
            <input
              type="text"
              name="unit"
              value={newIngredient.unit}
              onChange={handleInputChange}
              placeholder="e.g., kg, g, L"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Cost per unit*:
            <input
              type="number"
              name="cost"
              value={newIngredient.cost}
              onChange={handleInputChange}
              placeholder="Cost per unit"
              step="0.01"
              min="0"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Supplier:
            <input
              type="text"
              name="supplier"
              value={newIngredient.supplier}
              onChange={handleInputChange}
              placeholder="Supplier name"
            />
          </label>
        </div>

        <div className="form-group">
          <label>
            Minimum Order Quantity:
            <input
              type="number"
              name="minQuantity"
              value={newIngredient.minQuantity}
              onChange={handleInputChange}
              placeholder="Minimum quantity"
              step="0.01"
              min="0"
            />
          </label>
        </div>

        <button type="submit" className="submit-button">Add Ingredient</button>
      </form>

      <div className="ingredients-list">
        <h3>Current Ingredients</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Unit</th>
              <th>Cost/Unit</th>
              <th>Supplier</th>
              <th>Min Quantity</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ingredient) => (
              <tr key={ingredient._id}>
                <td>{ingredient.name}</td>
                <td>{ingredient.unit}</td>
                <td>${ingredient.cost.toFixed(2)}</td>
                <td>{ingredient.supplier || '-'}</td>
                <td>{ingredient.minQuantity || '-'}</td>
                <td>
                  <button 
                    onClick={() => handleDelete(ingredient._id)}
                    className="delete-button"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default IngredientsManager;

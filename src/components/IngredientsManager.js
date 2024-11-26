import React, { useState } from 'react';
import '../styles/IngredientsManager.css';

const IngredientsManager = ({ onIngredientAdd, ingredients }) => {
  const [ingredient, setIngredient] = useState({
    name: '',
    cost: '',
    unit: '',
    supplier: '',
    minQuantity: '',
    supplierContact: '',
    lastUpdated: ''
  });

  const units = ['kg', 'g', 'l', 'ml', 'units', 'dozen'];

  const handleSubmit = (e) => {
    e.preventDefault();
    onIngredientAdd({
      ...ingredient,
      id: Date.now(),
      lastUpdated: new Date().toISOString()
    });
    setIngredient({
      name: '',
      cost: '',
      unit: '',
      supplier: '',
      minQuantity: '',
      supplierContact: '',
      lastUpdated: ''
    });
  };

  return (
    <div className="ingredients-manager">
      <h2>Ingredient Management</h2>
      <form onSubmit={handleSubmit} className="ingredient-form">
        <div className="form-row">
          <div className="form-group">
            <label>Name:</label>
            <input
              type="text"
              value={ingredient.name}
              onChange={(e) => setIngredient({...ingredient, name: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Cost (per unit):</label>
            <input
              type="number"
              step="0.01"
              value={ingredient.cost}
              onChange={(e) => setIngredient({...ingredient, cost: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Unit:</label>
            <select
              value={ingredient.unit}
              onChange={(e) => setIngredient({...ingredient, unit: e.target.value})}
              required
            >
              <option value="">Select Unit</option>
              {units.map(unit => (
                <option key={unit} value={unit}>{unit}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label>Minimum Quantity:</label>
            <input
              type="number"
              value={ingredient.minQuantity}
              onChange={(e) => setIngredient({...ingredient, minQuantity: e.target.value})}
              required
            />
          </div>
        </div>

        <div className="form-row">
          <div className="form-group">
            <label>Supplier:</label>
            <input
              type="text"
              value={ingredient.supplier}
              onChange={(e) => setIngredient({...ingredient, supplier: e.target.value})}
              required
            />
          </div>
          <div className="form-group">
            <label>Supplier Contact:</label>
            <input
              type="text"
              value={ingredient.supplierContact}
              onChange={(e) => setIngredient({...ingredient, supplierContact: e.target.value})}
              required
            />
          </div>
        </div>

        <button type="submit" className="submit-btn">Add Ingredient</button>
      </form>

      <div className="ingredients-list">
        <h3>Current Ingredients</h3>
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Cost</th>
              <th>Unit</th>
              <th>Supplier</th>
              <th>Min Quantity</th>
              <th>Last Updated</th>
            </tr>
          </thead>
          <tbody>
            {ingredients.map((ing) => (
              <tr key={ing.id}>
                <td>{ing.name}</td>
                <td>${parseFloat(ing.cost).toFixed(2)}</td>
                <td>{ing.unit}</td>
                <td>{ing.supplier}</td>
                <td>{ing.minQuantity} {ing.unit}</td>
                <td>{new Date(ing.lastUpdated).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default IngredientsManager;

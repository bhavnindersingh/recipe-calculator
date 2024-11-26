import React, { useState } from 'react';
import '../styles/ProfitabilityAnalysis.css';

function ProfitabilityAnalysis({ recipes }) {
  const [sortField, setSortField] = useState('margin');
  const [sortOrder, setSortOrder] = useState('desc');

  const calculateMetrics = (recipe) => {
    const profit = recipe.sellingPrice - recipe.totalCost;
    const margin = (profit / recipe.sellingPrice) * 100;
    const roi = (profit / recipe.totalCost) * 100;

    return {
      profit,
      margin,
      roi
    };
  };

  const sortRecipes = (recipes) => {
    return [...recipes].sort((a, b) => {
      let aValue, bValue;

      switch (sortField) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          return sortOrder === 'asc' 
            ? aValue.localeCompare(bValue)
            : bValue.localeCompare(aValue);

        case 'totalCost':
          aValue = a.totalCost;
          bValue = b.totalCost;
          break;

        case 'sellingPrice':
          aValue = a.sellingPrice;
          bValue = b.sellingPrice;
          break;

        case 'profit':
          aValue = calculateMetrics(a).profit;
          bValue = calculateMetrics(b).profit;
          break;

        case 'margin':
          aValue = calculateMetrics(a).margin;
          bValue = calculateMetrics(b).margin;
          break;

        case 'roi':
          aValue = calculateMetrics(a).roi;
          bValue = calculateMetrics(b).roi;
          break;

        default:
          return 0;
      }

      return sortOrder === 'asc' ? aValue - bValue : bValue - aValue;
    });
  };

  const handleSort = (field) => {
    if (field === sortField) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
  };

  const getSortIndicator = (field) => {
    if (field === sortField) {
      return sortOrder === 'asc' ? ' ↑' : ' ↓';
    }
    return '';
  };

  const sortedRecipes = sortRecipes(recipes);

  if (recipes.length === 0) {
    return (
      <div className="profitability-analysis empty">
        <h3>No Data Available</h3>
        <p>Add some recipes to see profitability analysis.</p>
      </div>
    );
  }

  return (
    <div className="profitability-analysis">
      <h2>Profitability Analysis</h2>

      <div className="summary-metrics">
        <div className="metric-card">
          <h3>Average Profit Margin</h3>
          <p>
            {(sortedRecipes.reduce((sum, recipe) => 
              sum + calculateMetrics(recipe).margin, 0) / sortedRecipes.length).toFixed(1)}%
          </p>
        </div>
        <div className="metric-card">
          <h3>Average ROI</h3>
          <p>
            {(sortedRecipes.reduce((sum, recipe) => 
              sum + calculateMetrics(recipe).roi, 0) / sortedRecipes.length).toFixed(1)}%
          </p>
        </div>
        <div className="metric-card">
          <h3>Total Revenue</h3>
          <p>
            ${sortedRecipes.reduce((sum, recipe) => 
              sum + recipe.sellingPrice, 0).toFixed(2)}
          </p>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th onClick={() => handleSort('name')}>
              Recipe Name{getSortIndicator('name')}
            </th>
            <th onClick={() => handleSort('totalCost')}>
              Cost{getSortIndicator('totalCost')}
            </th>
            <th onClick={() => handleSort('sellingPrice')}>
              Price{getSortIndicator('sellingPrice')}
            </th>
            <th onClick={() => handleSort('profit')}>
              Profit{getSortIndicator('profit')}
            </th>
            <th onClick={() => handleSort('margin')}>
              Margin{getSortIndicator('margin')}
            </th>
            <th onClick={() => handleSort('roi')}>
              ROI{getSortIndicator('roi')}
            </th>
            <th>Ingredient Breakdown</th>
          </tr>
        </thead>
        <tbody>
          {sortedRecipes.map((recipe) => {
            const metrics = calculateMetrics(recipe);
            
            return (
              <tr key={recipe._id}>
                <td>{recipe.name}</td>
                <td>${recipe.totalCost.toFixed(2)}</td>
                <td>${recipe.sellingPrice.toFixed(2)}</td>
                <td>${metrics.profit.toFixed(2)}</td>
                <td>{metrics.margin.toFixed(1)}%</td>
                <td>{metrics.roi.toFixed(1)}%</td>
                <td>
                  <ul className="ingredient-breakdown">
                    {recipe.ingredients.map((item, index) => {
                      const ingredient = item.ingredientId;
                      const cost = ingredient.cost * item.quantity;
                      const percentage = (cost / recipe.totalCost * 100).toFixed(1);
                      
                      return (
                        <li key={index}>
                          {ingredient.name}: ${cost.toFixed(2)} ({percentage}%)
                        </li>
                      );
                    })}
                  </ul>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

export default ProfitabilityAnalysis;

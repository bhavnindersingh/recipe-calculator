import React from 'react';
import '../styles/ProfitabilityAnalysis.css';

const ProfitabilityAnalysis = ({ recipes }) => {
  const calculateMetrics = (recipe) => {
    const cogs = recipe.ingredients.reduce((total, ing) => total + parseFloat(ing.cost) * parseFloat(ing.quantity), 0);
    const mrp = parseFloat(recipe.sellingPrice || 0);
    const grossProfit = mrp - cogs;
    const grossMargin = (grossProfit / mrp) * 100;
    
    return {
      cogs: cogs.toFixed(2),
      grossProfit: grossProfit.toFixed(2),
      grossMargin: grossMargin.toFixed(2)
    };
  };

  return (
    <div className="profitability-analysis">
      <h2>Profitability Analysis</h2>
      <div className="analysis-table">
        <table>
          <thead>
            <tr>
              <th>Recipe Name</th>
              <th>COGS</th>
              <th>MRP</th>
              <th>Gross Profit</th>
              <th>Gross Margin %</th>
              <th>Ingredients Cost Breakdown</th>
            </tr>
          </thead>
          <tbody>
            {recipes.map((recipe) => {
              const metrics = calculateMetrics(recipe);
              return (
                <tr key={recipe.id}>
                  <td>{recipe.name}</td>
                  <td>${metrics.cogs}</td>
                  <td>${recipe.sellingPrice || '0.00'}</td>
                  <td>${metrics.grossProfit}</td>
                  <td>{metrics.grossMargin}%</td>
                  <td>
                    <details>
                      <summary>View Details</summary>
                      <ul className="ingredients-breakdown">
                        {recipe.ingredients.map((ing, idx) => (
                          <li key={idx}>
                            {ing.name}: ${(parseFloat(ing.cost) * parseFloat(ing.quantity)).toFixed(2)}
                            ({ing.quantity} {ing.unit})
                          </li>
                        ))}
                      </ul>
                    </details>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default ProfitabilityAnalysis;

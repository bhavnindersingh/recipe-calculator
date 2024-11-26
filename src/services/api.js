const API_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8888/.netlify/functions'
  : '/.netlify/functions';

export const api = {
  // Ingredient APIs
  async getIngredients() {
    const response = await fetch(`${API_URL}/ingredients`);
    if (!response.ok) {
      throw new Error('Failed to fetch ingredients');
    }
    return response.json();
  },

  async addIngredient(ingredient) {
    const response = await fetch(`${API_URL}/ingredients`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(ingredient),
    });
    if (!response.ok) {
      throw new Error('Failed to add ingredient');
    }
    return response.json();
  },

  async deleteIngredient(id) {
    const response = await fetch(`${API_URL}/ingredients/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete ingredient');
    }
    return response.json();
  },

  // Recipe APIs
  async getRecipes() {
    const response = await fetch(`${API_URL}/recipes`);
    if (!response.ok) {
      throw new Error('Failed to fetch recipes');
    }
    return response.json();
  },

  async addRecipe(recipe) {
    const response = await fetch(`${API_URL}/recipes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(recipe),
    });
    if (!response.ok) {
      throw new Error('Failed to add recipe');
    }
    return response.json();
  },

  async deleteRecipe(id) {
    const response = await fetch(`${API_URL}/recipes/${id}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete recipe');
    }
    return response.json();
  },
};

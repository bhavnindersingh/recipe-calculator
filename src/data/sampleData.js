export const sampleIngredients = [
  {
    id: 1,
    name: 'Coffee Beans (Arabica)',
    costPerUnit: 800, // Cost per kg
    unit: 'kg',
    stock: 10
  },
  {
    id: 2,
    name: 'Milk',
    costPerUnit: 60, // Cost per liter
    unit: 'liter',
    stock: 50
  },
  {
    id: 3,
    name: 'Sugar',
    costPerUnit: 40, // Cost per kg
    unit: 'kg',
    stock: 25
  },
  {
    id: 4,
    name: 'Chocolate Syrup',
    costPerUnit: 200, // Cost per liter
    unit: 'liter',
    stock: 5
  },
  {
    id: 5,
    name: 'Whipped Cream',
    costPerUnit: 150, // Cost per liter
    unit: 'liter',
    stock: 3
  },
  {
    id: 6,
    name: 'Caramel Syrup',
    costPerUnit: 180, // Cost per liter
    unit: 'liter',
    stock: 4
  }
];

export const sampleRecipes = [
  {
    id: 1,
    name: 'Classic Cappuccino',
    ingredients: [
      { ingredientId: 1, quantity: 0.018 }, // 18g coffee
      { ingredientId: 2, quantity: 0.18 }   // 180ml milk
    ],
    sellingPrice: 180,
    averageMonthlySales: 450
  },
  {
    id: 2,
    name: 'Caramel Macchiato',
    ingredients: [
      { ingredientId: 1, quantity: 0.018 }, // 18g coffee
      { ingredientId: 2, quantity: 0.15 },  // 150ml milk
      { ingredientId: 6, quantity: 0.03 }   // 30ml caramel
    ],
    sellingPrice: 220,
    averageMonthlySales: 300
  },
  {
    id: 3,
    name: 'Mocha',
    ingredients: [
      { ingredientId: 1, quantity: 0.018 }, // 18g coffee
      { ingredientId: 2, quantity: 0.15 },  // 150ml milk
      { ingredientId: 4, quantity: 0.03 },  // 30ml chocolate
      { ingredientId: 5, quantity: 0.02 }   // 20ml whipped cream
    ],
    sellingPrice: 240,
    averageMonthlySales: 250
  },
  {
    id: 4,
    name: 'Espresso',
    ingredients: [
      { ingredientId: 1, quantity: 0.018 }  // 18g coffee
    ],
    sellingPrice: 120,
    averageMonthlySales: 200
  }
];

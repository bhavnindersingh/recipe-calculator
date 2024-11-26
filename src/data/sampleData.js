export const RECIPE_CATEGORIES = ['Drinks Bar', 'Hot Food', 'Bakery'];

export const sampleIngredients = [
  {
    id: 1,
    name: 'Coffee Beans (Arabica)',
    cost: 800,
    unit: 'kg',
    supplier: 'Premium Coffee Co.'
  },
  {
    id: 2,
    name: 'Milk',
    cost: 60,
    unit: 'liter',
    supplier: 'Local Dairy'
  },
  {
    id: 3,
    name: 'Sugar',
    cost: 40,
    unit: 'kg',
    supplier: 'Sweet Supplies Ltd'
  },
  {
    id: 4,
    name: 'Chocolate Syrup',
    cost: 200,
    unit: 'liter',
    supplier: 'Dessert Essentials'
  },
  {
    id: 5,
    name: 'Whipped Cream',
    cost: 150,
    unit: 'liter',
    supplier: 'Dairy Delights'
  },
  {
    id: 6,
    name: 'Caramel Syrup',
    cost: 180,
    unit: 'liter',
    supplier: 'Sweet Syrups Inc'
  },
  {
    id: 7,
    name: 'All-Purpose Flour',
    cost: 45,
    unit: 'kg',
    supplier: 'Baking Essentials'
  },
  {
    id: 8,
    name: 'Butter',
    cost: 400,
    unit: 'kg',
    supplier: 'Dairy Delights'
  },
  {
    id: 9,
    name: 'Chicken',
    cost: 280,
    unit: 'kg',
    supplier: 'Fresh Meats'
  },
  {
    id: 10,
    name: 'Rice',
    cost: 80,
    unit: 'kg',
    supplier: 'Grain Traders'
  }
];

export const sampleRecipes = [
  {
    id: 1,
    name: 'Classic Cappuccino',
    category: RECIPE_CATEGORIES[0],
    description: 'Classic Italian coffee drink with equal parts espresso, steamed milk, and milk foam',
    ingredients: [
      {
        id: 1,
        name: 'Coffee Beans (Arabica)',
        cost: 800,
        unit: 'kg',
        quantity: 0.018
      },
      {
        id: 2,
        name: 'Milk',
        cost: 60,
        unit: 'liter',
        quantity: 0.180
      }
    ],
    sellingPrice: 150,
    totalCost: 25.2,
    profit: 124.8,
    profitMargin: 83.2,
    averageMonthlySales: 300,
    monthlyRevenue: 45000,
    monthlyProfit: 37440
  },
  {
    id: 2,
    name: 'Caramel Latte',
    category: RECIPE_CATEGORIES[0],
    description: 'Rich espresso with steamed milk and caramel syrup, topped with caramel drizzle',
    ingredients: [
      {
        id: 1,
        name: 'Coffee Beans (Arabica)',
        cost: 800,
        unit: 'kg',
        quantity: 0.018
      },
      {
        id: 2,
        name: 'Milk',
        cost: 60,
        unit: 'liter',
        quantity: 0.200
      },
      {
        id: 6,
        name: 'Caramel Syrup',
        cost: 180,
        unit: 'liter',
        quantity: 0.030
      }
    ],
    sellingPrice: 180,
    totalCost: 31.8,
    profit: 148.2,
    profitMargin: 82.3,
    averageMonthlySales: 200,
    monthlyRevenue: 36000,
    monthlyProfit: 29640
  },
  {
    id: 3,
    name: 'Chocolate Croissant',
    category: RECIPE_CATEGORIES[2],
    description: 'Buttery, flaky croissant filled with rich chocolate',
    ingredients: [
      {
        id: 7,
        name: 'All-Purpose Flour',
        cost: 45,
        unit: 'kg',
        quantity: 0.1
      },
      {
        id: 8,
        name: 'Butter',
        cost: 400,
        unit: 'kg',
        quantity: 0.08
      }
    ],
    sellingPrice: 90,
    totalCost: 36.5,
    profit: 53.5,
    profitMargin: 59.4,
    averageMonthlySales: 400,
    monthlyRevenue: 36000,
    monthlyProfit: 21400
  },
  {
    id: 4,
    name: 'Chicken Biryani',
    category: RECIPE_CATEGORIES[1],
    description: 'Fragrant rice dish with tender chicken and aromatic spices',
    ingredients: [
      {
        id: 9,
        name: 'Chicken',
        cost: 280,
        unit: 'kg',
        quantity: 0.2
      },
      {
        id: 10,
        name: 'Rice',
        cost: 80,
        unit: 'kg',
        quantity: 0.15
      }
    ],
    sellingPrice: 200,
    totalCost: 68,
    profit: 132,
    profitMargin: 66,
    averageMonthlySales: 250,
    monthlyRevenue: 50000,
    monthlyProfit: 33000
  }
];

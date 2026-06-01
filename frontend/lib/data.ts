export interface Product {
  id: number
  sku: string
  name: string
  category: string
  description: string
  purchasePrice: number
  salePrice: number
  stock: number
  image: string
}

export interface Supplier {
  id: number
  name: string
  taxId: string
  phone: string
  email: string
}

export interface CartItem extends Product {
  quantity: number
}

export interface Sale {
  id: number
  invoiceNumber: string
  date: string
  customer: string
  items: CartItem[]
  subtotal: number
  tax: number
  total: number
  profit: number
}

export interface PurchaseOrder {
  id: number
  supplier: Supplier
  date: string
  items: { product: Product; quantity: number; price: number }[]
  total: number
}

export const categories = [
  'Electronics',
  'Office Supplies',
  'Furniture',
  'Software',
  'Accessories',
  'Hardware',
]

export const sampleProducts: Product[] = [
  {
    id: 1,
    sku: 'ELEC-001',
    name: 'Wireless Mouse',
    category: 'Electronics',
    description: 'Ergonomic wireless mouse with USB receiver',
    purchasePrice: 15.00,
    salePrice: 29.99,
    stock: 150,
    image: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=200&h=200&fit=crop',
  },
  {
    id: 2,
    sku: 'ELEC-002',
    name: 'Mechanical Keyboard',
    category: 'Electronics',
    description: 'RGB mechanical gaming keyboard',
    purchasePrice: 45.00,
    salePrice: 89.99,
    stock: 75,
    image: 'https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?w=200&h=200&fit=crop',
  },
  {
    id: 3,
    sku: 'ELEC-003',
    name: '27" Monitor',
    category: 'Electronics',
    description: '27 inch 4K IPS display',
    purchasePrice: 180.00,
    salePrice: 349.99,
    stock: 25,
    image: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=200&h=200&fit=crop',
  },
  {
    id: 4,
    sku: 'ELEC-004',
    name: 'USB-C Hub',
    category: 'Electronics',
    description: '7-in-1 USB-C multiport adapter',
    purchasePrice: 25.00,
    salePrice: 49.99,
    stock: 200,
    image: 'https://images.unsplash.com/photo-1625723044792-44de16ccb4e9?w=200&h=200&fit=crop',
  },
  {
    id: 5,
    sku: 'OFF-001',
    name: 'Printer Paper A4',
    category: 'Office Supplies',
    description: '500 sheets white paper 80gsm',
    purchasePrice: 4.00,
    salePrice: 8.99,
    stock: 500,
    image: 'https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=200&h=200&fit=crop',
  },
  {
    id: 6,
    sku: 'OFF-002',
    name: 'Ballpoint Pen Set',
    category: 'Office Supplies',
    description: 'Pack of 12 blue ballpoint pens',
    purchasePrice: 2.50,
    salePrice: 5.99,
    stock: 8,
    image: 'https://images.unsplash.com/photo-1585336261022-680e295ce3fe?w=200&h=200&fit=crop',
  },
  {
    id: 7,
    sku: 'FURN-001',
    name: 'Ergonomic Chair',
    category: 'Furniture',
    description: 'Adjustable office chair with lumbar support',
    purchasePrice: 120.00,
    salePrice: 249.99,
    stock: 15,
    image: 'https://images.unsplash.com/photo-1580480055273-228ff5388ef8?w=200&h=200&fit=crop',
  },
  {
    id: 8,
    sku: 'FURN-002',
    name: 'Standing Desk',
    category: 'Furniture',
    description: 'Electric height adjustable desk',
    purchasePrice: 250.00,
    salePrice: 499.99,
    stock: 0,
    image: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=200&h=200&fit=crop',
  },
  {
    id: 9,
    sku: 'SOFT-001',
    name: 'Office Suite License',
    category: 'Software',
    description: 'Annual subscription for productivity suite',
    purchasePrice: 50.00,
    salePrice: 99.99,
    stock: 999,
    image: 'https://images.unsplash.com/photo-1633419461186-7d40a38105ec?w=200&h=200&fit=crop',
  },
  {
    id: 10,
    sku: 'ACC-001',
    name: 'Laptop Bag',
    category: 'Accessories',
    description: 'Water-resistant 15.6" laptop bag',
    purchasePrice: 20.00,
    salePrice: 44.99,
    stock: 60,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=200&h=200&fit=crop',
  },
  {
    id: 11,
    sku: 'ACC-002',
    name: 'Webcam HD',
    category: 'Accessories',
    description: '1080p HD webcam with microphone',
    purchasePrice: 30.00,
    salePrice: 59.99,
    stock: 45,
    image: 'https://images.unsplash.com/photo-1587826080692-f439cd0b70da?w=200&h=200&fit=crop',
  },
  {
    id: 12,
    sku: 'HW-001',
    name: 'SSD 500GB',
    category: 'Hardware',
    description: 'NVMe M.2 solid state drive',
    purchasePrice: 40.00,
    salePrice: 79.99,
    stock: 3,
    image: 'https://images.unsplash.com/photo-1597872200969-2b65d56bd16b?w=200&h=200&fit=crop',
  },
]

export const sampleSuppliers: Supplier[] = [
  {
    id: 1,
    name: 'Tech Distributors Inc.',
    taxId: '900123456-1',
    phone: '+1 (555) 123-4567',
    email: 'orders@techdist.com',
  },
  {
    id: 2,
    name: 'Office World Supplies',
    taxId: '900234567-2',
    phone: '+1 (555) 234-5678',
    email: 'sales@officeworld.com',
  },
  {
    id: 3,
    name: 'Furniture Plus Co.',
    taxId: '900345678-3',
    phone: '+1 (555) 345-6789',
    email: 'contact@furnitureplus.com',
  },
]

export const sampleSales: Sale[] = [
  {
    id: 1,
    invoiceNumber: 'INV-2024-0001',
    date: '2024-01-15',
    customer: 'John Smith',
    items: [
      { ...sampleProducts[0], quantity: 2 },
      { ...sampleProducts[1], quantity: 1 },
    ],
    subtotal: 149.97,
    tax: 28.49,
    total: 178.46,
    profit: 59.97,
  },
  {
    id: 2,
    invoiceNumber: 'INV-2024-0002',
    date: '2024-01-15',
    customer: 'Sarah Johnson',
    items: [
      { ...sampleProducts[2], quantity: 1 },
      { ...sampleProducts[9], quantity: 1 },
    ],
    subtotal: 394.98,
    tax: 75.05,
    total: 470.03,
    profit: 194.98,
  },
  {
    id: 3,
    invoiceNumber: 'INV-2024-0003',
    date: '2024-01-16',
    customer: 'Mike Davis',
    items: [{ ...sampleProducts[6], quantity: 2 }],
    subtotal: 499.98,
    tax: 95.00,
    total: 594.98,
    profit: 259.98,
  },
  {
    id: 4,
    invoiceNumber: 'INV-2024-0004',
    date: '2024-01-16',
    customer: 'Emily Brown',
    items: [
      { ...sampleProducts[4], quantity: 10 },
      { ...sampleProducts[5], quantity: 5 },
    ],
    subtotal: 119.85,
    tax: 22.77,
    total: 142.62,
    profit: 57.35,
  },
  {
    id: 5,
    invoiceNumber: 'INV-2024-0005',
    date: '2024-01-17',
    customer: 'David Wilson',
    items: [{ ...sampleProducts[7], quantity: 1 }],
    subtotal: 499.99,
    tax: 95.00,
    total: 594.99,
    profit: 249.99,
  },
]

export const dailySalesData = [
  { day: 'Mon', sales: 1250 },
  { day: 'Tue', sales: 1890 },
  { day: 'Wed', sales: 1650 },
  { day: 'Thu', sales: 2100 },
  { day: 'Fri', sales: 2450 },
  { day: 'Sat', sales: 1800 },
  { day: 'Sun', sales: 950 },
]

export const weeklySalesData = [
  { week: 'Week 1', sales: 8500 },
  { week: 'Week 2', sales: 9200 },
  { week: 'Week 3', sales: 7800 },
  { week: 'Week 4', sales: 10500 },
]

export const monthlySalesData = [
  { month: 'Jan', sales: 32000 },
  { month: 'Feb', sales: 28500 },
  { month: 'Mar', sales: 35200 },
  { month: 'Apr', sales: 31000 },
  { month: 'May', sales: 38500 },
  { month: 'Jun', sales: 42000 },
]

export const topProductsData = [
  { name: 'Wireless Mouse', sales: 450 },
  { name: 'Mechanical Keyboard', sales: 320 },
  { name: '27" Monitor', sales: 180 },
  { name: 'Ergonomic Chair', sales: 150 },
  { name: 'USB-C Hub', sales: 280 },
]

// ==========================================
// 🟢 CONSERVA ESTOS TIPOS (TypeScript los necesita)
// ==========================================

export interface Product {
  idProduct?: number       // Lo cambiamos opcional (?) porque Spring Boot genera el autoincremental
  sku: string
  nameProduct: string     // OJO: Cámbialo para que coincida con tu entidad Java (nameProduct)
  category?: string
  description: string
  purchasePrice?: number
  sellingValueProduct: number // OJO: Cámbialo para que coincida con tu entidad Java
  stock?: number
  image?: string
}

export interface Supplier {
  idProvider: number      // OJO: Sincronizado con tu Provider.java (idProvider)
  nitProvider: string     // Sincronizado con nitProvider
  nameProvider: string    // Sincronizado con nameProvider
  phoneNumber: string     // Sincronizado con phoneNumber
  email: string
}

export interface CartItem {
  idProduct: number
  nameProduct: string
  price: number
  quantity: number
}

export interface Sale {
  idSale?: number
  totalAmountSale: number
  paymentMethod: {
    idPaymentMethod: number
  }
  saleDetails: {
    amountProducts: number
    product: {
      idProduct: number
    }
  }[]
}

export interface PurchaseOrder {
  idPurchase?: number
  provider: {
    idProvider: number
  }
  purchaseDetails: {
    amountPurchased: number
    purchaseProductPrice: number
    product: {
      idProduct: number
    }
  }[]
}

// Puedes conservar el catálogo base si tu frontend lo renderiza como ayuda visual fija
export const categories = [
  'Electronics',
  'Office Supplies',
  'Furniture',
  'Software',
  'Accessories',
  'Hardware',
]
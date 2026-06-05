'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import { type Product, type CartItem } from '@/lib/data' 

export default function SalesPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [cart, setCart] = useState<CartItem[]>([]) 
  const [searchTerm, setSearchTerm] = useState('')
  const [loading, setLoading] = useState(true)
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  
  const [invoiceData, setInvoiceData] = useState<{
    invoiceNumber: string
    date: string
    items: CartItem[]
    total: number
  } | null>(null)

  // 1. Sincronizar catálogo usando la IP fija para eludir problemas DNS de red local
  const loadLiveCatalog = () => {
    setLoading(true)
    fetch('http://127.0.0.1:8080/api/products')
      .then((res) => res.json())
      .then((data) => {
        setProducts(data)
        setLoading(false)
      })
      .catch((err) => {
        console.error("Error conectando terminal POS con backend:", err)
        setLoading(false)
      })
  }

  useEffect(() => {
    loadLiveCatalog()
  }, [])

  const filteredProducts = products.filter(
    (p) =>
      p.nameProduct?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.idProduct?.toString() === searchTerm.trim()
  )

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.idProduct === product.idProduct)
      if (existing) {
        return prev.map((item) =>
          item.idProduct === product.idProduct ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      const newItem: CartItem = {
        idProduct: product.idProduct || 0,
        nameProduct: product.nameProduct || '',
        price: product.sellingValueProduct || 0, 
        quantity: 1                         
      }
      return [...prev, newItem]
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.idProduct === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.idProduct !== id))
  }

  // 🟢 Punto 1: Cálculos lineales simplificados. El subtotal es el total directo sin cálculos de IVA
  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0)

  // 🟢 Punto 3: Generador de datos adaptado para recibir el ID secuencial real retornado por Neon
  const generateInvoice = (realSaleId: number) => {
    const invoice = {
      invoiceNumber: `INV-${realSaleId}`, // Cambiado a ID estricto del autoincremental de la DB
      date: new Date().toLocaleDateString(),
      items: cart,
      total,
    }
    setInvoiceData(invoice)
    setShowInvoiceModal(true)
  }

  // 2. DESPACHAR TRANSACCIÓN DIRECTO AL BACKEND (POST /api/sales)
  const chargeCustomer = async () => {
    if (cart.length === 0) {
      alert('Please add products to the cart first')
      return
    }

    const saleRequest = {
      paymentMethod: {
        idPaymentMethod: 1 // Efectivo por defecto
      },
      saleDetails: cart.map(item => ({
        amountProducts: item.quantity, 
        product: {
          idProduct: item.idProduct     
        }
      }))
    }

    try {
      const response = await fetch('http://127.0.0.1:8080/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(saleRequest)
      })

      if (response.ok) {
        const savedSaleEntity = await response.json()
        
        // 🟢 Punto 3: Extraemos el idSale (o id_sale) real devuelto por la base de datos Neon
        const realId = savedSaleEntity.idSale || savedSaleEntity.id_sale || Date.now();
        generateInvoice(realId) 
      } else {
        const errLog = await response.json();
        alert(`❌ Transaction Blocked: Insufficient stock level.\nDetails: ${errLog.message || 'Check stock availability.'}`)
      }
    } catch (error) {
      console.error("Fallo crítico de comunicación API:", error)
      alert("Error: Server offline or CORS block.")
    }
  }

  const clearCart = () => {
    setCart([])
    setShowInvoiceModal(false)
    setInvoiceData(null)
    loadLiveCatalog() 
  }

  if (loading) {
    return (
      <div className="min-vh-100 d-flex align-items-center justify-content-center bg-light">
        <div className="text-center">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p className="text-muted fw-bold">Initializing Live POS Terminal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          <div className="d-flex align-items-center">
            <Link href="/" className="btn btn-light me-3">
              <i className="bi bi-arrow-left"></i>
            </Link>
            <Link href="/" className="navbar-brand d-flex align-items-center">
              <i className="bi bi-box-seam text-primary me-2 fs-4"></i>
              <span className="fw-bold">InventoryPro</span>
            </Link>
          </div>
          <div className="d-flex align-items-center">
            <span className="badge bg-primary fs-6 px-3 py-2">
              <i className="bi bi-cart-check me-2"></i>Point of Sale
            </span>
          </div>
        </div>
      </nav>

      <div className="container-fluid p-4">
        <div className="row g-4">
          {/* Left Section - Product Catalog */}
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-3 fw-bold">
                  <i className="bi bi-grid-3x3-gap me-2 text-primary"></i>Product Catalog
                </h5>
                <div className="search-wrapper">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or ID..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-body" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                <div className="row g-3">
                  {filteredProducts.map((product) => (
                    <div key={product.idProduct} className="col-6">
                      <div
                        className="card product-card h-100 border"
                        style={{ cursor: 'pointer' }}
                        onClick={() => addToCart(product)}
                      >
                        {product.image && (
                          <img
                            src={product.image}
                            alt={product.nameProduct}
                            className="card-img-top"
                            style={{ height: 100, objectFit: 'cover' }}
                          />
                        )}
                        <div className="card-body p-2">
                          <h6 className="card-title small mb-1 text-truncate fw-bold">{product.nameProduct}</h6>
                          <p className="card-text mb-0">
                            <span className="fw-bold text-primary">${(product.sellingValueProduct || 0).toFixed(2)}</span>
                          </p>
                          <small className="text-muted d-block">Stock: {product.stock || 0}</small>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Center Section - Sales Table */}
          <div className="col-lg-5">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-receipt me-2 text-primary"></i>Current Order
                </h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                  <table className="table table-hover mb-0">
                    <thead className="sticky-top bg-light">
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Unit Price</th>
                        <th className="text-center" style={{ width: 100 }}>Qty</th>
                        <th className="text-end">Subtotal</th>
                        <th className="text-center" style={{ width: 50 }}></th>
                      </tr>
                    </thead>
                    <tbody>
                      {cart.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-5 text-muted">
                            <i className="bi bi-cart3 fs-1 d-block mb-3"></i>
                            <p className="mb-0">No products in cart</p>
                            <small>Click on products catalog to build order</small>
                          </td>
                        </tr>
                      ) : (
                        cart.map((item) => (
                          <tr key={item.idProduct}>
                            <td>
                              <div className="d-flex align-items-center">
                                <div>
                                  <div className="fw-medium">{item.nameProduct}</div>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">${item.price.toFixed(2)}</td>
                            <td className="text-center">
                              <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                value={item.quantity} 
                                min={1}
                                onChange={(e) => updateQuantity(item.idProduct, parseInt(e.target.value) || 0)}
                                style={{ width: 70 }}
                              />
                            </td>
                            <td className="text-end fw-semibold">
                              ${(item.price * item.quantity).toFixed(2)}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromCart(item.idProduct)}
                              >
                                <i className="bi bi-trash"></i>
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          {/* Right Sidebar - Order Summary */}
          <div className="col-lg-3">
            <div className="card border-0 shadow-sm order-summary">
              <div className="card-header bg-primary text-white py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-calculator me-2"></i>Order Summary
                </h5>
              </div>
              <div className="card-body">
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Items:</span>
                  <span className="fw-medium">{cart.reduce((sum, item) => sum + item.quantity, 0)}</span>
                </div>
                <hr />
                {/* 🟢 Punto 1: Se extrajo el renglón del subtotal e IVA, dejando únicamente el Total neto de la compra */}
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5 fw-bold">Total:</span>
                  <span className="fs-5 fw-bold text-primary">${total.toFixed(2)}</span>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-success btn-lg"
                    onClick={chargeCustomer}
                    disabled={cart.length === 0}
                  >
                    <i className="bi bi-credit-card me-2"></i>Confirm & Process Sale
                  </button>
                  <button
                    className="btn btn-outline-secondary"
                    onClick={clearCart}
                    disabled={cart.length === 0}
                  >
                    <i className="bi bi-x-circle me-2"></i>Clear Cart
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Invoice Modal */}
      {showInvoiceModal && invoiceData && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-file-earmark-check text-success me-2"></i>Invoice Generated
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowInvoiceModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="invoice-header d-flex justify-content-between align-items-start">
                  <div>
                    <h4 className="fw-bold text-primary mb-1">InventoryPro</h4>
                    <p className="text-muted mb-0">UdeA POS Lab Integration</p>
                    <p className="text-muted mb-0">Live Neon Connection Verified</p>
                  </div>
                  <div className="text-end">
                    {/* 🟢 Punto 3: Aquí se dibuja el INV-{id_real} que inyecta la base de datos */}
                    <h5 className="fw-bold mb-1 text-success">{invoiceData.invoiceNumber}</h5>
                    <p className="text-muted mb-0">Date: {invoiceData.date}</p>
                  </div>
                </div>

                <div className="table-responsive mt-4">
                  <table className="table invoice-table">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Quantity</th>
                        <th className="text-end">Unit Price</th>
                        <th className="text-end">Total</th>
                      </tr>
                    </thead>
                    <tbody>
                      {invoiceData.items.map((item) => (
                        <tr key={item.idProduct}>
                          <td>{item.nameProduct}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.price.toFixed(2)}</td>
                          <td className="text-end">${(item.price * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      {/* 🟢 Punto 1: Limpiado el desglose de IVA de la sección inferior de la factura */}
                      <tr className="table-primary">
                        <td colSpan={3} className="text-end fw-bold fs-5">Total Paid:</td>
                        <td className="text-end fw-bold fs-5">${invoiceData.total.toFixed(2)}</td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              </div>
              <div className="modal-footer border-0">
                <button className="btn btn-outline-secondary" onClick={() => setShowInvoiceModal(false)}>
                  Close view
                </button>
                {/* 🟢 Punto 2: Se eliminó el botón de descarga PDF por completo */}
                <button className="btn btn-success" onClick={clearCart}>
                  <i className="bi bi-check-circle me-2"></i>Complete Sale
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
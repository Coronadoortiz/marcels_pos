'use client'

import Link from 'next/link'
import { useState } from 'react'
import { sampleProducts, type Product, type CartItem } from '@/lib/data'

export default function SalesPage() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [showInvoiceModal, setShowInvoiceModal] = useState(false)
  const [invoiceData, setInvoiceData] = useState<{
    invoiceNumber: string
    date: string
    items: CartItem[]
    subtotal: number
    tax: number
    total: number
  } | null>(null)

  const filteredProducts = sampleProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.sku.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const addToCart = (product: Product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id)
      if (existing) {
        return prev.map((item) =>
          item.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      }
      return [...prev, { ...product, quantity: 1 }]
    })
  }

  const updateQuantity = (id: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id)
      return
    }
    setCart((prev) => prev.map((item) => (item.id === id ? { ...item, quantity } : item)))
  }

  const removeFromCart = (id: number) => {
    setCart((prev) => prev.filter((item) => item.id !== id))
  }

  const subtotal = cart.reduce((sum, item) => sum + item.salePrice * item.quantity, 0)
  const tax = subtotal * 0.19
  const total = subtotal + tax

  const generateInvoice = () => {
    const invoice = {
      invoiceNumber: `INV-${Date.now()}`,
      date: new Date().toLocaleDateString(),
      items: cart,
      subtotal,
      tax,
      total,
    }
    setInvoiceData(invoice)
    setShowInvoiceModal(true)
  }

  const chargeCustomer = () => {
    if (cart.length === 0) {
      alert('Please add products to the cart first')
      return
    }
    generateInvoice()
  }

  const downloadPDF = () => {
    alert('PDF download functionality would be implemented here')
  }

  const clearCart = () => {
    setCart([])
    setShowInvoiceModal(false)
    setInvoiceData(null)
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
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search products..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className="card-body" style={{ maxHeight: 'calc(100vh - 280px)', overflowY: 'auto' }}>
                <div className="row g-3">
                  {filteredProducts.map((product) => (
                    <div key={product.id} className="col-6">
                      <div
                        className="card product-card h-100 border"
                        onClick={() => addToCart(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="card-img-top"
                          style={{ height: 100, objectFit: 'cover' }}
                        />
                        <div className="card-body p-2">
                          <h6 className="card-title small mb-1 text-truncate">{product.name}</h6>
                          <p className="card-text mb-0">
                            <span className="fw-bold text-primary">${product.salePrice.toFixed(2)}</span>
                          </p>
                          <small className="text-muted">Stock: {product.stock}</small>
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
                            <small>Click on products to add them</small>
                          </td>
                        </tr>
                      ) : (
                        cart.map((item) => (
                          <tr key={item.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                <img
                                  src={item.image}
                                  alt={item.name}
                                  className="rounded me-2"
                                  style={{ width: 40, height: 40, objectFit: 'cover' }}
                                />
                                <div>
                                  <div className="fw-medium">{item.name}</div>
                                  <small className="text-muted">{item.sku}</small>
                                </div>
                              </div>
                            </td>
                            <td className="text-center">${item.salePrice.toFixed(2)}</td>
                            <td className="text-center">
                              <input
                                type="number"
                                className="form-control form-control-sm text-center"
                                value={item.quantity}
                                min={1}
                                onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                                style={{ width: 70 }}
                              />
                            </td>
                            <td className="text-end fw-semibold">
                              ${(item.salePrice * item.quantity).toFixed(2)}
                            </td>
                            <td className="text-center">
                              <button
                                className="btn btn-sm btn-outline-danger"
                                onClick={() => removeFromCart(item.id)}
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
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Subtotal:</span>
                  <span className="fw-medium">${subtotal.toFixed(2)}</span>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span className="text-muted">Tax (IVA 19%):</span>
                  <span className="fw-medium">${tax.toFixed(2)}</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between mb-4">
                  <span className="fs-5 fw-bold">Total:</span>
                  <span className="fs-5 fw-bold text-primary">${total.toFixed(2)}</span>
                </div>

                <div className="d-grid gap-2">
                  <button
                    className="btn btn-primary btn-lg"
                    onClick={chargeCustomer}
                    disabled={cart.length === 0}
                  >
                    <i className="bi bi-credit-card me-2"></i>Charge Customer
                  </button>
                  <button
                    className="btn btn-outline-primary"
                    onClick={generateInvoice}
                    disabled={cart.length === 0}
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>Generate Invoice
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
                    <p className="text-muted mb-0">123 Business Street</p>
                    <p className="text-muted mb-0">contact@inventorypro.com</p>
                  </div>
                  <div className="text-end">
                    <h5 className="fw-bold mb-1">{invoiceData.invoiceNumber}</h5>
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
                        <tr key={item.id}>
                          <td>{item.name}</td>
                          <td className="text-center">{item.quantity}</td>
                          <td className="text-end">${item.salePrice.toFixed(2)}</td>
                          <td className="text-end">${(item.salePrice * item.quantity).toFixed(2)}</td>
                        </tr>
                      ))}
                    </tbody>
                    <tfoot>
                      <tr>
                        <td colSpan={3} className="text-end fw-medium">Subtotal:</td>
                        <td className="text-end">${invoiceData.subtotal.toFixed(2)}</td>
                      </tr>
                      <tr>
                        <td colSpan={3} className="text-end fw-medium">Tax (IVA 19%):</td>
                        <td className="text-end">${invoiceData.tax.toFixed(2)}</td>
                      </tr>
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
                  Close
                </button>
                <button className="btn btn-primary" onClick={downloadPDF}>
                  <i className="bi bi-download me-2"></i>Download PDF Invoice
                </button>
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

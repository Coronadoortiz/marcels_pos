'use client'

import Link from 'next/link'
import { useState } from 'react'
import { sampleProducts, sampleSuppliers, categories, type Product, type Supplier } from '@/lib/data'

interface PurchaseItem {
  product: Product
  quantity: number
  price: number
}

export default function PurchasesPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(sampleSuppliers)
  const [selectedSupplier, setSelectedSupplier] = useState<Supplier | null>(null)
  const [purchaseItems, setPurchaseItems] = useState<PurchaseItem[]>([])
  const [showSupplierModal, setShowSupplierModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showAddProductModal, setShowAddProductModal] = useState(false)

  const [newSupplier, setNewSupplier] = useState({
    name: '',
    taxId: '',
    phone: '',
    email: '',
  })

  const [newProduct, setNewProduct] = useState({
    name: '',
    category: categories[0],
    description: '',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
  })

  const addProductToPurchase = (product: Product) => {
    const existing = purchaseItems.find((item) => item.product.id === product.id)
    if (existing) {
      setPurchaseItems((prev) =>
        prev.map((item) =>
          item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item
        )
      )
    } else {
      setPurchaseItems((prev) => [...prev, { product, quantity: 1, price: product.purchasePrice }])
    }
    setShowAddProductModal(false)
  }

  const updatePurchaseItem = (productId: number, field: 'quantity' | 'price', value: number) => {
    setPurchaseItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, [field]: value } : item
      )
    )
  }

  const removePurchaseItem = (productId: number) => {
    setPurchaseItems((prev) => prev.filter((item) => item.product.id !== productId))
  }

  const purchaseTotal = purchaseItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  )

  const createSupplier = () => {
    if (!newSupplier.name || !newSupplier.taxId) {
      alert('Please fill in required fields')
      return
    }
    const supplier: Supplier = {
      id: suppliers.length + 1,
      ...newSupplier,
    }
    setSuppliers((prev) => [...prev, supplier])
    setSelectedSupplier(supplier)
    setNewSupplier({ name: '', taxId: '', phone: '', email: '' })
    setShowSupplierModal(false)
  }

  const createProduct = () => {
    if (!newProduct.name || !newProduct.category) {
      alert('Please fill in required fields')
      return
    }
    const product: Product = {
      id: sampleProducts.length + 1,
      sku: `NEW-${Date.now()}`,
      ...newProduct,
      image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
    }
    addProductToPurchase(product)
    setNewProduct({
      name: '',
      category: categories[0],
      description: '',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
    })
    setShowProductModal(false)
  }

  const registerPurchaseOrder = () => {
    if (!selectedSupplier) {
      alert('Please select a supplier')
      return
    }
    if (purchaseItems.length === 0) {
      alert('Please add products to the purchase order')
      return
    }
    alert(`Purchase Order registered successfully!\n\nSupplier: ${selectedSupplier.name}\nTotal: $${purchaseTotal.toFixed(2)}`)
    setPurchaseItems([])
    setSelectedSupplier(null)
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
            <span className="badge bg-success fs-6 px-3 py-2">
              <i className="bi bi-box-seam-fill me-2"></i>Purchase Orders
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Supplier Section */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-building me-2 text-success"></i>Supplier Information
            </h5>
          </div>
          <div className="card-body">
            <div className="row g-3 align-items-end">
              <div className="col-md-8">
                <label className="form-label fw-medium">Select Supplier</label>
                <select
                  className="form-select"
                  value={selectedSupplier?.id || ''}
                  onChange={(e) => {
                    const supplier = suppliers.find((s) => s.id === parseInt(e.target.value))
                    setSelectedSupplier(supplier || null)
                  }}
                >
                  <option value="">-- Select a supplier --</option>
                  {suppliers.map((supplier) => (
                    <option key={supplier.id} value={supplier.id}>
                      {supplier.name} - {supplier.taxId}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-4">
                <button
                  className="btn btn-success w-100"
                  onClick={() => setShowSupplierModal(true)}
                >
                  <i className="bi bi-plus-circle me-2"></i>Create Supplier
                </button>
              </div>
            </div>

            {selectedSupplier && (
              <div className="mt-4 p-3 bg-light rounded">
                <div className="row">
                  <div className="col-md-3">
                    <small className="text-muted d-block">Name</small>
                    <strong>{selectedSupplier.name}</strong>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Tax ID (NIT)</small>
                    <strong>{selectedSupplier.taxId}</strong>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Phone</small>
                    <strong>{selectedSupplier.phone}</strong>
                  </div>
                  <div className="col-md-3">
                    <small className="text-muted d-block">Email</small>
                    <strong>{selectedSupplier.email}</strong>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Products Section */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-box me-2 text-success"></i>Purchase Items
            </h5>
            <div>
              <button
                className="btn btn-outline-success me-2"
                onClick={() => setShowAddProductModal(true)}
              >
                <i className="bi bi-plus me-1"></i>Add Existing Product
              </button>
              <button
                className="btn btn-success"
                onClick={() => setShowProductModal(true)}
              >
                <i className="bi bi-plus-circle me-1"></i>Create New Product
              </button>
            </div>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th className="text-center" style={{ width: 120 }}>Quantity</th>
                    <th className="text-center" style={{ width: 150 }}>Purchase Price</th>
                    <th className="text-end" style={{ width: 120 }}>Subtotal</th>
                    <th className="text-center" style={{ width: 60 }}></th>
                  </tr>
                </thead>
                <tbody>
                  {purchaseItems.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="text-center py-5 text-muted">
                        <i className="bi bi-inbox fs-1 d-block mb-3"></i>
                        <p className="mb-0">No products added yet</p>
                        <small>Click &quot;Add Existing Product&quot; or &quot;Create New Product&quot; to start</small>
                      </td>
                    </tr>
                  ) : (
                    purchaseItems.map((item) => (
                      <tr key={item.product.id}>
                        <td>
                          <div className="d-flex align-items-center">
                            <img
                              src={item.product.image}
                              alt={item.product.name}
                              className="rounded me-3"
                              style={{ width: 48, height: 48, objectFit: 'cover' }}
                            />
                            <div>
                              <div className="fw-medium">{item.product.name}</div>
                              <small className="text-muted">{item.product.sku}</small>
                            </div>
                          </div>
                        </td>
                        <td className="text-center">
                          <input
                            type="number"
                            className="form-control form-control-sm text-center mx-auto"
                            value={item.quantity}
                            min={1}
                            onChange={(e) =>
                              updatePurchaseItem(item.product.id, 'quantity', parseInt(e.target.value) || 1)
                            }
                            style={{ width: 80 }}
                          />
                        </td>
                        <td className="text-center">
                          <div className="input-group input-group-sm mx-auto" style={{ width: 120 }}>
                            <span className="input-group-text">$</span>
                            <input
                              type="number"
                              className="form-control text-center"
                              value={item.price}
                              min={0}
                              step={0.01}
                              onChange={(e) =>
                                updatePurchaseItem(item.product.id, 'price', parseFloat(e.target.value) || 0)
                              }
                            />
                          </div>
                        </td>
                        <td className="text-end fw-semibold">
                          ${(item.price * item.quantity).toFixed(2)}
                        </td>
                        <td className="text-center">
                          <button
                            className="btn btn-sm btn-outline-danger"
                            onClick={() => removePurchaseItem(item.product.id)}
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

        {/* Summary and Action */}
        <div className="row">
          <div className="col-md-6 offset-md-6">
            <div className="card border-0 shadow-sm">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <span className="fs-4 fw-bold">Purchase Total:</span>
                  <span className="fs-3 fw-bold text-success">${purchaseTotal.toFixed(2)}</span>
                </div>
                <button
                  className="btn btn-success btn-lg w-100"
                  onClick={registerPurchaseOrder}
                  disabled={!selectedSupplier || purchaseItems.length === 0}
                >
                  <i className="bi bi-check-circle me-2"></i>Register Purchase Order
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Create Supplier Modal */}
      {showSupplierModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-building me-2 text-success"></i>Create New Supplier
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowSupplierModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSupplier.name}
                    onChange={(e) => setNewSupplier({ ...newSupplier, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Tax ID (NIT) *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSupplier.taxId}
                    onChange={(e) => setNewSupplier({ ...newSupplier, taxId: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newSupplier.phone}
                    onChange={(e) => setNewSupplier({ ...newSupplier, phone: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    value={newSupplier.email}
                    onChange={(e) => setNewSupplier({ ...newSupplier, email: e.target.value })}
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowSupplierModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={createSupplier}>
                  <i className="bi bi-check me-1"></i>Create Supplier
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Existing Product Modal */}
      {showAddProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-box me-2 text-success"></i>Add Product to Purchase
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowAddProductModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row g-3">
                  {sampleProducts.map((product) => (
                    <div key={product.id} className="col-md-4">
                      <div
                        className="card product-card h-100"
                        onClick={() => addProductToPurchase(product)}
                      >
                        <img
                          src={product.image}
                          alt={product.name}
                          className="card-img-top"
                          style={{ height: 120, objectFit: 'cover' }}
                        />
                        <div className="card-body p-2">
                          <h6 className="card-title small mb-1">{product.name}</h6>
                          <p className="mb-0 small">
                            <span className="text-muted">Purchase:</span>{' '}
                            <span className="fw-bold text-success">${product.purchasePrice.toFixed(2)}</span>
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Create New Product Modal */}
      {showProductModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-plus-circle me-2 text-success"></i>Create New Product
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowProductModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label fw-medium">Product Name *</label>
                  <input
                    type="text"
                    className="form-control"
                    value={newProduct.name}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Category *</label>
                  <select
                    className="form-select"
                    value={newProduct.category}
                    onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  >
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Description</label>
                  <textarea
                    className="form-control"
                    rows={2}
                    value={newProduct.description}
                    onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                  ></textarea>
                </div>
                <div className="row">
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Purchase Price</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={newProduct.purchasePrice}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, purchasePrice: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                  <div className="col-md-6 mb-3">
                    <label className="form-label fw-medium">Sale Price</label>
                    <div className="input-group">
                      <span className="input-group-text">$</span>
                      <input
                        type="number"
                        className="form-control"
                        value={newProduct.salePrice}
                        onChange={(e) =>
                          setNewProduct({ ...newProduct, salePrice: parseFloat(e.target.value) || 0 })
                        }
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-3">
                  <label className="form-label fw-medium">Initial Stock</label>
                  <input
                    type="number"
                    className="form-control"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: parseInt(e.target.value) || 0 })
                    }
                  />
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </button>
                <button type="button" className="btn btn-success" onClick={createProduct}>
                  <i className="bi bi-check me-1"></i>Create & Add Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

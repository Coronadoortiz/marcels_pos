'use client'

import Link from 'next/link'
import { useState } from 'react'
import { sampleProducts, categories, type Product } from '@/lib/data'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>(sampleProducts)
  const [showModal, setShowModal] = useState(false)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<number | null>(null)

  const [formData, setFormData] = useState({
    name: '',
    category: categories[0],
    description: '',
    purchasePrice: 0,
    salePrice: 0,
    stock: 0,
    image: '',
  })

  const openCreateModal = () => {
    setEditingProduct(null)
    setFormData({
      name: '',
      category: categories[0],
      description: '',
      purchasePrice: 0,
      salePrice: 0,
      stock: 0,
      image: '',
    })
    setShowModal(true)
  }

  const openEditModal = (product: Product) => {
    setEditingProduct(product)
    setFormData({
      name: product.name,
      category: product.category,
      description: product.description,
      purchasePrice: product.purchasePrice,
      salePrice: product.salePrice,
      stock: product.stock,
      image: product.image,
    })
    setShowModal(true)
  }

  const handleSubmit = () => {
    if (!formData.name || !formData.category) {
      alert('Please fill in required fields')
      return
    }

    if (editingProduct) {
      // Update existing product
      setProducts((prev) =>
        prev.map((p) =>
          p.id === editingProduct.id
            ? {
                ...p,
                name: formData.name,
                category: formData.category,
                description: formData.description,
                purchasePrice: formData.purchasePrice,
                salePrice: formData.salePrice,
                stock: formData.stock,
                image: formData.image || p.image,
              }
            : p
        )
      )
    } else {
      // Create new product
      const newProduct: Product = {
        id: Math.max(...products.map((p) => p.id)) + 1,
        sku: `SKU-${Date.now()}`,
        name: formData.name,
        category: formData.category,
        description: formData.description,
        purchasePrice: formData.purchasePrice,
        salePrice: formData.salePrice,
        stock: formData.stock,
        image:
          formData.image ||
          'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200&h=200&fit=crop',
      }
      setProducts((prev) => [...prev, newProduct])
    }

    setShowModal(false)
    setEditingProduct(null)
  }

  const handleDelete = (id: number) => {
    setProducts((prev) => prev.filter((p) => p.id !== id))
    setShowDeleteConfirm(null)
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
            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#fd7e14' }}>
              <i className="bi bi-tags-fill me-2"></i>Products Management
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Header Actions */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="fw-bold mb-1">Products Catalog</h2>
            <p className="text-muted mb-0">Manage your product inventory</p>
          </div>
          <button className="btn btn-warning btn-lg text-white" onClick={openCreateModal}>
            <i className="bi bi-plus-circle me-2"></i>New Product
          </button>
        </div>

        {/* Products Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>SKU</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th className="text-end">Sale Price</th>
                    <th className="text-center">Stock</th>
                    <th className="text-center" style={{ width: 150 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id}>
                      <td>
                        <code className="text-muted">{product.sku}</code>
                      </td>
                      <td>
                        <div className="d-flex align-items-center">
                          <img
                            src={product.image}
                            alt={product.name}
                            className="rounded me-3"
                            style={{ width: 48, height: 48, objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-medium">{product.name}</div>
                            <small className="text-muted text-truncate d-block" style={{ maxWidth: 250 }}>
                              {product.description}
                            </small>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className="badge bg-light text-dark">{product.category}</span>
                      </td>
                      <td className="text-end fw-semibold">${product.salePrice.toFixed(2)}</td>
                      <td className="text-center">
                        <span
                          className={`fw-bold ${
                            product.stock === 0
                              ? 'text-danger'
                              : product.stock <= 10
                              ? 'text-warning'
                              : 'text-success'
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>
                      <td className="text-center">
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => openEditModal(product)}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => setShowDeleteConfirm(product.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {showModal && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title fw-bold">
                  <i
                    className={`bi ${editingProduct ? 'bi-pencil' : 'bi-plus-circle'} me-2`}
                    style={{ color: '#fd7e14' }}
                  ></i>
                  {editingProduct ? 'Edit Product' : 'Create New Product'}
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="row">
                  <div className="col-md-8">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Product Name *</label>
                      <input
                        type="text"
                        className="form-control"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="Enter product name"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Category *</label>
                      <select
                        className="form-select"
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
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
                        rows={3}
                        value={formData.description}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Enter product description"
                      ></textarea>
                    </div>
                    <div className="row">
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-medium">Purchase Price</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.purchasePrice}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                purchasePrice: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-medium">Sale Price *</label>
                        <div className="input-group">
                          <span className="input-group-text">$</span>
                          <input
                            type="number"
                            className="form-control"
                            value={formData.salePrice}
                            onChange={(e) =>
                              setFormData({
                                ...formData,
                                salePrice: parseFloat(e.target.value) || 0,
                              })
                            }
                          />
                        </div>
                      </div>
                      <div className="col-md-4 mb-3">
                        <label className="form-label fw-medium">Initial Stock</label>
                        <input
                          type="number"
                          className="form-control"
                          value={formData.stock}
                          onChange={(e) =>
                            setFormData({ ...formData, stock: parseInt(e.target.value) || 0 })
                          }
                        />
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4">
                    <div className="mb-3">
                      <label className="form-label fw-medium">Product Image</label>
                      <div
                        className="border rounded p-3 text-center"
                        style={{ backgroundColor: '#f8f9fa' }}
                      >
                        {formData.image || editingProduct?.image ? (
                          <img
                            src={formData.image || editingProduct?.image}
                            alt="Preview"
                            className="img-fluid rounded mb-2"
                            style={{ maxHeight: 150 }}
                          />
                        ) : (
                          <div className="py-4">
                            <i className="bi bi-image text-muted fs-1 d-block mb-2"></i>
                            <small className="text-muted">No image</small>
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="mb-3">
                      <label className="form-label fw-medium">Image URL</label>
                      <input
                        type="text"
                        className="form-control form-control-sm"
                        value={formData.image}
                        onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        placeholder="Enter image URL"
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-warning text-white"
                  onClick={handleSubmit}
                >
                  <i className="bi bi-check me-1"></i>
                  {editingProduct ? 'Save Changes' : 'Create Product'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm !== null && (
        <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <h5 className="modal-title fw-bold">
                  <i className="bi bi-exclamation-triangle text-danger me-2"></i>
                  Confirm Delete
                </h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowDeleteConfirm(null)}
                ></button>
              </div>
              <div className="modal-body">
                <p className="mb-0">
                  Are you sure you want to delete this product? This action cannot be undone.
                </p>
              </div>
              <div className="modal-footer border-0">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowDeleteConfirm(null)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => handleDelete(showDeleteConfirm)}
                >
                  <i className="bi bi-trash me-1"></i>Delete Product
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

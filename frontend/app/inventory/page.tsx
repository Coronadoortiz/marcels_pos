'use client'

import Link from 'next/link'
import { useState } from 'react'
import { sampleProducts, categories } from '@/lib/data'

export default function InventoryPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 8

  const filteredProducts = sampleProducts.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.sku.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory =
      selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage)
  const paginatedProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  )

  const getStockStatus = (stock: number) => {
    if (stock === 0) {
      return { label: 'Out of Stock', class: 'badge-out-of-stock' }
    }
    if (stock <= 10) {
      return { label: 'Low Stock', class: 'badge-low-stock' }
    }
    return { label: 'In Stock', class: 'badge-in-stock' }
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
            <span className="badge fs-6 px-3 py-2" style={{ backgroundColor: '#6f42c1' }}>
              <i className="bi bi-clipboard-data-fill me-2"></i>Inventory Management
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* Stats Row */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 48, height: 48, backgroundColor: '#e2d9f3', color: '#6f42c1' }}
                >
                  <i className="bi bi-box-seam fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">{sampleProducts.length}</h4>
                  <small className="text-muted">Total Products</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 48, height: 48, backgroundColor: '#d1e7dd', color: '#198754' }}
                >
                  <i className="bi bi-check-circle fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">
                    {sampleProducts.filter((p) => p.stock > 10).length}
                  </h4>
                  <small className="text-muted">In Stock</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 48, height: 48, backgroundColor: '#fff3cd', color: '#856404' }}
                >
                  <i className="bi bi-exclamation-triangle fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">
                    {sampleProducts.filter((p) => p.stock > 0 && p.stock <= 10).length}
                  </h4>
                  <small className="text-muted">Low Stock</small>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-3">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body d-flex align-items-center">
                <div
                  className="rounded-circle d-flex align-items-center justify-content-center me-3"
                  style={{ width: 48, height: 48, backgroundColor: '#f8d7da', color: '#842029' }}
                >
                  <i className="bi bi-x-circle fs-4"></i>
                </div>
                <div>
                  <h4 className="mb-0 fw-bold">
                    {sampleProducts.filter((p) => p.stock === 0).length}
                  </h4>
                  <small className="text-muted">Out of Stock</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="card border-0 shadow-sm mb-4">
          <div className="card-body">
            <div className="row g-3 align-items-center">
              <div className="col-md-6">
                <div className="search-wrapper">
                  <i className="bi bi-search"></i>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Search by name or SKU..."
                    value={searchTerm}
                    onChange={(e) => {
                      setSearchTerm(e.target.value)
                      setCurrentPage(1)
                    }}
                  />
                </div>
              </div>
              <div className="col-md-4">
                <select
                  className="form-select"
                  value={selectedCategory}
                  onChange={(e) => {
                    setSelectedCategory(e.target.value)
                    setCurrentPage(1)
                  }}
                >
                  <option value="All">All Categories</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
              <div className="col-md-2">
                <button
                  className="btn btn-outline-secondary w-100"
                  onClick={() => {
                    setSearchTerm('')
                    setSelectedCategory('All')
                    setCurrentPage(1)
                  }}
                >
                  <i className="bi bi-x-circle me-1"></i>Clear
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Inventory Table */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-table me-2" style={{ color: '#6f42c1' }}></i>
              Inventory List
              <span className="badge bg-secondary ms-2">{filteredProducts.length} items</span>
            </h5>
          </div>
          <div className="card-body p-0">
            <div className="table-responsive">
              <table className="table table-hover mb-0">
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>SKU</th>
                    <th>Product</th>
                    <th>Category</th>
                    <th className="text-center">Available Stock</th>
                    <th className="text-end">Sale Price</th>
                    <th className="text-center">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-5 text-muted">
                        <i className="bi bi-search fs-1 d-block mb-3"></i>
                        <p className="mb-0">No products found</p>
                        <small>Try adjusting your search or filters</small>
                      </td>
                    </tr>
                  ) : (
                    paginatedProducts.map((product) => {
                      const status = getStockStatus(product.stock)
                      return (
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
                                <small className="text-muted text-truncate d-block" style={{ maxWidth: 200 }}>
                                  {product.description}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className="badge bg-light text-dark">{product.category}</span>
                          </td>
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
                          <td className="text-end fw-semibold">${product.salePrice.toFixed(2)}</td>
                          <td className="text-center">
                            <span className={`badge ${status.class}`}>{status.label}</span>
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="card-footer bg-white border-0 py-3">
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">
                  Showing {(currentPage - 1) * itemsPerPage + 1} to{' '}
                  {Math.min(currentPage * itemsPerPage, filteredProducts.length)} of{' '}
                  {filteredProducts.length} products
                </small>
                <nav>
                  <ul className="pagination mb-0">
                    <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage - 1)}
                        disabled={currentPage === 1}
                      >
                        <i className="bi bi-chevron-left"></i>
                      </button>
                    </li>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <li
                        key={page}
                        className={`page-item ${currentPage === page ? 'active' : ''}`}
                      >
                        <button className="page-link" onClick={() => setCurrentPage(page)}>
                          {page}
                        </button>
                      </li>
                    ))}
                    <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                      <button
                        className="page-link"
                        onClick={() => setCurrentPage(currentPage + 1)}
                        disabled={currentPage === totalPages}
                      >
                        <i className="bi bi-chevron-right"></i>
                      </button>
                    </li>
                  </ul>
                </nav>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

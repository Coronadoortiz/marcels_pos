'use client'

import Link from 'next/link'

const modules = [
  {
    title: 'Sales',
    description: 'Point of Sale system to process customer orders and generate invoices',
    icon: 'bi-cart-check-fill',
    color: '#0d6efd',
    bgColor: '#e7f1ff',
    href: '/sales',
  },
  {
    title: 'Purchase Orders',
    description: 'Manage supplier orders and inventory restocking',
    icon: 'bi-box-seam-fill',
    color: '#198754',
    bgColor: '#d1e7dd',
    href: '/purchases',
  },
  {
    title: 'Inventory',
    description: 'Track stock levels, manage warehouses and monitor products',
    icon: 'bi-clipboard-data-fill',
    color: '#6f42c1',
    bgColor: '#e2d9f3',
    href: '/inventory',
  },
  {
    title: 'Products',
    description: 'Add, edit and manage your product catalog',
    icon: 'bi-tags-fill',
    color: '#fd7e14',
    bgColor: '#ffe5d0',
    href: '/products',
  },
  {
    title: 'Reports',
    description: 'View sales analytics, KPIs and business insights',
    icon: 'bi-graph-up-arrow',
    color: '#dc3545',
    bgColor: '#f8d7da',
    href: '/reports',
  },
]

export default function Dashboard() {
  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      {/* Header */}
      <nav className="navbar navbar-expand-lg navbar-light bg-white border-bottom shadow-sm">
        <div className="container">
          <Link href="/" className="navbar-brand d-flex align-items-center">
            <i className="bi bi-box-seam text-primary me-2 fs-3"></i>
            <span className="fw-bold">InventoryPro</span>
          </Link>
          <div className="d-flex align-items-center">
            <button className="btn btn-light me-2">
              <i className="bi bi-bell"></i>
            </button>
            <button className="btn btn-light me-2">
              <i className="bi bi-gear"></i>
            </button>
            <div className="dropdown">
              <button
                className="btn btn-light dropdown-toggle d-flex align-items-center"
                type="button"
                data-bs-toggle="dropdown"
              >
                <div
                  className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-2"
                  style={{ width: 32, height: 32 }}
                >
                  <span className="small">JD</span>
                </div>
                <span className="d-none d-md-inline">John Doe</span>
              </button>
              <ul className="dropdown-menu dropdown-menu-end">
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-person me-2"></i>Profile
                  </a>
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-gear me-2"></i>Settings
                  </a>
                </li>
                <li>
                  <hr className="dropdown-divider" />
                </li>
                <li>
                  <a className="dropdown-item" href="#">
                    <i className="bi bi-box-arrow-right me-2"></i>Logout
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-5">
        {/* Welcome Section */}
        <div className="text-center mb-5">
          <h1 className="display-5 fw-bold text-dark mb-3">Welcome to InventoryPro</h1>
          <p className="lead text-muted">
            Complete inventory and sales management system for your business
          </p>
        </div>

        {/* Quick Stats */}
        <div className="row g-4 mb-5">
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#e7f1ff',
                    color: '#0d6efd',
                  }}
                >
                  <i className="bi bi-currency-dollar fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1">$12,450</h3>
                <p className="text-muted small mb-0">{"Today's Sales"}</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#d1e7dd',
                    color: '#198754',
                  }}
                >
                  <i className="bi bi-receipt fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1">48</h3>
                <p className="text-muted small mb-0">Orders Today</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#fff3cd',
                    color: '#856404',
                  }}
                >
                  <i className="bi bi-exclamation-triangle fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1">12</h3>
                <p className="text-muted small mb-0">Low Stock Items</p>
              </div>
            </div>
          </div>
          <div className="col-6 col-lg-3">
            <div className="card h-100 border-0 shadow-sm">
              <div className="card-body text-center">
                <div
                  className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center"
                  style={{
                    width: 48,
                    height: 48,
                    backgroundColor: '#e2d9f3',
                    color: '#6f42c1',
                  }}
                >
                  <i className="bi bi-boxes fs-4"></i>
                </div>
                <h3 className="fw-bold mb-1">1,245</h3>
                <p className="text-muted small mb-0">Total Products</p>
              </div>
            </div>
          </div>
        </div>

        {/* Module Cards */}
        <h2 className="h4 fw-bold mb-4">Modules</h2>
        <div className="row g-4">
          {modules.map((module) => (
            <div key={module.title} className="col-md-6 col-lg-4">
              <Link href={module.href} className="text-decoration-none">
                <div className="card card-module h-100 border-0 shadow-sm">
                  <div className="card-body p-4">
                    <div
                      className="icon-wrapper mb-3"
                      style={{ backgroundColor: module.bgColor, color: module.color }}
                    >
                      <i className={`bi ${module.icon}`}></i>
                    </div>
                    <h5 className="card-title fw-bold text-dark mb-2">{module.title}</h5>
                    <p className="card-text text-muted mb-4">{module.description}</p>
                    <div className="d-flex align-items-center" style={{ color: module.color }}>
                      <span className="fw-semibold">Enter Module</span>
                      <i className="bi bi-arrow-right ms-2"></i>
                    </div>
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {/* Recent Activity */}
        <div className="row mt-5">
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Recent Sales</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Invoice</th>
                        <th>Customer</th>
                        <th className="text-end">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>
                          <span className="text-primary">#INV-0045</span>
                        </td>
                        <td>John Smith</td>
                        <td className="text-end fw-semibold">$245.00</td>
                      </tr>
                      <tr>
                        <td>
                          <span className="text-primary">#INV-0044</span>
                        </td>
                        <td>Sarah Johnson</td>
                        <td className="text-end fw-semibold">$127.50</td>
                      </tr>
                      <tr>
                        <td>
                          <span className="text-primary">#INV-0043</span>
                        </td>
                        <td>Mike Wilson</td>
                        <td className="text-end fw-semibold">$89.99</td>
                      </tr>
                      <tr>
                        <td>
                          <span className="text-primary">#INV-0042</span>
                        </td>
                        <td>Emily Brown</td>
                        <td className="text-end fw-semibold">$312.00</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6 mb-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">Low Stock Alerts</h5>
              </div>
              <div className="card-body p-0">
                <div className="table-responsive">
                  <table className="table table-hover mb-0">
                    <thead>
                      <tr>
                        <th>Product</th>
                        <th className="text-center">Stock</th>
                        <th className="text-end">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Standing Desk</td>
                        <td className="text-center">0</td>
                        <td className="text-end">
                          <span className="badge badge-out-of-stock">Out of Stock</span>
                        </td>
                      </tr>
                      <tr>
                        <td>SSD 500GB</td>
                        <td className="text-center">3</td>
                        <td className="text-end">
                          <span className="badge badge-low-stock">Low Stock</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Ballpoint Pen Set</td>
                        <td className="text-center">8</td>
                        <td className="text-end">
                          <span className="badge badge-low-stock">Low Stock</span>
                        </td>
                      </tr>
                      <tr>
                        <td>Ergonomic Chair</td>
                        <td className="text-center">15</td>
                        <td className="text-end">
                          <span className="badge badge-low-stock">Low Stock</span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-top py-4 mt-auto">
        <div className="container text-center text-muted">
          <p className="mb-0">InventoryPro ERP System - Inventory & Sales Management</p>
        </div>
      </footer>
    </div>
  )
}

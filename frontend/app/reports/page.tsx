'use client'

import Link from 'next/link'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
  },
  scales: {
    y: {
      beginAtZero: true,
      grid: {
        color: 'rgba(0, 0, 0, 0.05)',
      },
    },
    x: {
      grid: {
        display: false,
      },
    },
  },
}

export default function ReportsPage() {
  // Inicialización segura en ceros para evitar errores de compilación tras limpiar data.ts
  const dailyTotal = 0
  const weeklyTotal = 0
  const monthlyTotal = 0
  const netProfit = 0
  const expenses = 0

  const dailyChartData = {
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        backgroundColor: 'rgba(13, 110, 253, 0.8)',
        borderRadius: 6,
      },
    ],
  }

  const weeklyChartData = {
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        borderColor: '#198754',
        backgroundColor: 'rgba(25, 135, 84, 0.1)',
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#198754',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 6,
      },
    ],
  }

  const monthlyChartData = {
    labels: [],
    datasets: [
      {
        label: 'Sales',
        data: [],
        backgroundColor: [
          'rgba(13, 110, 253, 0.8)',
          'rgba(25, 135, 84, 0.8)',
          'rgba(111, 66, 193, 0.8)',
          'rgba(253, 126, 20, 0.8)',
          'rgba(220, 53, 69, 0.8)',
          'rgba(23, 162, 184, 0.8)',
        ],
        borderRadius: 6,
      },
    ],
  }

  const topProductsChartData = {
    labels: [],
    datasets: [
      {
        data: [],
        backgroundColor: [
          'rgba(13, 110, 253, 0.9)',
          'rgba(25, 135, 84, 0.9)',
          'rgba(253, 126, 20, 0.9)',
          'rgba(111, 66, 193, 0.9)',
          'rgba(220, 53, 69, 0.9)',
        ],
        borderWidth: 0,
      },
    ],
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
            <span className="badge bg-danger fs-6 px-3 py-2">
              <i className="bi bi-graph-up-arrow me-2"></i>Reports & Analytics
            </span>
          </div>
        </div>
      </nav>

      <div className="container py-4">
        {/* KPI Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-6 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Daily Sales</p>
                    <h3 className="fw-bold mb-0">${dailyTotal.toLocaleString()}</h3>
                    <small className="text-muted">No data available</small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, backgroundColor: '#e7f1ff', color: '#0d6efd' }}
                  >
                    <i className="bi bi-calendar-day fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Weekly Sales</p>
                    <h3 className="fw-bold mb-0">${weeklyTotal.toLocaleString()}</h3>
                    <small className="text-muted">No data available</small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, backgroundColor: '#d1e7dd', color: '#198754' }}
                  >
                    <i className="bi bi-calendar-week fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Monthly Sales</p>
                    <h3 className="fw-bold mb-0">${monthlyTotal.toLocaleString()}</h3>
                    <small className="text-muted">No data available</small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, backgroundColor: '#e2d9f3', color: '#6f42c1' }}
                  >
                    <i className="bi bi-calendar-month fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Net Profit</p>
                    <h3 className="fw-bold mb-0 text-success">${netProfit.toLocaleString()}</h3>
                    <small className="text-muted">No data available</small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, backgroundColor: '#d1f2eb', color: '#0d9488' }}
                  >
                    <i className="bi bi-currency-dollar fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-lg">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-body">
                <div className="d-flex justify-content-between align-items-start">
                  <div>
                    <p className="text-muted small mb-1">Expenses</p>
                    <h3 className="fw-bold mb-0 text-danger">${expenses.toLocaleString()}</h3>
                    <small className="text-muted">No data available</small>
                  </div>
                  <div
                    className="rounded-circle d-flex align-items-center justify-content-center"
                    style={{ width: 48, height: 48, backgroundColor: '#f8d7da', color: '#dc3545' }}
                  >
                    <i className="bi bi-wallet2 fs-4"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 1 */}
        <div className="row g-4 mb-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bar-chart me-2 text-primary"></i>Sales by Day
                </h5>
              </div>
              <div className="card-body">
                <div className="chart-container text-center py-5 text-muted font-monospace">
                  [ Module Pending Backend Reports Integration ]
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-pie-chart me-2 text-warning"></i>Best Selling Products
                </h5>
              </div>
              <div className="card-body d-flex align-items-center justify-content-center">
                <div className="text-muted small font-monospace">No items recorded yet</div>
              </div>
            </div>
          </div>
        </div>

        {/* Charts Row 2 */}
        <div className="row g-4 mb-4">
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-graph-up me-2 text-success"></i>Sales by Week
                </h5>
              </div>
              <div className="card-body">
                <div className="chart-container text-center py-5 text-muted font-monospace">
                  [ Procurement Analytics Pending ]
                </div>
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="card border-0 shadow-sm h-100">
              <div className="card-header bg-white border-0 py-3">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-bar-chart-fill me-2" style={{ color: '#6f42c1' }}></i>
                  Sales by Month
                </h5>
              </div>
              <div className="card-body">
                <div className="chart-container text-center py-5 text-muted font-monospace">
                  [ Monthly Volume Charts Pending ]
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Sales History Table Empty Placeholder */}
        <div className="card border-0 shadow-sm">
          <div className="card-header bg-white border-0 py-3 d-flex justify-content-between align-items-center">
            <h5 className="mb-0 fw-bold">
              <i className="bi bi-clock-history me-2 text-primary"></i>Sales History
            </h5>
          </div>
          <div className="card-body p-5 text-center text-muted">
            <i className="bi bi-graph-down fs-2 mb-2 d-block text-secondary"></i>
            <p className="mb-0 fw-medium">History Log Empty</p>
            <small>Live analytical logging will resume once reporting service goes online.</small>
          </div>
        </div>
      </div>
    </div>
  )
}
'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'
import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, LineElement, 
  PointElement, ArcElement, Title, Tooltip, Legend,
} from 'chart.js'
import { Bar, Line, Doughnut } from 'react-chartjs-2'

ChartJS.register(CategoryScale, LinearScale, BarElement, LineElement, PointElement, ArcElement, Title, Tooltip, Legend)

export default function ReportsPage() {
  const [report, setReport] = useState({
    totalSales: 0,
    totalPurchases: 0,
    netProfit: 0,
    totalSalesCount: 0,
    totalPurchasesCount: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('http://127.0.0.1:8080/api/finance/report')
      .then(res => res.json())
      .then(data => {
        setReport(data)
        setLoading(false)
      })
      .catch(err => {
        console.error("Error fetching financial data:", err)
        setLoading(false)
      })
  }, [])

  if (loading) return <div className="min-vh-100 d-flex align-items-center justify-content-center">Loading Financial Reports...</div>

  // Configuración de Gráficos con datos dinámicos del DTO
  const profitChartData = {
    labels: ['Sales', 'Purchases'],
    datasets: [{
      data: [report.totalSales, report.totalPurchases],
      backgroundColor: ['#0d6efd', '#dc3545'],
      borderWidth: 0,
    }]
  }

  return (
    <div className="min-vh-100" style={{ backgroundColor: '#f8f9fa' }}>
      <nav className="navbar navbar-light bg-white border-bottom shadow-sm">
        <div className="container-fluid px-4">
          <Link href="/" className="btn btn-light me-3"><i className="bi bi-arrow-left"></i></Link>
          <span className="navbar-brand fw-bold"><i className="bi bi-graph-up-arrow text-danger me-2"></i>Finance Analytics</span>
        </div>
      </nav>

      <div className="container py-4">
        {/* KPI Cards Reales */}
        <div className="row g-4 mb-4">
          <div className="col-md-3"><div className="card border-0 shadow-sm p-4"><p className="text-muted small">Total Revenue</p><h3 className="fw-bold text-primary">${report.totalSales.toLocaleString()}</h3></div></div>
          <div className="col-md-3"><div className="card border-0 shadow-sm p-4"><p className="text-muted small">Total Expenses</p><h3 className="fw-bold text-danger">${report.totalPurchases.toLocaleString()}</h3></div></div>
          <div className="col-md-3"><div className="card border-0 shadow-sm p-4"><p className="text-muted small">Net Profit</p><h3 className="fw-bold text-success">${report.netProfit.toLocaleString()}</h3></div></div>
          <div className="col-md-3"><div className="card border-0 shadow-sm p-4"><p className="text-muted small">Total Operations</p><h3 className="fw-bold">{report.totalSalesCount + report.totalPurchasesCount}</h3></div></div>
        </div>

        {/* Charts Section */}
        <div className="row g-4">
          <div className="col-lg-8">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-4">Financial Overview</h5>
              <div style={{ height: '300px' }}>
                <Bar data={{
                  labels: ['Sales', 'Purchases', 'Net Profit'],
                  datasets: [{
                    label: 'Amount ($)',
                    data: [report.totalSales, report.totalPurchases, report.netProfit],
                    backgroundColor: ['#0d6efd', '#dc3545', '#198754']
                  }]
                }} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          <div className="col-lg-4">
            <div className="card border-0 shadow-sm p-4">
              <h5 className="fw-bold mb-4">Profit Distribution</h5>
              <div style={{ height: '300px' }}>
                <Doughnut data={profitChartData} options={{ responsive: true, maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
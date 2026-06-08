'use client'

import { formatCurrency } from '@/lib/utils'

interface DetailsModalProps {
  isOpen: boolean
  onClose: () => void
  data: any // El objeto de venta o compra
  title: string
}

export default function DetailsModal({ isOpen, onClose, data, title }: DetailsModalProps) {
  if (!isOpen) return null

  // Detectamos si es venta o compra para usar los campos correctos
  const details = data.saleDetails || data.purchaseDetails || []
  const isSale = !!data.idSale

  return (
    <div className="modal show d-block" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
      <div className="modal-dialog modal-lg modal-dialog-centered">
        <div className="modal-content shadow-lg border-0">
          <div className="modal-header bg-light">
            <h5 className="modal-title fw-bold">{title} #{data.idSale || data.idPurchase}</h5>
            <button className="btn-close" onClick={onClose}></button>
          </div>
          <div className="modal-body">
            <div className="row mb-3">
              <div className="col-6"><strong>Fecha:</strong> {new Date().toLocaleDateString()}</div>
              <div className="col-6"><strong>Método de Pago:</strong> {data.paymentMethod?.namePaymentMethod || 'N/A'}</div>
            </div>
            
            <table className="table table-striped">
              <thead>
                <tr>
                  <th>Item</th>
                  <th className="text-center">Cant.</th>
                  <th className="text-end">Val. Unit</th>
                  <th className="text-end">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {details.map((d: any, i: number) => {
                  const precio = d.product?.sellingValueProduct || d.purchasePriceUnit || 0
                  const cant = d.amountProducts || d.amountPurchased || 0
                  return (
                    <tr key={i}>
                      <td>{d.product?.nameProduct || 'Producto'}</td>
                      <td className="text-center">{cant}</td>
                      <td className="text-end">{formatCurrency(precio)}</td>
                      <td className="text-end">{formatCurrency(precio * cant)}</td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
            
            <div className="text-end mt-3 fs-5 fw-bold">
              Total: {formatCurrency(data.total || 0)}
            </div>
          </div>
          <div className="modal-footer">
            <button className="btn btn-primary" onClick={onClose}>Cerrar</button>
          </div>
        </div>
      </div>
    </div>
  )
}
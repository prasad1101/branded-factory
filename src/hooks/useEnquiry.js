import { useCallback, useContext } from 'react'
import { useNavigate } from 'react-router-dom'
import { EnquiryContext } from '../context/EnquiryContext'
import { ToastContext } from '../context/ToastContext'

export function useEnquiry() {
  const ctx = useContext(EnquiryContext)
  if (!ctx) throw new Error('useEnquiry must be used inside <EnquiryProvider>')
  return ctx
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used inside <ToastProvider>')
  return ctx
}

/** Add a product to the enquiry list and show a toast with a "View" shortcut. */
export function useAddToList() {
  const { add } = useEnquiry()
  const toast = useToast()
  const navigate = useNavigate()
  return useCallback(
    (product, qty = 1) => {
      add(product.id, qty)
      toast(`${qty > 1 ? `${qty} × ` : ''}${product.name} added to your enquiry list`, {
        action: { label: 'View', onClick: () => navigate('/enquiry') },
      })
    },
    [add, toast, navigate],
  )
}

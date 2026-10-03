import { useEffect, useRef, useState } from 'react'

/**
 * Mounts its children only when they get close to the viewport.
 * Keeps the first render small (faster first paint on phones) on long pages like Home.
 */
export default function Deferred({ children, minHeight = 400, rootMargin = '600px 0px' }) {
  const ref = useRef(null)
  const [show, setShow] = useState(typeof IntersectionObserver === 'undefined')

  useEffect(() => {
    if (show || !ref.current) return
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShow(true)
          io.disconnect()
        }
      },
      { rootMargin },
    )
    io.observe(ref.current)
    return () => io.disconnect()
  }, [show, rootMargin])

  if (show) return children
  return <div ref={ref} style={{ minHeight }} aria-hidden="true" />
}

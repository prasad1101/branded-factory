import Skeleton, { ProductGridSkeleton } from './Skeleton'

export default function PageLoader() {
  return (
    <div className="container-px py-10" role="status" aria-label="Loading">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-3 h-4 w-80 max-w-full" />
      <div className="mt-8">
        <ProductGridSkeleton count={8} />
      </div>
    </div>
  )
}

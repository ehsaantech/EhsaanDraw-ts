import '../../App.css'

function SkeletonCard() {
  return (
    <div className="skeleton-card">
        <div className="skeleton-card-content">
          <div className="skeleton-card-image"></div>
          <div className="skeleton-card-description"></div>
        </div>

    </div>
  );
}


function SkeletonGrid() {
  return (
    <div className="skeleton-grid">
    {Array.from({ length: 8 }).map((_, index) => (
      <SkeletonCard key={index} />
    ))}
  </div>
  );
}

export default SkeletonGrid;
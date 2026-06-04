import './Pagination.css';

const Pagination = ({ page, total, perPage, onPage }) => {
  const totalPages = Math.ceil(total / perPage);
  if (totalPages < 1) return null;
  return (
    <div className="pagination">
      <button className="pg-btn" onClick={() => onPage(page - 1)} disabled={page === 1}>‹</button>
      {Array.from({ length: totalPages }, (_, i) => i + 1).map(p => (
        <button key={p} className={`pg-btn${p === page ? ' pg-active' : ''}`} onClick={() => onPage(p)}>{p}</button>
      ))}
      <button className="pg-btn" onClick={() => onPage(page + 1)} disabled={page === totalPages}>›</button>
    </div>
  );
};

export default Pagination;

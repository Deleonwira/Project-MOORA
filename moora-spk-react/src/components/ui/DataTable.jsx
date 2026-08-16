export function DataTable({ children, className = '' }) {
  return (
    <div className="table-wrap">
      <table className={`data-table ${className}`}>
        {children}
      </table>
    </div>
  );
}

export function TopBar({ breadcrumb, onToggleSidebar }) {
  return (
    <div className="top-bar">
      <button className="hamburger" id="hamburger" aria-label="Menu" onClick={onToggleSidebar}>
        <span></span>
        <span></span>
        <span></span>
      </button>
      <span className="breadcrumb-text">{breadcrumb}</span>
    </div>
  );
}

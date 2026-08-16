export function Card({ header, className = '', children, style }) {
  return (
    <div className={`card ${className}`} style={style}>
      {header && <div className="card-header">{header}</div>}
      <div className="card-body">{children}</div>
    </div>
  );
}

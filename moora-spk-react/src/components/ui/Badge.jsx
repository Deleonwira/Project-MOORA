export function Badge({ type, children }) {
  const className = `badge badge-${type}`;
  return <span className={className}>{children}</span>;
}

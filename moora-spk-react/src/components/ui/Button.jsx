export function Button({ variant, size, className = '', children, ...props }) {
  const classes = [
    'btn',
    variant && `btn-${variant}`,
    size && `btn-${size}`,
    className,
  ].filter(Boolean).join(' ');

  return (
    <button className={classes} {...props}>
      {children}
    </button>
  );
}

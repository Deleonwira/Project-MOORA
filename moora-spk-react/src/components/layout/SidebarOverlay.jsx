export function SidebarOverlay({ isOpen, onClose }) {
  return (
    <div
      className={`sidebar-overlay${isOpen ? ' active' : ''}`}
      id="sidebar-overlay"
      onClick={onClose}
    />
  );
}

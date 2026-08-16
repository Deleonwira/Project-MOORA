import { useToast } from '../../hooks/useToast';

export function Toast() {
  const { toast } = useToast();

  const className = [
    'toast',
    `toast-${toast.type}`,
    toast.visible && 'show',
  ].filter(Boolean).join(' ');

  return (
    <div id="toast" className={className}>
      {toast.message}
    </div>
  );
}

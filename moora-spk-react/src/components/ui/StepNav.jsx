import { useNavigate } from 'react-router-dom';
import { Button } from './Button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export function StepNav({ prevLabel, prevPath, nextLabel, nextPath }) {
  const navigate = useNavigate();

  return (
    <div className="step-nav">
      <Button variant="outline" onClick={() => navigate(prevPath)}>
        <ChevronLeft size={16} /> {prevLabel}
      </Button>
      <Button variant="primary" onClick={() => navigate(nextPath)}>
        {nextLabel} <ChevronRight size={16} />
      </Button>
    </div>
  );
}

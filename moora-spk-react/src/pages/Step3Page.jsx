import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../hooks/useDataStore';
import { runFull } from '../lib/moora-engine';
import { formatNumber } from '../lib/utils';
import { DataTable } from '../components/ui/DataTable';
import { FormulaBox } from '../components/ui/FormulaBox';
import { EmptyState } from '../components/ui/EmptyState';
import { StepNav } from '../components/ui/StepNav';
import { Button } from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export function Step3Page() {
  const { alternatives, criteria } = useDataStore();
  const navigate = useNavigate();

  if (alternatives.length < 2) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Langkah 3 — Matriks Terbobot</h1>
          <p>Mengalikan nilai ternormalisasi dengan bobot kepentingan masing-masing kriteria.</p>
        </div>
        <EmptyState>
          <p>Diperlukan minimal 2 alternatif untuk melakukan perhitungan.</p>
          <Button variant="outline" onClick={() => navigate('/')}><ChevronLeft size={16} /> Kembali ke Beranda</Button>
        </EmptyState>
      </div>
    );
  }

  const result = runFull(alternatives, criteria);

  return (
    <div className="page">
      <div className="page-header">
        <h1>Langkah 3 — Matriks Terbobot</h1>
        <p>Mengalikan nilai ternormalisasi dengan bobot kepentingan masing-masing kriteria.</p>
      </div>

      <FormulaBox
        label="Rumus Pembobotan"
        formula='y<sub>ij</sub> = x*<sub>ij</sub> × w<sub>j</sub>'
        explanation="Setiap nilai pada matriks ternormalisasi dikalikan dengan bobot kriteria yang bersesuaian."
      />

      {/* Weights Reference */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">Bobot Kriteria</div>
        <div className="card-body">
          <DataTable>
            <thead>
              <tr>{criteria.map((cr) => <th key={cr.code}>{cr.code}</th>)}</tr>
            </thead>
            <tbody>
              <tr>{criteria.map((cr) => <td key={cr.code} className="mono">{cr.weight.toFixed(2)}</td>)}</tr>
            </tbody>
          </DataTable>
        </div>
      </div>

      {/* Example Calculation */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">Contoh Perhitungan — {alternatives[0].name}</div>
        <div className="card-body">
          {criteria.slice(0, 3).map((cr, e) => (
            <div key={cr.code} className="breakdown-row">
              <span className="label">y<sub>{`1,${e + 1}`}</sub> ({cr.code})</span>
              <span className="calc">{formatNumber(result.normalized[0][e], 4)} × {cr.weight.toFixed(2)} = {formatNumber(result.weighted[0][e], 4)}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Weighted Matrix */}
      <div className="section-title" style={{ marginTop: 'var(--space-xl)' }}>Matriks Terbobot (Y)</div>
      <div className="section-subtitle">Nilai ternormalisasi yang telah dikalikan dengan bobot</div>
      <DataTable>
        <thead>
          <tr>
            <th>Alternatif</th>
            {criteria.map((cr) => (
              <th key={cr.code} className={cr.type === 'cost' ? 'highlight-cost' : 'highlight-benefit'}>{cr.code}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alternatives.map((alt, i) => (
            <tr key={alt.id}>
              <td>{alt.name}</td>
              {criteria.map((cr, j) => (
                <td key={j} className={`mono ${cr.type === 'cost' ? 'highlight-cost' : 'highlight-benefit'}`}>
                  {formatNumber(result.weighted[i][j], 4)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </DataTable>

      <StepNav prevLabel="Normalisasi" prevPath="/step/2" nextLabel="Optimasi Yi" nextPath="/step/4" />
    </div>
  );
}

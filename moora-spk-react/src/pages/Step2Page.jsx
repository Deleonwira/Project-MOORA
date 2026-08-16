import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../hooks/useDataStore';
import { runFull } from '../lib/moora-engine';
import { formatNumber } from '../lib/utils';
import { DataTable } from '../components/ui/DataTable';
import { Tag } from '../components/ui/Tag';
import { FormulaBox } from '../components/ui/FormulaBox';
import { EmptyState } from '../components/ui/EmptyState';
import { StepNav } from '../components/ui/StepNav';
import { Button } from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export function Step2Page() {
  const { alternatives, criteria } = useDataStore();
  const navigate = useNavigate();

  if (alternatives.length < 2) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Langkah 2 — Normalisasi Matriks</h1>
          <p>Menyatukan semua satuan ukuran yang berbeda menjadi nilai rasio yang sebanding.</p>
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
        <h1>Langkah 2 — Normalisasi Matriks</h1>
        <p>Menyatukan semua satuan ukuran yang berbeda menjadi nilai rasio yang sebanding.</p>
      </div>

      <FormulaBox
        label="Rumus Normalisasi"
        formula='x*<sub>ij</sub> = x<sub>ij</sub> / √( Σ x<sub>ij</sub>² )'
        explanation="Setiap nilai dibagi dengan akar kuadrat dari jumlah kuadrat seluruh nilai pada kolom yang sama."
      />

      {/* Denominator Calculations */}
      <div className="card" style={{ marginBottom: 'var(--space-lg)' }}>
        <div className="card-header">Perhitungan Nilai Pembagi</div>
        <div className="card-body">
          <DataTable>
            <thead><tr><th>Kriteria</th><th>Perhitungan</th><th>Hasil</th></tr></thead>
            <tbody>
              {criteria.map((cr, j) => {
                const squaredParts = alternatives.map((a) => `${a.values[j]}²`);
                const squaredValues = alternatives.map((a) => a.values[j] * a.values[j]);
                const sumOfSquares = squaredValues.reduce((s, v) => s + v, 0);
                const calcStr = `√(${squaredParts.join(' + ')}) = √(${squaredValues.join(' + ')}) = √(${sumOfSquares})`;
                return (
                  <tr key={cr.code}>
                    <td><Tag>{cr.code}</Tag></td>
                    <td className="mono" style={{ fontSize: 'var(--text-xs)', wordBreak: 'break-all' }}>{calcStr}</td>
                    <td className="mono" style={{ fontWeight: 500 }}>{formatNumber(result.denominators[j], 4)}</td>
                  </tr>
                );
              })}
            </tbody>
          </DataTable>
        </div>
      </div>

      {/* Normalized Matrix */}
      <div className="section-title" style={{ marginTop: 'var(--space-xl)' }}>Matriks Ternormalisasi (X*)</div>
      <div className="section-subtitle">Nilai setelah normalisasi menggunakan pembagi di atas</div>
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
                  {formatNumber(result.normalized[i][j], 4)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </DataTable>

      <StepNav prevLabel="Matriks Keputusan" prevPath="/step/1" nextLabel="Matriks Terbobot" nextPath="/step/3" />
    </div>
  );
}

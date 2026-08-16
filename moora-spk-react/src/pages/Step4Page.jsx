import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../hooks/useDataStore';
import { runFull } from '../lib/moora-engine';
import { formatNumber } from '../lib/utils';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { FormulaBox } from '../components/ui/FormulaBox';
import { EmptyState } from '../components/ui/EmptyState';
import { StepNav } from '../components/ui/StepNav';
import { Button } from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export function Step4Page() {
  const { alternatives, criteria } = useDataStore();
  const navigate = useNavigate();

  if (alternatives.length < 2) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Langkah 4 — Optimasi Multi-Objektif</h1>
          <p>Menghitung nilai optimasi (Yi) berdasarkan selisih total benefit dan total cost.</p>
        </div>
        <EmptyState>
          <p>Diperlukan minimal 2 alternatif untuk melakukan perhitungan.</p>
          <Button variant="outline" onClick={() => navigate('/')}><ChevronLeft size={16} /> Kembali ke Beranda</Button>
        </EmptyState>
      </div>
    );
  }

  const result = runFull(alternatives, criteria);

  const benefitCriteria = criteria.filter((c) => c.type === 'benefit');
  const costCriteria = criteria.filter((c) => c.type === 'cost');

  return (
    <div className="page">
      <div className="page-header">
        <h1>Langkah 4 — Optimasi Multi-Objektif</h1>
        <p>Menghitung nilai optimasi (Yi) berdasarkan selisih total benefit dan total cost.</p>
      </div>

      <FormulaBox
        label="Rumus Nilai Optimasi"
        formula='y<sub>i</sub> = Σ y<sub>ij</sub> <span style="color:var(--benefit);">(benefit)</span> − Σ y<sub>ij</sub> <span style="color:var(--cost);">(cost)</span>'
        explanation="Nilai Yi didapat dengan menjumlahkan seluruh kriteria bertipe Benefit, lalu dikurangi penjumlahan seluruh kriteria bertipe Cost."
      />

      {/* Criteria Grouping */}
      <div className="criteria-groups">
        <div className="criteria-group">
          <h4><Badge type="benefit">Benefit</Badge> Maksimasi</h4>
          <ul>
            {benefitCriteria.map((cr) => (
              <li key={cr.code}>{cr.code} — {cr.name}</li>
            ))}
          </ul>
        </div>
        <div className="criteria-group">
          <h4><Badge type="cost">Cost</Badge> Minimasi</h4>
          <ul>
            {costCriteria.map((cr) => (
              <li key={cr.code}>{cr.code} — {cr.name}</li>
            ))}
          </ul>
        </div>
      </div>

      {/* Per-Alternative Breakdown */}
      <div className="section-title">Perhitungan Per Alternatif</div>
      <div className="section-subtitle">Rincian penjumlahan benefit dan cost untuk setiap alternatif</div>

      {alternatives.map((alt, i) => {
        const benefitParts = criteria
          .map((cr, j) => cr.type === 'benefit' ? formatNumber(result.weighted[i][j], 4) : null)
          .filter(Boolean);
        const costParts = criteria
          .map((cr, j) => cr.type === 'cost' ? formatNumber(result.weighted[i][j], 4) : null)
          .filter(Boolean);

        return (
          <div key={alt.id} className="card breakdown-card">
            <div className="card-header">{alt.name}</div>
            <div className="card-body">
              <div className="breakdown-row">
                <span className="label text-benefit">Total Benefit</span>
                <span className="calc">{benefitParts.join(' + ')} = <strong className="text-benefit">{formatNumber(result.yi[i].benefitSum, 4)}</strong></span>
              </div>
              <div className="breakdown-row">
                <span className="label text-cost">Total Cost</span>
                <span className="calc">{costParts.join(' + ')} = <strong className="text-cost">{formatNumber(result.yi[i].costSum, 4)}</strong></span>
              </div>
              <div className="breakdown-row">
                <span className="label" style={{ fontWeight: 500 }}>Nilai Yi</span>
                <span className="calc">{formatNumber(result.yi[i].benefitSum, 4)} − {formatNumber(result.yi[i].costSum, 4)} = <strong>{formatNumber(result.yi[i].yi, 4)}</strong></span>
              </div>
            </div>
          </div>
        );
      })}

      {/* Summary Table */}
      <div className="section-title" style={{ marginTop: 'var(--space-xl)' }}>Ringkasan Nilai Optimasi</div>
      <div className="section-subtitle">Perbandingan nilai Yi seluruh alternatif</div>
      <DataTable>
        <thead>
          <tr><th>Alternatif</th><th>Total Benefit</th><th>Total Cost</th><th>Nilai Yi</th></tr>
        </thead>
        <tbody>
          {alternatives.map((alt, i) => (
            <tr key={alt.id}>
              <td>{alt.name}</td>
              <td className="mono text-benefit">{formatNumber(result.yi[i].benefitSum, 4)}</td>
              <td className="mono text-cost">{formatNumber(result.yi[i].costSum, 4)}</td>
              <td className="mono" style={{ fontWeight: 600 }}>{formatNumber(result.yi[i].yi, 4)}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      <StepNav prevLabel="Matriks Terbobot" prevPath="/step/3" nextLabel="Perankingan" nextPath="/step/5" />
    </div>
  );
}

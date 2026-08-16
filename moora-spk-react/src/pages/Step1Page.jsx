import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../hooks/useDataStore';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { StepNav } from '../components/ui/StepNav';
import { Button } from '../components/ui/Button';
import { ChevronLeft } from 'lucide-react';

export function Step1Page() {
  const { alternatives, criteria } = useDataStore();
  const navigate = useNavigate();

  if (alternatives.length < 2) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Langkah 1 — Matriks Keputusan</h1>
          <p>Data awal yang akan digunakan dalam perhitungan MOORA.</p>
        </div>
        <EmptyState>
          <p>Diperlukan minimal 2 alternatif untuk melakukan perhitungan.</p>
          <Button variant="outline" onClick={() => navigate('/')}><ChevronLeft size={16} /> Kembali ke Beranda</Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>Langkah 1 — Matriks Keputusan</h1>
        <p>Data awal yang akan digunakan dalam perhitungan MOORA.</p>
      </div>

      <Card style={{ marginBottom: 'var(--space-lg)' }}>
        <p>Matriks keputusan berisi data mentah dari setiap alternatif terhadap seluruh kriteria yang telah ditentukan. Data ini menjadi dasar untuk seluruh proses perhitungan selanjutnya.</p>
      </Card>

      <DataTable>
        <thead>
          <tr>
            <th>Alternatif</th>
            {criteria.map((cr) => (
              <th key={cr.code} className={cr.type === 'cost' ? 'highlight-cost' : 'highlight-benefit'}>
                {cr.code}<span className="th-sub">{cr.name}</span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {alternatives.map((alt) => (
            <tr key={alt.id}>
              <td>{alt.name}</td>
              {alt.values.map((v, j) => (
                <td key={j} className={`mono ${criteria[j].type === 'cost' ? 'highlight-cost' : 'highlight-benefit'}`}>{v}</td>
              ))}
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td style={{ fontWeight: 500 }}>Bobot (w<sub>j</sub>)</td>
            {criteria.map((cr) => (
              <td key={cr.code} className="mono">{cr.weight.toFixed(2)}</td>
            ))}
          </tr>
          <tr>
            <td style={{ fontWeight: 500 }}>Tipe</td>
            {criteria.map((cr) => (
              <td key={cr.code}><Badge type={cr.type}>{cr.type === 'benefit' ? 'Benefit' : 'Cost'}</Badge></td>
            ))}
          </tr>
        </tfoot>
      </DataTable>

      <StepNav prevLabel="Beranda" prevPath="/" nextLabel="Normalisasi" nextPath="/step/2" />
    </div>
  );
}

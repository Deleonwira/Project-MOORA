import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../hooks/useDataStore';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { runFull } from '../lib/moora-engine';
import { formatNumber } from '../lib/utils';
import { exportToPdf } from '../lib/pdf-export';
import { DataTable } from '../components/ui/DataTable';
import { Card } from '../components/ui/Card';
import { EmptyState } from '../components/ui/EmptyState';
import { StepNav } from '../components/ui/StepNav';
import { Button } from '../components/ui/Button';
import { FileDown, Save, Check, Loader2, ChevronLeft } from 'lucide-react';

function getRankLabel(rank) {
  switch (rank) {
    case 1: return 'Rekomendasi Utama';
    case 2: return 'Alternatif Kedua';
    case 3: return 'Alternatif Ketiga';
    default: return `Peringkat ${rank}`;
  }
}

export function Step5Page() {
  const { alternatives, criteria, saveHistory } = useDataStore();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  if (alternatives.length < 2) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>Langkah 5 — Hasil Perankingan</h1>
          <p>Peringkat akhir alternatif berdasarkan nilai Yi tertinggi.</p>
        </div>
        <EmptyState>
          <p>Diperlukan minimal 2 alternatif untuk melakukan perhitungan.</p>
          <Button variant="outline" onClick={() => navigate('/')}><ChevronLeft size={16} /> Kembali ke Beranda</Button>
        </EmptyState>
      </div>
    );
  }

  const result = runFull(alternatives, criteria);
  const ranking = result.ranking;

  const handleSaveHistory = async () => {
    setSaving(true);
    const res = await saveHistory('Perhitungan MOORA', alternatives, result);
    setSaving(false);
    if (res.success) {
      showToast(res.message || 'Berhasil disimpan ke history!', 'success');
      setSaved(true);
    } else {
      showToast(res.message || 'Gagal menyimpan.', 'error');
    }
  };

  const handleExportPdf = () => {
    try {
      exportToPdf({
        title: 'Hasil Perankingan MOORA',
        ranking,
        isHistory: false,
      });
      showToast('PDF berhasil diunduh!', 'success');
    } catch {
      showToast('Gagal membuat PDF.', 'error');
    }
  };

  return (
    <div className="page">
      <div className="page-header">
        <h1>Langkah 5 — Hasil Perankingan</h1>
        <p>Peringkat akhir alternatif berdasarkan nilai Yi tertinggi.</p>
      </div>

      <Card style={{ marginBottom: 'var(--space-lg)' }}>
        <p>Peringkat ditentukan berdasarkan nilai Yi dari yang tertinggi ke terendah. Alternatif dengan nilai Yi tertinggi merupakan pilihan paling optimal berdasarkan seluruh kriteria yang telah dievaluasi.</p>
      </Card>

      {/* Ranking List */}
      <div className="ranking-list">
        {ranking.map((item) => (
          <div key={item.id} className={`ranking-item${item.rank <= 3 ? ` rank-${item.rank}` : ''}`}>
            <div className="ranking-number">{item.rank}</div>
            <div className="ranking-details">
              <div className="rank-name">{item.name}</div>
              <div className="yi-value">{formatNumber(item.yi, 4)}</div>
            </div>
            <div className="ranking-label">{getRankLabel(item.rank)}</div>
          </div>
        ))}
      </div>

      {/* Ranking Table */}
      <div className="section-title">Tabel Perankingan Lengkap</div>
      <div className="section-subtitle">Data perankingan dalam format tabel</div>
      <DataTable>
        <thead>
          <tr><th>Peringkat</th><th>Alternatif</th><th>Nilai Yi</th><th>Keterangan</th></tr>
        </thead>
        <tbody>
          {ranking.map((ri) => (
            <tr key={ri.id} style={ri.rank === 1 ? { backgroundColor: 'rgba(59,130,246,0.05)' } : undefined}>
              <td className="mono" style={{ fontWeight: 600 }}>{ri.rank}</td>
              <td>{ri.name}</td>
              <td className="mono">{formatNumber(ri.yi, 4)}</td>
              <td>{getRankLabel(ri.rank)}</td>
            </tr>
          ))}
        </tbody>
      </DataTable>

      {/* Recommendation */}
      {ranking.length > 0 && (
        <Card header="Rekomendasi" className="recommendation-card" style={{ marginTop: 'var(--space-xl)' }}>
          <p>Berdasarkan analisis menggunakan metode MOORA, <strong>{ranking[0].name}</strong> merupakan pilihan terbaik dengan nilai optimasi Yi sebesar <strong className="mono">{formatNumber(ranking[0].yi, 4)}</strong>.</p>
        </Card>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 'var(--space-md)', marginTop: 'var(--space-lg)', flexWrap: 'wrap' }}>
        <Button
          variant="outline"
          onClick={handleExportPdf}
          style={{ padding: '10px 28px' }}
        >
          <FileDown size={16} /> Export PDF
        </Button>
        {isLoggedIn && (
          <Button
            variant="primary"
            disabled={saving || saved}
            onClick={handleSaveHistory}
            style={{ padding: '10px 28px' }}
          >
            {saved ? <><Check size={16} /> Tersimpan</> : saving ? <><Loader2 size={16} className="spin" /> Menyimpan...</> : <><Save size={16} /> Simpan ke History</>}
          </Button>
        )}
      </div>

      <StepNav prevLabel="Optimasi Yi" prevPath="/step/4" nextLabel="Kembali ke Beranda" nextPath="/" />
    </div>
  );
}

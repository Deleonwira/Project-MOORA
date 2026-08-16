import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { formatNumber, formatDate } from '../lib/utils';
import { exportToPdf } from '../lib/pdf-export';
import * as api from '../lib/api';
import { DataTable } from '../components/ui/DataTable';
import { Card } from '../components/ui/Card';
import { Modal } from '../components/ui/Modal';
import { Button } from '../components/ui/Button';
import { EmptyState } from '../components/ui/EmptyState';
import { BarChart3, ClipboardList, Trash2, Calendar, Package, Trophy, FileDown, ArrowRight } from 'lucide-react';

export function HistoryPage() {
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [detailModal, setDetailModal] = useState(false);
  const [detailData, setDetailData] = useState(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteId, setDeleteId] = useState(null);

  const fetchHistory = useCallback(async () => {
    setLoading(true);
    setError('');
    const data = await api.getHistory();
    setLoading(false);
    if (data.success) {
      setHistory(data.history || []);
    } else {
      setError(data.message || 'Gagal memuat history.');
    }
  }, []);

  useEffect(() => {
    if (isLoggedIn) {
      const timer = setTimeout(() => {
        fetchHistory();
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [isLoggedIn, fetchHistory]);

  const handleShowDetail = async (id) => {
    setDetailModal(true);
    setDetailLoading(true);
    setDetailData(null);
    const data = await api.getHistoryDetail(id);
    setDetailLoading(false);
    if (data.success && data.calculation) {
      setDetailData(data.calculation);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    const data = await api.deleteHistory(deleteId);
    if (data.success) {
      showToast('History berhasil dihapus.', 'success');
      setDeleteModal(false);
      setDeleteId(null);
      fetchHistory();
    } else {
      showToast(data.message || 'Gagal menghapus.', 'error');
    }
  };

  const handleExportPdf = (detail) => {
    try {
      exportToPdf({
        title: detail.title || 'Perhitungan MOORA',
        ranking: detail.results,
        date: detail.created_at,
        isHistory: true,
      });
      showToast('PDF berhasil diunduh!', 'success');
    } catch {
      showToast('Gagal membuat PDF.', 'error');
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="page">
        <div className="page-header">
          <h1>History Perhitungan</h1>
          <p>Anda harus login untuk melihat history perhitungan.</p>
        </div>
        <EmptyState>
          <p>Silakan login terlebih dahulu.</p>
          <Button variant="primary" onClick={() => navigate('/login')}>Login <ArrowRight size={14} /></Button>
        </EmptyState>
      </div>
    );
  }

  return (
    <div className="page">
      <div className="page-header">
        <h1>History Perhitungan</h1>
        <p>Riwayat perhitungan MOORA yang telah Anda simpan</p>
      </div>

      {loading && (
        <EmptyState><p>Memuat data...</p></EmptyState>
      )}

      {error && (
        <EmptyState><p style={{ color: 'var(--danger)' }}>{error}</p></EmptyState>
      )}

      {!loading && !error && history.length === 0 && (
        <EmptyState>
          <p>Belum ada history perhitungan.</p>
          <p className="text-secondary" style={{ marginTop: '8px' }}>Lakukan perhitungan MOORA dan simpan hasilnya untuk melihat history di sini.</p>
          <Button variant="primary" style={{ marginTop: '16px' }} onClick={() => navigate('/')}>Mulai Perhitungan <ArrowRight size={14} /></Button>
        </EmptyState>
      )}

      {!loading && !error && history.length > 0 && (
        <div className="history-list">
          {history.map((item) => (
            <div key={item.id} className="history-card">
              <div className="history-card-header">
                <div className="history-card-title">
                  <span className="history-icon"><BarChart3 size={18} /></span>
                  <span>{item.title}</span>
                </div>
                <div className="history-actions">
                  <Button size="sm" variant="outline" onClick={() => handleShowDetail(item.id)}><ClipboardList size={14} /> Detail</Button>
                  <Button size="sm" variant="danger" onClick={() => { setDeleteId(item.id); setDeleteModal(true); }}><Trash2 size={14} /></Button>
                </div>
              </div>
              <div className="history-card-body">
                <div className="history-meta">
                  <span className="history-meta-item"><Calendar size={14} /> {formatDate(item.created_at)}</span>
                  <span className="history-meta-item"><Package size={14} /> {item.total_alternatives} alternatif</span>
                </div>
                {item.winner && (
                  <div className="history-winner">
                    <span className="history-winner-label"><Trophy size={14} /> Pemenang:</span>
                    <span className="history-winner-name">{item.winner}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Detail Modal */}
      <Modal
        isOpen={detailModal}
        onClose={() => setDetailModal(false)}
        title={detailData?.title || 'Detail Perhitungan'}
        size="lg"
        footer={
          <div style={{ display: 'flex', gap: 'var(--space-sm)', justifyContent: 'flex-end' }}>
            {detailData && detailData.results && detailData.results.length > 0 && (
              <Button variant="outline" onClick={() => handleExportPdf(detailData)}><FileDown size={14} /> Export PDF</Button>
            )}
            <Button onClick={() => setDetailModal(false)}>Tutup</Button>
          </div>
        }
      >
        {detailLoading && <p>Memuat data...</p>}
        {!detailLoading && detailData && (
          <>
            <div className="history-detail-meta">
              <span><Calendar size={14} /> Tanggal: <strong>{formatDate(detailData.created_at)}</strong></span>
            </div>
            {detailData.results && detailData.results.length > 0 && (
              <>
                <div className="section-title" style={{ marginTop: 'var(--space-md)' }}>Hasil Perankingan</div>
                <DataTable>
                  <thead>
                    <tr><th>Peringkat</th><th>Alternatif</th><th>Benefit Sum</th><th>Cost Sum</th><th>Nilai Yi</th></tr>
                  </thead>
                  <tbody>
                    {detailData.results.map((r, idx) => (
                      <tr key={idx} style={r.rank_position === 1 ? { backgroundColor: 'rgba(59,130,246,0.05)' } : undefined}>
                        <td className="mono" style={{ fontWeight: 600 }}>{r.rank_position}</td>
                        <td>{r.alt_name}</td>
                        <td className="mono">{formatNumber(r.benefit_sum, 4)}</td>
                        <td className="mono">{formatNumber(r.cost_sum, 4)}</td>
                        <td className="mono" style={{ fontWeight: 600 }}>{formatNumber(r.yi_value, 4)}</td>
                      </tr>
                    ))}
                  </tbody>
                </DataTable>
                {detailData.results[0] && (
                  <Card header={<><Trophy size={16} /> Rekomendasi</>} className="recommendation-card" style={{ marginTop: 'var(--space-md)' }}>
                    <p>Berdasarkan perhitungan ini, <strong>{detailData.results[0].alt_name}</strong> merupakan pilihan terbaik dengan nilai Yi sebesar <strong className="mono">{formatNumber(detailData.results[0].yi_value, 4)}</strong>.</p>
                  </Card>
                )}
              </>
            )}
          </>
        )}
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModal}
        onClose={() => { setDeleteModal(false); setDeleteId(null); }}
        title="Konfirmasi Hapus"
        size="sm"
        footer={
          <>
            <Button onClick={() => { setDeleteModal(false); setDeleteId(null); }}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Apakah Anda yakin ingin menghapus history perhitungan ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}

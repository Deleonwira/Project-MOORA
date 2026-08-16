import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDataStore } from '../hooks/useDataStore';
import { useAuth } from '../hooks/useAuth';
import { useToast } from '../hooks/useToast';
import { DataTable } from '../components/ui/DataTable';
import { Badge } from '../components/ui/Badge';
import { Tag } from '../components/ui/Tag';
import { Button } from '../components/ui/Button';
import { Modal } from '../components/ui/Modal';
import { EmptyState } from '../components/ui/EmptyState';
import { PackageOpen, Pencil, Trash2, Loader2, ArrowRight } from 'lucide-react';

const DUMMY_DATA = [
  { name: 'Meber SR 700 (Italia)',              values: [95000000,  3.0, 292400, 950,  3.0, 8, 1, 8, 7, 20] },
  { name: 'Meber SR 900 (Italia)',              values: [185000000, 5.6, 378000, 1000, 5.6, 9, 1, 8, 7, 25] },
  { name: 'Centauro CO 700 (Italia)',           values: [120000000, 3.0, 312800, 1000, 3.0, 9, 1, 8, 7, 20] },
  { name: 'Centauro CO 900 (Italia)',           values: [280000000, 5.5, 484000, 1000, 5.5, 9, 1, 8, 7, 20] },
  { name: 'SCM Formula S 440P (Italia)',        values: [130000000, 3.6, 187000, 1050, 3.6, 9, 2, 8, 8, 20] },
  { name: 'SCM Formula S 640P (Italia)',        values: [230000000, 3.6, 372000, 1050, 3.6, 9, 2, 8, 8, 20] },
  { name: 'Agazzani Rapid 700 (Italia)',        values: [110000000, 3.0, 306000, 900,  3.0, 8, 1, 8, 7, 18] },
  { name: 'Laguna Tools LT18 HD (Eropa/AS)',    values: [185000000, 3.7, 220731, 1200, 3.7, 9, 1, 7, 6, 15] },
  { name: 'Meber SR 900 Super (Italia)',        values: [320000000, 7.5, 462000, 1000, 7.5, 9, 1, 8, 7, 25] },
  { name: 'Centauro CO 800 (Italia)',           values: [200000000, 4.0, 374400, 1000, 4.0, 9, 1, 8, 7, 20] },
];

const MEMBERS = [
  { name: 'Hamza Deleon Wiradarma', npm: '2407412004' },
  { name: 'Nur Nabila Amalia', npm: '2407412015' },
  { name: 'Aurellia Sagita Sandjaya', npm: '2407412027' },
  { name: 'Reynard Radithya Aydin', npm: '2407412008' },
];

export function LandingPage() {
  const { alternatives, criteria, addAlternative, updateAlternative, deleteAlternative, seedDefaults } = useDataStore();
  const { isLoggedIn } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const [modalOpen, setModalOpen] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [seeding, setSeeding] = useState(false);

  // Form state
  const [formName, setFormName] = useState('');
  const [formValues, setFormValues] = useState(Array(10).fill(''));
  const [dummyIdx, setDummyIdx] = useState('');

  const openAdd = () => {
    setEditId(null);
    setFormName('');
    setFormValues(Array(10).fill(''));
    setDummyIdx('');
    setModalOpen(true);
  };

  const openEdit = (alt) => {
    setEditId(alt.id);
    setFormName(alt.name);
    setFormValues(alt.values.map(String));
    setDummyIdx('');
    setModalOpen(true);
  };

  const openDelete = (id) => {
    setDeleteId(id);
    setDeleteModalOpen(true);
  };

  const handleDummyChange = (idx) => {
    setDummyIdx(idx);
    if (idx === '') return;
    const preset = DUMMY_DATA[parseInt(idx, 10)];
    if (!preset) return;
    setFormName(preset.name);
    setFormValues(preset.values.map(String));
  };

  const handleValueChange = (index, value) => {
    setFormValues((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  const handleSave = () => {
    const name = formName.trim();
    if (!name) {
      showToast('Nama alternatif tidak boleh kosong.', 'error');
      return;
    }
    const values = [];
    for (let i = 0; i < 10; i++) {
      const val = parseFloat(formValues[i]);
      if (isNaN(val) || val <= 0) {
        showToast(`Nilai ${criteria[i].code} (${criteria[i].name}) harus berupa angka positif.`, 'error');
        return;
      }
      values.push(val);
    }

    if (editId) {
      updateAlternative(editId, name, values);
      showToast('Alternatif berhasil diperbarui.', 'success');
    } else {
      addAlternative(name, values);
      showToast('Alternatif berhasil ditambahkan.', 'success');
    }
    setModalOpen(false);
  };

  const handleSeedDefaults = async () => {
    setSeeding(true);
    const res = await seedDefaults();
    setSeeding(false);
    if (res.success) {
      showToast(res.message || '10 alternatif default berhasil dimuat dari database!', 'success');
    } else {
      showToast(res.message || 'Gagal memuat data default.', 'error');
    }
  };

  const handleDelete = () => {
    if (deleteId) {
      deleteAlternative(deleteId);
      showToast('Alternatif berhasil dihapus.', 'success');
    }
    setDeleteModalOpen(false);
    setDeleteId(null);
  };

  const altCount = alternatives.length;

  return (
    <div className="page">
      {/* Hero */}
      <div className="hero">
        <h1 className="hero-title">Sistem Pendukung Keputusan</h1>
        <p className="hero-subtitle">Pemilihan Mesin Industri Terbaik dengan Metode MOORA</p>
        <p className="hero-meta">Multi-Objective Optimization on the basis of Ratio Analysis</p>
      </div>

      {/* Team */}
      <div className="section-title">Anggota Kelompok</div>
      <div className="section-subtitle">Tim pengembang sistem pendukung keputusan</div>
      <div className="team-grid">
        {MEMBERS.map((m) => (
          <div key={m.npm} className="team-card">
            <div className="team-card-name">{m.name}</div>
            <div className="team-card-npm">{m.npm}</div>
          </div>
        ))}
      </div>

      <div className="divider" />

      {/* Criteria */}
      <div className="criteria-section">
        <div className="section-title">Kriteria Penilaian</div>
        <div className="section-subtitle">10 kriteria yang digunakan dalam evaluasi mesin industri</div>
        <DataTable>
          <thead>
            <tr>
              <th>No</th><th>Kode</th><th>Kriteria</th><th>Tipe</th><th>Bobot</th><th>Satuan</th>
            </tr>
          </thead>
          <tbody>
            {criteria.map((cr, i) => (
              <tr key={cr.code}>
                <td>{i + 1}</td>
                <td><Tag>{cr.code}</Tag></td>
                <td>{cr.name}</td>
                <td><Badge type={cr.type}>{cr.type === 'benefit' ? 'Benefit' : 'Cost'}</Badge></td>
                <td className="mono">{cr.weight.toFixed(2)}</td>
                <td className="text-muted">{cr.unit}</td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr>
              <td colSpan="4" style={{ textAlign: 'right', fontWeight: 500 }}>Total Bobot</td>
              <td className="mono" style={{ fontWeight: 600 }}>1.00</td>
              <td></td>
            </tr>
          </tfoot>
        </DataTable>
      </div>

      <div className="divider" />

      {/* Alternatives CRUD */}
      <div className="crud-section">
        <div className="section-title">Data Alternatif</div>
        <div className="section-subtitle">Kelola data mesin yang akan dievaluasi</div>
        <div className="crud-toolbar">
          <span className="count-text">
            {altCount === 0 ? '0 alternatif — Belum ada data' : `${altCount} alternatif terdaftar`}
          </span>
          <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
            {isLoggedIn && altCount === 0 && (
              <Button variant="outline" onClick={handleSeedDefaults} disabled={seeding}>
                {seeding ? <><Loader2 size={16} className="spin" /> Memuat...</> : <><PackageOpen size={16} /> Load Data Default (10 Mesin)</>}
              </Button>
            )}
            <Button variant="primary" onClick={openAdd}>+ Tambah Alternatif</Button>
          </div>
        </div>

        {altCount === 0 ? (
          <EmptyState>
            <p>Belum ada data alternatif. Klik &quot;Tambah Alternatif&quot; untuk memulai.</p>
          </EmptyState>
        ) : (
          <DataTable>
            <thead>
              <tr>
                <th>No</th><th>Nama</th>
                {criteria.map((cr) => (
                  <th key={cr.code} className={cr.type === 'cost' ? 'highlight-cost' : 'highlight-benefit'}>{cr.code}</th>
                ))}
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {alternatives.map((alt, i) => (
                <tr key={alt.id}>
                  <td>{i + 1}</td>
                  <td>{alt.name}</td>
                  {alt.values.map((v, j) => (
                    <td key={j} className={`mono ${criteria[j].type === 'cost' ? 'highlight-cost' : 'highlight-benefit'}`}>{v}</td>
                  ))}
                  <td>
                    <div className="action-cell">
                      <Button size="sm" variant="outline" onClick={() => openEdit(alt)} title="Edit"><Pencil size={14} /></Button>
                      <Button size="sm" variant="danger" onClick={() => openDelete(alt.id)} title="Hapus"><Trash2 size={14} /></Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </DataTable>
        )}
      </div>

      <div className="divider" />

      {/* CTA */}
      <div className="cta-section">
        {altCount >= 2 ? (
          <Button variant="primary" onClick={() => navigate('/step/1')} style={{ padding: '12px 32px', fontSize: 'var(--text-base)' }}>
            Mulai Perhitungan <ArrowRight size={16} />
          </Button>
        ) : (
          <p className="cta-message">Tambahkan minimal 2 alternatif untuk memulai perhitungan.</p>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editId ? 'Edit Alternatif' : 'Tambah Alternatif'}
        footer={
          <>
            <Button onClick={() => setModalOpen(false)}>Batal</Button>
            <Button variant="primary" onClick={handleSave}>Simpan</Button>
          </>
        }
      >
        {!editId && (
          <div className="input-group">
            <label htmlFor="dummy-select">Pilih Data Contoh (Opsional)</label>
            <select
              id="dummy-select"
              value={dummyIdx}
              onChange={(e) => handleDummyChange(e.target.value)}
              style={{
                display: 'block', width: '100%', padding: '8px 12px',
                backgroundColor: 'var(--bg-surface-2)', border: '1px solid var(--border)',
                borderRadius: 'var(--radius-sm)', color: 'var(--text-primary)',
                fontFamily: 'var(--font-primary)', fontSize: 'var(--text-sm)',
              }}
            >
              <option value="">— Isi manual —</option>
              {DUMMY_DATA.map((d, i) => (
                <option key={i} value={i}>{d.name} (C1:{d.values[0]}, C2:{d.values[1]}, ...)</option>
              ))}
            </select>
          </div>
        )}
        <div className="input-group">
          <label htmlFor="alt-name">Nama Alternatif</label>
          <input
            type="text"
            id="alt-name"
            placeholder="Contoh: Mesin CNC-A1"
            value={formName}
            onChange={(e) => setFormName(e.target.value)}
          />
        </div>
        <div className="input-grid">
          {criteria.map((cr, i) => (
            <div key={cr.code} className="input-group">
              <label htmlFor={`alt-c${i + 1}`}>{cr.code} — {cr.name} ({cr.unit})</label>
              <input
                type="number"
                id={`alt-c${i + 1}`}
                placeholder="0"
                min="0"
                step="any"
                value={formValues[i]}
                onChange={(e) => handleValueChange(i, e.target.value)}
              />
            </div>
          ))}
        </div>
      </Modal>

      {/* Delete Modal */}
      <Modal
        isOpen={deleteModalOpen}
        onClose={() => { setDeleteModalOpen(false); setDeleteId(null); }}
        title="Konfirmasi Hapus"
        size="sm"
        footer={
          <>
            <Button onClick={() => { setDeleteModalOpen(false); setDeleteId(null); }}>Batal</Button>
            <Button variant="danger" onClick={handleDelete}>Hapus</Button>
          </>
        }
      >
        <p style={{ color: 'var(--text-secondary)' }}>
          Apakah Anda yakin ingin menghapus alternatif ini? Tindakan ini tidak dapat dibatalkan.
        </p>
      </Modal>
    </div>
  );
}

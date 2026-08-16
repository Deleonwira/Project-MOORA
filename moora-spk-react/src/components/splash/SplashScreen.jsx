import { useState, useEffect, useCallback } from 'react';
import { Settings, Factory, BarChart3, ClipboardList, Target, Ruler, Calculator, X, ChevronLeft, ChevronRight } from 'lucide-react';

const TOTAL_SLIDES = 3;

export function SplashScreen({ onComplete }) {
  const [current, setCurrent] = useState(0);
  const [exitSlide, setExitSlide] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [closing, setClosing] = useState(false);

  const closeSplash = useCallback(() => {
    setClosing(true);
    setTimeout(() => {
      try { sessionStorage.setItem('moora_splash_seen', '1'); } catch { /* ignore storage errors */ }
      onComplete();
    }, 600);
  }, [onComplete]);

  const goToSlide = useCallback((index) => {
    if (isAnimating || index < 0 || index >= TOTAL_SLIDES || index === current) return;
    setIsAnimating(true);
    setExitSlide(current);

    setTimeout(() => {
      setExitSlide(null);
      setCurrent(index);
      setIsAnimating(false);
    }, 400);
  }, [current, isAnimating]);

  useEffect(() => {
    const handleKeydown = (e) => {
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        if (current === TOTAL_SLIDES - 1) closeSplash();
        else goToSlide(current + 1);
      } else if (e.key === 'ArrowLeft') {
        goToSlide(current - 1);
      } else if (e.key === 'Escape') {
        closeSplash();
      }
    };
    document.addEventListener('keydown', handleKeydown);
    return () => document.removeEventListener('keydown', handleKeydown);
  }, [current, closeSplash, goToSlide]);

  const handleNext = () => {
    if (current === TOTAL_SLIDES - 1) closeSplash();
    else goToSlide(current + 1);
  };

  const handlePrev = () => goToSlide(current - 1);

  return (
    <div className={`splash-overlay${closing ? ' closing' : ''}`} id="splash-screen">
      <div className="splash-bg-grid" />
      <div className="splash-particles">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="splash-particle" />
        ))}
      </div>
      <div className="splash-orbit" />
      <div className="splash-orbit splash-orbit-2" />

      <button className="splash-btn-skip" onClick={closeSplash}>Lewati <X size={14} /></button>

      <div className="splash-content">
        {/* Slide 0: Welcome */}
        <div className={`splash-slide${current === 0 ? ' active' : ''}${exitSlide === 0 ? ' exit' : ''}`}>
          <div className="splash-icon"><Settings size={48} /></div>
          <h1 className="splash-title">Sistem Pendukung <span className="accent">Keputusan</span></h1>
          <p className="splash-subtitle">
            Aplikasi ini dirancang untuk membantu pengambilan keputusan dalam <strong>pemilihan mesin industri terbaik</strong> secara objektif dan terstruktur menggunakan metode analisis multi-kriteria.
          </p>
          <div className="splash-info-grid">
            <div className="splash-info-card"><span className="splash-info-icon"><Factory size={20} /></span><div className="splash-info-label">Tujuan</div><div className="splash-info-value">Pemilihan Mesin Industri</div></div>
            <div className="splash-info-card"><span className="splash-info-icon"><BarChart3 size={20} /></span><div className="splash-info-label">Metode</div><div className="splash-info-value">MOORA Ratio System</div></div>
            <div className="splash-info-card"><span className="splash-info-icon"><ClipboardList size={20} /></span><div className="splash-info-label">Kriteria</div><div className="splash-info-value">10 Kriteria Evaluasi</div></div>
            <div className="splash-info-card"><span className="splash-info-icon"><Target size={20} /></span><div className="splash-info-label">Output</div><div className="splash-info-value">Ranking &amp; Rekomendasi</div></div>
          </div>
        </div>

        {/* Slide 1: What is MOORA */}
        <div className={`splash-slide${current === 1 ? ' active' : ''}${exitSlide === 1 ? ' exit' : ''}`}>
          <div className="splash-icon"><Ruler size={48} /></div>
          <h1 className="splash-title">Metode <span className="accent">MOORA</span></h1>
          <p className="splash-subtitle">
            MOORA (<em>Multi-Objective Optimization on the basis of Ratio Analysis</em>) adalah metode pengambilan keputusan multi-kriteria yang mengoptimalkan dua atau lebih atribut yang saling bertentangan secara bersamaan.
          </p>
          <div className="splash-formula">
            <div className="splash-formula-label">Konsep Inti</div>
            <div className="splash-formula-content">
              y<sub>i</sub> = Σ (Benefit) − Σ (Cost)
            </div>
          </div>
          <div className="splash-info-grid" style={{ marginTop: 'var(--space-md)' }}>
            <div className="splash-info-card">
              <span className="splash-tag splash-tag-benefit">BENEFIT</span>
              <div className="splash-info-value" style={{ marginTop: '8px' }}>Maximize</div>
              <div className="splash-info-label">Semakin tinggi → semakin baik</div>
            </div>
            <div className="splash-info-card">
              <span className="splash-tag splash-tag-cost">COST</span>
              <div className="splash-info-value" style={{ marginTop: '8px' }}>Minimize</div>
              <div className="splash-info-label">Semakin rendah → semakin baik</div>
            </div>
          </div>
        </div>

        {/* Slide 2: Steps */}
        <div className={`splash-slide${current === 2 ? ' active' : ''}${exitSlide === 2 ? ' exit' : ''}`}>
          <div className="splash-icon"><Calculator size={48} /></div>
          <h1 className="splash-title">Langkah <span className="accent">Perhitungan</span></h1>
          <p className="splash-subtitle">Metode MOORA menghitung perankingan melalui 5 tahapan sistematis:</p>
          <div className="splash-steps">
            {[
              { title: 'Matriks Keputusan', desc: 'Input data alternatif dan nilai setiap kriteria' },
              { title: 'Normalisasi Matriks', desc: <span>x*<sub>ij</sub> = x<sub>ij</sub> / √(Σ x<sub>ij</sub>²) — menyamakan skala</span> },
              { title: 'Matriks Terbobot', desc: <span>y<sub>ij</sub> = x*<sub>ij</sub> × w<sub>j</sub> — mengalikan bobot kepentingan</span> },
              { title: 'Optimasi Nilai Yi', desc: <span>y<sub>i</sub> = Σ(benefit) − Σ(cost) — selisih benefit dan cost</span> },
              { title: 'Perankingan Akhir', desc: 'Urutkan Yi tertinggi → alternatif terbaik' },
            ].map((step, idx) => (
              <div key={idx} className="splash-step-item">
                <div className="splash-step-num">{idx + 1}</div>
                <div className="splash-step-text">
                  <div className="splash-step-title">{step.title}</div>
                  <div className="splash-step-desc">{step.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Controls */}
      <div className="splash-controls">
        <div className="splash-dots">
          {Array.from({ length: TOTAL_SLIDES }).map((_, i) => (
            <button
              key={i}
              className={`splash-dot${i === current ? ' active' : ''}`}
              onClick={() => goToSlide(i)}
            />
          ))}
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-sm)' }}>
          {current > 0 && (
            <button className="splash-btn" onClick={handlePrev}><ChevronLeft size={16} /> Kembali</button>
          )}
          <button className="splash-btn splash-btn-primary" onClick={handleNext}>
            {current === TOTAL_SLIDES - 1 ? <>Mulai Aplikasi <ChevronRight size={16} /></> : <>Lanjut <ChevronRight size={16} /></>}
          </button>
        </div>
      </div>
    </div>
  );
}

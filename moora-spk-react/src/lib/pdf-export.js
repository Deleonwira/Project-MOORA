/**
 * MOORA DSS — PDF Export Utility
 * Generates a professional PDF report of MOORA ranking results
 */

import jsPDF from 'jspdf';
import { applyPlugin } from 'jspdf-autotable';

// Manually register autoTable plugin on jsPDF (required for v5 in ESM/bundler environments)
applyPlugin(jsPDF);

/**
 * Format a number to fixed decimals, or return '—' for invalid values.
 */
function fmt(num, decimals = 4) {
  if (num === null || num === undefined || isNaN(num)) return '—';
  return Number(num).toFixed(decimals);
}

/**
 * Get a readable rank label.
 */
function getRankLabel(rank) {
  switch (rank) {
    case 1: return 'Rekomendasi Utama';
    case 2: return 'Alternatif Kedua';
    case 3: return 'Alternatif Ketiga';
    default: return `Peringkat ${rank}`;
  }
}

/**
 * Format a date string to dd/mm/yyyy HH:mm
 */
function formatDateForPdf(dateStr) {
  if (!dateStr) {
    const d = new Date();
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} ${hours}:${minutes}`;
  }
  const d = new Date(dateStr);
  const day = String(d.getDate()).padStart(2, '0');
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const year = d.getFullYear();
  const hours = String(d.getHours()).padStart(2, '0');
  const minutes = String(d.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
}

/**
 * Export ranking results to a PDF file.
 *
 * @param {Object} options
 * @param {string} options.title - Title of the calculation
 * @param {Array}  options.ranking - Array of { rank, name, yi } or { rank_position, alt_name, yi_value, benefit_sum, cost_sum }
 * @param {string} [options.date] - Optional date string
 * @param {boolean} [options.isHistory] - If true, uses history field names
 */
export function exportToPdf({ title, ranking, date, isHistory = false }) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // ── Colors ──
  const primaryColor = [59, 130, 246];   // #3b82f6
  const darkBg = [9, 9, 11];             // #09090b
  const surfaceBg = [24, 24, 27];        // #18181b
  const textPrimary = [250, 250, 250];   // #fafafa
  const textSecondary = [161, 161, 170]; // #a1a1aa
  const successColor = [34, 197, 94];    // #22c55e

  // ── Background ──
  doc.setFillColor(...darkBg);
  doc.rect(0, 0, pageWidth, doc.internal.pageSize.getHeight(), 'F');

  // ── Header Bar ──
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, 40, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFontSize(20);
  doc.setFont('helvetica', 'bold');
  doc.text('MOORA SPK', 14, 18);

  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.text('Sistem Pendukung Keputusan — Multi-Objective Optimization by Ratio Analysis', 14, 28);

  // ── Title Section ──
  let y = 52;

  doc.setTextColor(...textPrimary);
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text(title || 'Hasil Perankingan MOORA', 14, y);
  y += 8;

  doc.setTextColor(...textSecondary);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.text(`Tanggal: ${formatDateForPdf(date)}`, 14, y);
  y += 4;
  doc.text(`Jumlah Alternatif: ${ranking.length}`, 14, y);
  y += 10;

  // ── Divider ──
  doc.setDrawColor(...primaryColor);
  doc.setLineWidth(0.5);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  // ── Ranking Table ──
  doc.setTextColor(...textPrimary);
  doc.setFontSize(13);
  doc.setFont('helvetica', 'bold');
  doc.text('Tabel Perankingan', 14, y);
  y += 8;

  // Prepare table data based on source
  const tableHead = isHistory
    ? [['Peringkat', 'Alternatif', 'Benefit Sum', 'Cost Sum', 'Nilai Yi', 'Keterangan']]
    : [['Peringkat', 'Alternatif', 'Nilai Yi', 'Keterangan']];

  const tableBody = ranking.map((item) => {
    const rank = isHistory ? item.rank_position : item.rank;
    const name = isHistory ? item.alt_name : item.name;
    const yi = isHistory ? item.yi_value : item.yi;

    if (isHistory) {
      return [
        String(rank),
        name,
        fmt(item.benefit_sum, 4),
        fmt(item.cost_sum, 4),
        fmt(yi, 4),
        getRankLabel(rank),
      ];
    }
    return [
      String(rank),
      name,
      fmt(yi, 4),
      getRankLabel(rank),
    ];
  });

  doc.autoTable({
    startY: y,
    head: tableHead,
    body: tableBody,
    theme: 'grid',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontStyle: 'bold',
      fontSize: 10,
      halign: 'center',
    },
    bodyStyles: {
      fillColor: surfaceBg,
      textColor: textPrimary,
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [30, 30, 35],
    },
    columnStyles: isHistory
      ? {
          0: { halign: 'center', fontStyle: 'bold', cellWidth: 22 },
          1: { cellWidth: 40 },
          2: { halign: 'center', font: 'courier' },
          3: { halign: 'center', font: 'courier' },
          4: { halign: 'center', font: 'courier', fontStyle: 'bold' },
          5: { halign: 'center' },
        }
      : {
          0: { halign: 'center', fontStyle: 'bold', cellWidth: 25 },
          1: { cellWidth: 55 },
          2: { halign: 'center', font: 'courier', fontStyle: 'bold' },
          3: { halign: 'center' },
        },
    styles: {
      lineColor: [63, 63, 70],
      lineWidth: 0.3,
    },
    // Highlight rank 1 row
    didParseCell: function (data) {
      if (data.section === 'body' && data.row.index === 0) {
        data.cell.styles.fillColor = [20, 40, 80];
        data.cell.styles.textColor = [255, 255, 255];
        data.cell.styles.fontStyle = 'bold';
      }
    },
    margin: { left: 14, right: 14 },
  });

  // ── Recommendation Box ──
  const finalY = doc.lastAutoTable.finalY + 12;

  if (ranking.length > 0) {
    const winner = isHistory ? ranking[0] : ranking[0];
    const winnerName = isHistory ? winner.alt_name : winner.name;
    const winnerYi = isHistory ? winner.yi_value : winner.yi;

    // Box background
    doc.setFillColor(20, 50, 30);
    doc.roundedRect(14, finalY, pageWidth - 28, 36, 3, 3, 'F');

    // Box border
    doc.setDrawColor(...successColor);
    doc.setLineWidth(0.4);
    doc.roundedRect(14, finalY, pageWidth - 28, 36, 3, 3, 'S');

    // Trophy + Title
    doc.setTextColor(...successColor);
    doc.setFontSize(11);
    doc.setFont('helvetica', 'bold');
    doc.text('Rekomendasi', 20, finalY + 10);

    // Description
    doc.setTextColor(...textPrimary);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    const recoText = `Berdasarkan analisis menggunakan metode MOORA, ${winnerName} merupakan pilihan terbaik dengan nilai optimasi Yi sebesar ${fmt(winnerYi, 4)}.`;

    const splitText = doc.splitTextToSize(recoText, pageWidth - 48);
    doc.text(splitText, 20, finalY + 18);
  }

  // ── Footer ──
  const footerY = doc.internal.pageSize.getHeight() - 10;
  doc.setTextColor(...textSecondary);
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.text('Dibuat oleh MOORA SPK — Sistem Pendukung Keputusan', 14, footerY);
  doc.text(`Dicetak: ${formatDateForPdf()}`, pageWidth - 14, footerY, { align: 'right' });

  // ── Save ──
  const safeTitle = (title || 'Hasil-MOORA')
    .replace(/[^a-zA-Z0-9\s]/g, '')
    .replace(/\s+/g, '-')
    .substring(0, 40);
  doc.save(`${safeTitle}_${Date.now()}.pdf`);
}

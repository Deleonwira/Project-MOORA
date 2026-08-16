export function FormulaBox({ label, formula, explanation }) {
  return (
    <div className="formula-box">
      <span className="formula-label">{label}</span>
      <div
        className="formula-content"
        dangerouslySetInnerHTML={{ __html: formula }}
      />
      {explanation && (
        <div className="formula-explanation">{explanation}</div>
      )}
    </div>
  );
}

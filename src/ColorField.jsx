import { normalizeHex } from './colors';

export default function ColorField({ id, label, value, onChange }) {
  const normalized = normalizeHex(value);
  return <div className="color-field">
    <label htmlFor={`${id}-hex`}>{label}</label>
    <div className="color-inputs">
      <input className="color-picker" type="color" value={normalized || '#ffffff'} onChange={(event) => onChange(event.target.value)} aria-label={`Выбрать ${label.toLowerCase()}`} />
      <input id={`${id}-hex`} className="hex-input" value={value} onChange={(event) => onChange(event.target.value)} maxLength="8" spellCheck="false" autoComplete="off" aria-invalid={!normalized} aria-describedby={`${id}-help`} />
    </div>
    <p id={`${id}-help`} className={!normalized ? 'field-help error' : 'field-help'}>{normalized ? 'HEX из 3 или 6 символов, например #fff' : 'Введи цвет в формате #fff или #ffffff.'}</p>
  </div>;
}

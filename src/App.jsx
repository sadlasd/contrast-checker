import { useState } from 'react';
import ColorField from './ColorField';
import { EXAMPLES, contrastChecks, contrastRatio, normalizeHex } from './colors';

export default function App() {
  const [textColor, setTextColor] = useState('#26314d');
  const [backgroundColor, setBackgroundColor] = useState('#ffffff');
  const [fontSize, setFontSize] = useState(18);
  const [message, setMessage] = useState('');
  const text = normalizeHex(textColor);
  const background = normalizeHex(backgroundColor);
  const valid = Boolean(text && background);
  const ratio = valid ? contrastRatio(text, background) : null;
  const checks = valid ? contrastChecks(ratio) : [];
  const css = valid ? `.card {\n  color: ${text};\n  background-color: ${background};\n}` : 'Введи два корректных HEX-цвета.';

  function changeColor(setter, value) {
    setter(value);
    setMessage('');
  }

  function swapColors() {
    setTextColor(backgroundColor);
    setBackgroundColor(textColor);
    setMessage('Цвета поменялись местами.');
  }

  function selectExample(example) {
    setTextColor(example.text);
    setBackgroundColor(example.background);
    setMessage('');
  }

  async function copyCss() {
    if (!valid) return;
    try {
      await navigator.clipboard.writeText(css);
      setMessage('CSS скопирован.');
    } catch { setMessage('Копирование недоступно. Выдели код и скопируй его вручную.'); }
  }

  return <div className="app">
    <header><a href="#main" className="brand"><img src="/favicon.svg" alt="" width="32" height="32" />Читается?</a><span>Проверка контраста цветов</span></header>
    <main id="main">
      <div className="heading"><h1>Хорошо ли видно текст?</h1><p>Подбери цвет текста и фона. Посмотри, как они работают вместе.</p></div>
      <div className="workspace">
        <section className="colors-panel" aria-labelledby="colors-title"><h2 id="colors-title">Твоя пара цветов</h2>
          <ColorField id="text" label="Цвет текста" value={textColor} onChange={(value) => changeColor(setTextColor, value)} />
          <ColorField id="background" label="Цвет фона" value={backgroundColor} onChange={(value) => changeColor(setBackgroundColor, value)} />
          <button className="swap" onClick={swapColors} type="button">Поменять местами</button>
        </section>
        <section className="result-panel" aria-labelledby="result-title"><h2 id="result-title">Контраст</h2>
          <div className="ratio"><strong>{valid ? ratio.toFixed(2) : '—'}</strong><span>{valid ? ': 1' : ''}</span></div>
          <p className="verdict">{!valid ? 'Для расчёта нужны два корректных цвета.' : ratio >= 4.5 ? 'Подходит для обычного текста по AA.' : ratio >= 3 ? 'Подходит только для крупного текста по AA.' : 'Контраст слишком слабый для текста по AA.'}</p>
          {valid && <ul className="check-list">{checks.map((check) => <li key={`${check.title}-${check.level}`}><span>{check.title} <small>{check.level} · от {check.required}:1</small></span><strong className={check.passed ? 'pass' : 'fail'}>{check.passed ? 'Проходит' : 'Не проходит'}</strong></li>)}</ul>}
          <p className="result-note">Крупный текст — от 24 px, либо от 18,67 px при жирном начертании. Результат рассчитан без округления.</p>
        </section>
      </div>
      <section className="preview-section" aria-labelledby="preview-title"><div className="section-heading"><h2 id="preview-title">Посмотри на примере</h2><label htmlFor="font-size">Размер текста: {fontSize} px<input id="font-size" type="range" min="14" max="32" value={fontSize} onChange={(event) => setFontSize(Number(event.target.value))} /></label></div>
        {valid ? <div className="preview" style={{ color: text, backgroundColor: background }}><span className="letters" aria-hidden="true">Aa</span><div><h3>Небольшая карточка</h3><p style={{ fontSize }}>Здесь может быть описание проекта, заметка или важная информация. Даже красивую пару цветов стоит проверить на читаемость.</p><span className="preview-link">Пример подчёркнутого текста</span></div></div> : <div className="invalid-preview">Исправь HEX-цвета, чтобы увидеть пример.</div>}
      </section>
      <section className="examples" aria-labelledby="examples-title"><h2 id="examples-title">Пары для сравнения</h2><div>{EXAMPLES.map((example) => <button type="button" key={example.name} onClick={() => selectExample(example)} aria-pressed={text === example.text && background === example.background}><span className="mini-swatch" style={{ color: example.text, backgroundColor: example.background }} aria-hidden="true">Aa</span>{example.name}</button>)}</div></section>
      <section className="css-panel" aria-labelledby="css-title"><div className="section-heading"><h2 id="css-title">CSS для этой пары</h2><button type="button" onClick={copyCss} disabled={!valid}>Скопировать CSS</button></div><pre><code>{css}</code></pre><p role="status">{message || '\u00a0'}</p></section>
      <details><summary>Как считается контраст</summary><p>Цвета переводятся в относительную яркость. Контраст — это отношение яркости более светлого цвета к более тёмному с поправкой 0,05. Получается число от 1 до 21.</p><p>AA и AAA — уровни требований к контрасту текста в WCAG. Инструмент проверяет только сплошные непрозрачные цвета, а не доступность всей страницы.</p><a href="https://www.w3.org/WAI/WCAG21/Understanding/contrast-minimum.html" target="_blank" rel="noreferrer">Подробнее о контрасте в WCAG</a></details>
    </main>
    <footer>Читается? · маленький помощник для вёрстки</footer>
  </div>;
}

import { useState, useRef, useEffect, useCallback } from "react";

/* ============================================================
   Probe — DOM inspect overlay for React.

   Wrap any subtree: <Probe>{children}</Probe>
   Hover to measure, click to pin and read specs.
   Toggle: button (bottom-left) or Cmd/Ctrl+Shift+D.
   Dismiss: Esc.
   ============================================================ */

const mono = "ui-monospace, 'Cascadia Code', 'Source Code Pro', Menlo, Consolas, 'DejaVu Sans Mono', monospace";

// ---- helpers ---------------------------------------------------------------

const px = (v) => Math.round(parseFloat(v) || 0);

function rgbToHex(color) {
  if (!color || color === "transparent") return null;
  const m = color.match(/[\d.]+/g);
  if (!m) return color;
  const [r, g, b, a] = m.map(Number);
  if (a !== undefined && a < 1) {
    if (a === 0) return null;
    return `rgba(${r}, ${g}, ${b}, ${a})`;
  }
  const hex = (n) => n.toString(16).padStart(2, "0");
  return `#${hex(r)}${hex(g)}${hex(b)}`.toUpperCase();
}

function labelFor(el) {
  const tag = el.tagName.toLowerCase();
  const id = el.id ? `#${el.id}` : "";
  const cls =
    typeof el.className === "string" && el.className.trim()
      ? "." + el.className.trim().split(/\s+/).slice(0, 2).join(".")
      : "";
  return `${tag}${id}${cls}`;
}

function readSpecs(el) {
  const cs = getComputedStyle(el);
  const r = el.getBoundingClientRect();
  return {
    label: labelFor(el),
    width: r.width,
    height: r.height,
    x: r.x,
    y: r.y,
    radius: cs.borderRadius,
    padding: [cs.paddingTop, cs.paddingRight, cs.paddingBottom, cs.paddingLeft].map(px),
    margin: [cs.marginTop, cs.marginRight, cs.marginBottom, cs.marginLeft].map(px),
    bg: rgbToHex(cs.backgroundColor),
    color: rgbToHex(cs.color),
    border:
      px(cs.borderTopWidth) > 0
        ? `${px(cs.borderTopWidth)}px ${cs.borderTopStyle} ${rgbToHex(cs.borderTopColor)}`
        : null,
    font: cs.fontFamily.split(",")[0].replace(/['"]/g, ""),
    fontSize: px(cs.fontSize),
    fontWeight: cs.fontWeight,
    lineHeight: cs.lineHeight === "normal" ? "normal" : px(cs.lineHeight),
    letterSpacing: cs.letterSpacing === "normal" ? "0" : cs.letterSpacing,
    display: cs.display,
    opacity: cs.opacity,
    gap: cs.gap === "normal" ? null : cs.gap,
  };
}

function specsToCSS(s) {
  const lines = [];
  lines.push(`width: ${Math.round(s.width)}px;`);
  lines.push(`height: ${Math.round(s.height)}px;`);
  if (s.display !== "inline") lines.push(`display: ${s.display};`);
  if (s.gap) lines.push(`gap: ${s.gap};`);
  if (s.padding.some(Boolean)) lines.push(`padding: ${s.padding.join("px ")}px;`);
  if (s.radius !== "0px") lines.push(`border-radius: ${s.radius};`);
  if (s.border) lines.push(`border: ${s.border};`);
  if (s.bg) lines.push(`background: ${s.bg};`);
  if (s.color) lines.push(`color: ${s.color};`);
  lines.push(`font-family: ${s.font};`);
  lines.push(`font-size: ${s.fontSize}px;`);
  lines.push(`font-weight: ${s.fontWeight};`);
  if (s.lineHeight !== "normal") lines.push(`line-height: ${s.lineHeight}px;`);
  return lines.join("\n");
}

function dotPad(key, val, width = 30) {
  const dots = Math.max(2, width - key.length - String(val).length);
  return `${key} ${'.'.repeat(dots)} ${val}`;
}

// ---- receipt-style UI atoms ------------------------------------------------

function ReceiptDivider() {
  return (
    <div style={{
      fontFamily: mono, fontSize: 10, color: '#404040',
      letterSpacing: '0.15em', lineHeight: 1,
      margin: '6px 0', userSelect: 'none',
    }}>
      {'- '.repeat(19)}
    </div>
  );
}

function ReceiptRow({ k, v }) {
  return (
    <div style={{
      fontFamily: mono, fontSize: 11, color: '#c0c0c0',
      lineHeight: 1.7, whiteSpace: 'pre',
      fontVariantNumeric: 'tabular-nums',
    }}>
      {dotPad(k, v)}
    </div>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontFamily: mono, fontSize: 9,
      letterSpacing: '0.18em', textTransform: 'uppercase',
      color: '#606060', marginTop: 10, marginBottom: 2,
    }}>
      {children}
    </div>
  );
}

function SwatchInline({ value }) {
  if (!value) return 'none';
  return value;
}

function CopyBtn({ value }) {
  const [done, setDone] = useState(false);
  return (
    <button
      data-probe-ui
      onClick={async () => {
        try { await navigator.clipboard.writeText(value); } catch {}
        setDone(true);
        setTimeout(() => setDone(false), 1100);
      }}
      style={{
        all: 'unset', cursor: 'pointer', fontFamily: mono,
        fontSize: 9, letterSpacing: '0.12em', textTransform: 'uppercase',
        color: done ? '#e5e5e5' : '#606060',
        border: `1px solid ${done ? '#e5e5e5' : '#333'}`,
        padding: '2px 8px',
        transition: 'all 0.15s',
      }}
      onMouseEnter={e => { e.currentTarget.style.color = '#e5e5e5'; e.currentTarget.style.borderColor = '#e5e5e5' }}
      onMouseLeave={e => { if (!done) { e.currentTarget.style.color = '#606060'; e.currentTarget.style.borderColor = '#333' } }}
    >
      {done ? "COPIED" : "COPY"}
    </button>
  );
}

// ---- Probe component -------------------------------------------------------

export function Probe({ children }) {
  const [active, setActive] = useState(false);
  const [hover, setHover] = useState(null);
  const [pinned, setPinned] = useState(null);
  const containerRef = useRef(null);

  const insideContainer = (el) =>
    el && containerRef.current && containerRef.current.contains(el) && !el.closest("[data-probe-ui]");

  const handleMove = useCallback((e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!insideContainer(el)) { setHover(null); return; }
    const r = el.getBoundingClientRect();
    setHover({
      rect: { top: r.top, left: r.left, width: r.width, height: r.height },
      label: labelFor(el),
    });
  }, []);

  const handleClick = useCallback((e) => {
    const el = document.elementFromPoint(e.clientX, e.clientY);
    if (!insideContainer(el)) return;
    e.preventDefault();
    e.stopPropagation();
    setPinned(readSpecs(el));
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.shiftKey && e.key.toLowerCase() === "d") {
        e.preventDefault();
        setActive((a) => !a);
      }
      if (e.key === "Escape") { setPinned(null); setActive(false); setHover(null); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (!active) { setHover(null); return; }
    window.addEventListener("pointermove", handleMove, true);
    window.addEventListener("click", handleClick, true);
    return () => {
      window.removeEventListener("pointermove", handleMove, true);
      window.removeEventListener("click", handleClick, true);
    };
  }, [active, handleMove, handleClick]);

  return (
    <div style={{ position: 'relative' }}>
      <div ref={containerRef} style={{ cursor: active ? 'crosshair' : 'default' }}>
        {children}
      </div>

      {/* hover highlight */}
      {active && hover && (
        <div style={{ pointerEvents: 'none', position: 'fixed', inset: 0, zIndex: 9998, fontFamily: mono }}>
          <div style={{
            position: 'absolute',
            top: hover.rect.top, left: hover.rect.left,
            width: hover.rect.width, height: hover.rect.height,
            border: '1px solid rgba(255,255,255,0.5)',
            background: 'rgba(255,255,255,0.03)',
          }} />

          <div style={{
            position: 'absolute', whiteSpace: 'nowrap',
            top: hover.rect.top + hover.rect.height + 4,
            left: hover.rect.left,
            fontSize: 10, letterSpacing: '0.06em',
            color: '#a0a0a0',
          }}>
            {Math.round(hover.rect.width)}{'\u2009'}\u00d7{'\u2009'}{Math.round(hover.rect.height)}
          </div>

          <div style={{
            position: 'absolute', whiteSpace: 'nowrap',
            top: hover.rect.top - 3, left: hover.rect.left,
            transform: 'translateY(-100%)',
            fontSize: 10, letterSpacing: '0.04em',
            color: '#e5e5e5',
          }}>
            {hover.label}
          </div>

          {[
            { top: hover.rect.top - 1, left: hover.rect.left - 5, w: 4, h: 1 },
            { top: hover.rect.top - 1, left: hover.rect.left + hover.rect.width + 1, w: 4, h: 1 },
            { top: hover.rect.top + hover.rect.height, left: hover.rect.left - 5, w: 4, h: 1 },
            { top: hover.rect.top + hover.rect.height, left: hover.rect.left + hover.rect.width + 1, w: 4, h: 1 },
          ].map((t, i) => (
            <div key={i} style={{
              position: 'absolute', ...t,
              background: 'rgba(255,255,255,0.35)',
            }} />
          ))}
        </div>
      )}

      {/* spec panel */}
      {pinned && (
        <div
          data-probe-ui
          style={{
            position: 'fixed', bottom: 16, right: 16, zIndex: 9999,
            width: 310, fontFamily: mono,
            background: '#0a0a0a',
            border: '1px solid #262626',
            color: '#c0c0c0',
          }}
        >
          <div style={{
            padding: '10px 14px',
            borderBottom: '1px solid #262626',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, background: '#e5e5e5' }} />
              <span style={{
                fontSize: 11, fontWeight: 600,
                letterSpacing: '0.08em', textTransform: 'uppercase',
                color: '#e5e5e5',
              }}>
                {pinned.label}
              </span>
            </div>
            <button
              data-probe-ui
              onClick={() => setPinned(null)}
              style={{
                all: 'unset', cursor: 'pointer',
                fontSize: 11, color: '#505050',
                letterSpacing: '0.08em',
              }}
            >
              ESC
            </button>
          </div>

          <div style={{ padding: '8px 14px 14px', maxHeight: '60vh', overflowY: 'auto' }}>
            <SectionLabel>layout</SectionLabel>
            <ReceiptRow k="SIZE" v={`${Math.round(pinned.width)} x ${Math.round(pinned.height)}`} />
            <ReceiptRow k="POSITION" v={`${Math.round(pinned.x)}, ${Math.round(pinned.y)}`} />
            <ReceiptRow k="PADDING" v={pinned.padding.join(' ')} />
            <ReceiptRow k="MARGIN" v={pinned.margin.join(' ')} />
            <ReceiptRow k="RADIUS" v={pinned.radius} />
            {pinned.display !== 'inline' && <ReceiptRow k="DISPLAY" v={pinned.display} />}
            {pinned.gap && <ReceiptRow k="GAP" v={pinned.gap} />}

            <ReceiptDivider />

            <SectionLabel>color</SectionLabel>
            <ReceiptRow k="FILL" v={SwatchInline({ value: pinned.bg })} />
            <ReceiptRow k="TEXT" v={SwatchInline({ value: pinned.color })} />
            <ReceiptRow k="BORDER" v={pinned.border || 'none'} />

            <ReceiptDivider />

            <SectionLabel>type</SectionLabel>
            <ReceiptRow k="FONT" v={pinned.font} />
            <ReceiptRow k="SIZE" v={`${pinned.fontSize}px`} />
            <ReceiptRow k="WEIGHT" v={pinned.fontWeight} />
            <ReceiptRow k="LINE-H" v={pinned.lineHeight === 'normal' ? 'normal' : `${pinned.lineHeight}px`} />

            <ReceiptDivider />

            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              marginBottom: 6,
            }}>
              <SectionLabel>generated css</SectionLabel>
              <CopyBtn value={specsToCSS(pinned)} />
            </div>
            <pre style={{
              margin: 0, padding: 10,
              fontSize: 10, lineHeight: 1.7,
              color: '#808080',
              border: '1px solid #262626',
              background: '#050505',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-all',
            }}>
{specsToCSS(pinned)}
            </pre>
          </div>
        </div>
      )}

      {/* toggle */}
      <button
        data-probe-ui
        onClick={() => setActive((a) => !a)}
        style={{
          all: 'unset', cursor: 'pointer',
          position: 'fixed', bottom: 16, left: 16, zIndex: 9999,
          display: 'flex', alignItems: 'center', gap: 8,
          padding: '7px 14px',
          fontFamily: mono, fontSize: 10, fontWeight: 600,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          border: `1px solid ${active ? '#e5e5e5' : '#333'}`,
          background: active ? '#e5e5e5' : '#0a0a0a',
          color: active ? '#0a0a0a' : '#606060',
          transition: 'all 0.12s',
        }}
      >
        <span style={{
          display: 'inline-block', width: 6, height: 6,
          background: active ? '#0a0a0a' : '#606060',
          transition: 'background 0.12s',
        }} />
        {active ? "PROBING" : "PROBE"}
      </button>
    </div>
  );
}

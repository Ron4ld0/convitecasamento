const fs = require('fs');
const zlib = require('zlib');

const buf = fs.readFileSync('convite jantar de casamento (1) (1).pdf');
const str = buf.toString('latin1');

const getStream = (num) => {
  const r = new RegExp('(^|\\n)' + num + '\\s+0\\s+obj([\\s\\S]*?)stream\\r?\\n([\\s\\S]*?)\\r?\\nendstream');
  const m = str.match(r);
  if (!m) return '';
  return zlib.inflateSync(Buffer.from(m[3], 'latin1')).toString('latin1');
};

function pdfPathToSvg(streamStr) {
  const tokens = streamStr.trim().split(/\s+/);
  let svg = '';
  let stack = [];
  let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

  function updateBounds(x, y) {
    if (x < minX) minX = x;
    if (x > maxX) maxX = x;
    if (y < minY) minY = y;
    if (y > maxY) maxY = y;
  }

  for (let i = 0; i < tokens.length; i++) {
    const t = tokens[i];
    if (t === 'm') {
      const y = stack.pop();
      const x = stack.pop();
      svg += `M ${x} ${-y} `;
      updateBounds(x, -y);
    } else if (t === 'c') {
      const y3 = stack.pop();
      const x3 = stack.pop();
      const y2 = stack.pop();
      const x2 = stack.pop();
      const y1 = stack.pop();
      const x1 = stack.pop();
      svg += `C ${x1} ${-y1}, ${x2} ${-y2}, ${x3} ${-y3} `;
      updateBounds(x1, -y1);
      updateBounds(x2, -y2);
      updateBounds(x3, -y3);
    } else if (t === 'l') {
      const y = stack.pop();
      const x = stack.pop();
      svg += `L ${x} ${-y} `;
      updateBounds(x, -y);
    } else if (t === 'h' || t === 'f' || t === 'f*') {
      svg += 'Z ';
    } else if (t === 'd1' || t === 'd0') {
      stack = [];
    } else {
      const num = parseFloat(t);
      if (!isNaN(num)) {
        stack.push(num);
      }
    }
  }
  return { svg: svg.trim(), bounds: { minX, minY, maxX, maxY } };
}

const s106 = getStream(106);
const s107 = getStream(107);

const res106 = pdfPathToSvg(s106);
const res107 = pdfPathToSvg(s107);

console.log('106 bounds:', res106.bounds);
console.log('107 bounds:', res107.bounds);

function makeSvg(res, color = '#ffffff') {
  const b = res.bounds;
  const w = Math.ceil(b.maxX - b.minX);
  const h = Math.ceil(b.maxY - b.minY);
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="${b.minX} ${b.minY} ${w} ${h}" width="${w}" height="${h}">
  <path d="${res.svg}" fill="${color}" />
</svg>`;
}

fs.writeFileSync('monogram-106.svg', makeSvg(res106, '#ffffff'));
fs.writeFileSync('monogram-107.svg', makeSvg(res107, '#ffffff'));

// Also write JSON with the raw paths and bounds
fs.writeFileSync('monograms.json', JSON.stringify({
  g28: res106,
  g2D: res107
}, null, 2));

console.log('Extracted exact monogram SVGs successfully!');

import fs = require('fs');
import path = require('path');

const headerItems = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css">'
];

let html = '<!DOCTYPE html><html lang="en"><head>';
// const filenames = fs.readdirSync(path.join(__dirname, '..', 'public', 'styles'));
// for(const filename of filenames) {
//     html += `<link rel="stylesheet" href="/public/styles/${filename}">`;
// }
html += headerItems.join('');
html += '</head><body><div id="root"></div><div id="modals"></div><script src="/dist/main.bundle.js"></script></body></html>';

// export default function(): string {
//     return '<!DOCTYPE html><html>';
// }

export default function(): string { return html; }
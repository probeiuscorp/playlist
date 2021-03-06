const headerItems = [
    '<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.1/font/bootstrap-icons.css">',
    '<link href="http://fonts.cdnfonts.com/css/gt-pressura-mono" rel="stylesheet">',
    '<link rel="preconnect" href="https://fonts.googleapis.com">',
    '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
    '<link href="https://fonts.googleapis.com/css2?family=Ubuntu:wght@700&display=swap" rel="stylesheet">'
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
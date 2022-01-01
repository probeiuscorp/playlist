const b64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+';

function randomElementOf<T>(a: ArrayLike<T>): T {
    return a[Math.floor(Math.random() * a.length)];
}

export function generateID(): string {
    let output = '';
    for(let i=0;i<6;i++) output += randomElementOf(b64);
    return output + btoa((Date.now() % 64**4).toString());
}
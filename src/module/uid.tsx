const b64 = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ-+';

function toB64(int32: number): string {
    let result = '';
    while (true) {
        result = b64[int32 & 0x3f] + result;
        int32 >>>= 6;
        if (int32 === 0)
            break;
    }
    return result;
};

function randomElementOf<T>(a: ArrayLike<T>): T {
    return a[Math.floor(Math.random() * a.length)];
}

export function generateID(): string {
    let output = '';
    for(let i=0;i<6;i++) output += randomElementOf(b64);
    return output + toB64(Date.now());
}
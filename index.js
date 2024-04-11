
const password = "";
const salt = "";
const shaOfPassword = await sha1(password);
const sign = ``;

async function sha1(str) {
    const enc = new TextEncoder();
    const hash = await crypto.subtle.digest("SHA-1", enc.encode(str));
    return Array.from(new Uint8Array(hash))
        .map(v => v.toString(16).padStart(2, "0"))
        .join("");
}


// await sha1('hello, world!');
// outputs: 1f9d3c707d53f3d16c53dd73d70a6ce7596a9 

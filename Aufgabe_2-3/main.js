
async function simuliereVerzoegerung(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function addiereNachVerzoegerung(a, b, ms) {
    simuliereVerzoegerung(ms).then(() => {
        console.log(a + b);
    });
}

await simuliereVerzoegerung(2000).then(() => { console.log('DOne!'); });
await addiereNachVerzoegerung(3, 4, 2000)
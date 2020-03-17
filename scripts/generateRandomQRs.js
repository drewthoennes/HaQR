/*
 * generateRandomQRs
 *
 * node generateRandomQRs.js n
 *
 * @args
 * n    The number of unique qr codes to generate
 */

const idLength = 13;

if (process.argv.length < 3) {
    console.error('Please provide two paths to the users JSON file and the applications JSON file');
    return;
}

(async () => {
    let n = process.argv[2];

    // Create an array of unique ids
    let qrs = [];
    while (qrs.length != n) {
        let qr = Math.floor(Math.random() * Math.pow(10, idLength));

        if (!qrs.includes(qr)) {
            qrs.push(qr);
        }
    }

    qrs.forEach(qr => {
        console.log(qr);
    });
})();

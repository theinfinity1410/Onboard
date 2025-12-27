import selfsigned from 'selfsigned';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const sslDir = path.join(__dirname, 'ssl');

if (!fs.existsSync(sslDir)) {
    fs.mkdirSync(sslDir);
}

const attrs = [{ name: 'commonName', value: 'localhost' }];
try {
    const pems = selfsigned.generate(attrs, { days: 365 });
    console.log('Keys:', Object.keys(pems));
    console.log('Private type:', typeof pems.private);

    fs.writeFileSync(path.join(sslDir, 'server.key'), pems.private);
    fs.writeFileSync(path.join(sslDir, 'server.cert'), pems.cert);
    console.log('Success');
} catch (e) {
    console.error(e);
}

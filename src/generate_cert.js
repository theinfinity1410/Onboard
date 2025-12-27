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
const pems = selfsigned.generate(attrs, { days: 365 });

fs.writeFileSync(path.join(sslDir, 'server.key'), pems.private);
fs.writeFileSync(path.join(sslDir, 'server.cert'), pems.cert);

console.log('SSL Certificates generated in src/ssl/');

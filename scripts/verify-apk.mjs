import { siteConfig } from '../site.config.mjs';

const response = await fetch(siteConfig.apk.url, { method: 'HEAD', redirect: 'follow' });
const length = Number(response.headers.get('content-length'));

console.log(`status: ${response.status}`);
console.log(`configured size: ${siteConfig.apk.sizeBytes} bytes (${siteConfig.apk.sizeLabel})`);
console.log(`live size:       ${length} bytes`);

if (!response.ok) {
  console.error('The APK URL did not return a successful response.');
  process.exit(1);
}

if (Number.isFinite(length) && length > 0 && length !== siteConfig.apk.sizeBytes) {
  console.error('The live file size does not match site.config.mjs. Update sizeBytes and sizeLabel.');
  process.exit(1);
}

console.log('APK size matches the configuration.');

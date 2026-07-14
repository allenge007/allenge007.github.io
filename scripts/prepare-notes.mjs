import { copyFile, mkdir } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';

const source = resolve('node_modules/mermaid/dist/mermaid.min.js');
const destination = resolve('docs/javascripts/generated/diagram-runtime.js');

await mkdir(dirname(destination), { recursive: true });
await copyFile(source, destination);

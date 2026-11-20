import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { join } from 'node:path';

// Validates and copies entry.png
async function main() {
  // Read file from root
  const buf = await readFile('entry.png');

  // Check 8-byte PNG signature
  const sig = [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A];
  if (!sig.every((byte, i) => buf[i] === byte))
    throw new Error('Invalid PNG signature');

  // Check total size is at most 1048576 bytes
  if (buf.length > 1048576) throw new Error('File exceeds 1MB');

  // Parse IHDR chunk for 1024x1024 dimensions
  // Offset 16 is width, 20 is height
  if (buf.readUInt32BE(16) !== 1024 || buf.readUInt32BE(20) !== 1024)
    throw new Error('Dimensions must be 1024x1024');

  // Prepare target directory and write file
  const targetDir = process.env.MAKEFUN_OUTPUT_DIR || '/output';
  await mkdir(targetDir, { recursive: true });
  await writeFile(join(targetDir, 'entry.png'), buf);

  console.log('Successfully validated and saved entry.png');
}

// Execute and handle errors
main().catch((err) => {
  console.error(err.message);
  process.exit(1);
});

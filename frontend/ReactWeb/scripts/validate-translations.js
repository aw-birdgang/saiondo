#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load translation files
const enTranslations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../src/app/di/translations/en.json'),
    'utf8'
  )
);
const koTranslations = JSON.parse(
  fs.readFileSync(
    path.join(__dirname, '../src/app/di/translations/ko.json'),
    'utf8'
  )
);

// Function to flatten nested objects
function flattenObject(obj, prefix = '') {
  const flattened = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === 'object' &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// Flatten both translation objects
const flatEn = flattenObject(enTranslations);
const flatKo = flattenObject(koTranslations);

// Check for missing keys
const enKeys = Object.keys(flatEn);
const koKeys = Object.keys(flatKo);

console.log('Translation Key Validation Report');
console.log('================================');

// Check for keys that exist in one language but not the other
const missingInKo = enKeys.filter(key => !koKeys.includes(key));
const missingInEn = koKeys.filter(key => !enKeys.includes(key));

if (missingInKo.length > 0) {
  console.log('\n❌ Keys missing in Korean:');
  missingInKo.forEach(key => console.log(`  - ${key}`));
}

if (missingInEn.length > 0) {
  console.log('\n❌ Keys missing in English:');
  missingInEn.forEach(key => console.log(`  - ${key}`));
}

if (missingInKo.length === 0 && missingInEn.length === 0) {
  console.log('\n✅ All translation keys are present in both languages');
}

// Check for empty values
const emptyEn = enKeys.filter(key => !flatEn[key] || flatEn[key].trim() === '');
const emptyKo = koKeys.filter(key => !flatKo[key] || flatKo[key].trim() === '');

if (emptyEn.length > 0) {
  console.log('\n⚠️  Empty values in English:');
  emptyEn.forEach(key => console.log(`  - ${key}`));
}

if (emptyKo.length > 0) {
  console.log('\n⚠️  Empty values in Korean:');
  emptyKo.forEach(key => console.log(`  - ${key}`));
}

// Check for the specific keys that were causing issues
const problematicKeys = [
  'channels.my_channels',
  'channels.create_new_channel',
  'channels.channel_stats',
  'channels.no_channels',
  'channels.create_first_channel',
  'channels.channel_description',
];

console.log('\n🔍 Checking specific problematic keys:');
problematicKeys.forEach(key => {
  const enExists = enKeys.includes(key);
  const koExists = koKeys.includes(key);

  if (enExists && koExists) {
    console.log(`  ✅ ${key} - Present in both languages`);
  } else {
    console.log(
      `  ❌ ${key} - Missing in ${!enExists ? 'English' : ''}${!enExists && !koExists ? ' and ' : ''}${!koExists ? 'Korean' : ''}`
    );
  }
});

console.log('\n📊 Summary:');
console.log(`  Total English keys: ${enKeys.length}`);
console.log(`  Total Korean keys: ${koKeys.length}`);
console.log(`  Missing in Korean: ${missingInKo.length}`);
console.log(`  Missing in English: ${missingInEn.length}`);
console.log(`  Empty English values: ${emptyEn.length}`);
console.log(`  Empty Korean values: ${emptyKo.length}`);

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Translation file paths
const enPath = path.join(__dirname, '../src/app/di/translations/en.json');
const koPath = path.join(__dirname, '../src/app/di/translations/ko.json');

// Load translation files
const enTranslations = JSON.parse(fs.readFileSync(enPath, 'utf8'));
const koTranslations = JSON.parse(fs.readFileSync(koPath, 'utf8'));

// Function to get all keys from nested object
function getAllKeys(obj, prefix = '') {
  const keys = [];
  
  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const fullKey = prefix ? `${prefix}.${key}` : key;
      
      if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
        keys.push(...getAllKeys(obj[key], fullKey));
      } else {
        keys.push(fullKey);
      }
    }
  }
  
  return keys;
}

// Function to get value by nested key
function getNestedValue(obj, key) {
  return key.split('.').reduce((current, k) => current && current[k], obj);
}

// Get all keys from both translation files
const enKeys = getAllKeys(enTranslations);
const koKeys = getAllKeys(koTranslations);

// Find missing keys
const missingInKo = enKeys.filter(key => !getNestedValue(koTranslations, key));
const missingInEn = koKeys.filter(key => !getNestedValue(enTranslations, key));

// Find empty values
const emptyInEn = enKeys.filter(key => {
  const value = getNestedValue(enTranslations, key);
  return value === '' || value === null || value === undefined;
});

const emptyInKo = koKeys.filter(key => {
  const value = getNestedValue(koTranslations, key);
  return value === '' || value === null || value === undefined;
});

// Report results
console.log('🌐 Translation Validation Report\n');

if (missingInKo.length === 0 && missingInEn.length === 0 && emptyInEn.length === 0 && emptyInKo.length === 0) {
  console.log('✅ All translation files are consistent and complete!');
  process.exit(0);
}

if (missingInKo.length > 0) {
  console.log('❌ Missing keys in Korean translation:');
  missingInKo.forEach(key => console.log(`  - ${key}`));
  console.log();
}

if (missingInEn.length > 0) {
  console.log('❌ Missing keys in English translation:');
  missingInEn.forEach(key => console.log(`  - ${key}`));
  console.log();
}

if (emptyInEn.length > 0) {
  console.log('⚠️  Empty values in English translation:');
  emptyInEn.forEach(key => console.log(`  - ${key}`));
  console.log();
}

if (emptyInKo.length > 0) {
  console.log('⚠️  Empty values in Korean translation:');
  emptyInKo.forEach(key => console.log(`  - ${key}`));
  console.log();
}

// Statistics
console.log('📊 Statistics:');
console.log(`  English keys: ${enKeys.length}`);
console.log(`  Korean keys: ${koKeys.length}`);
console.log(`  Missing in Korean: ${missingInKo.length}`);
console.log(`  Missing in English: ${missingInEn.length}`);
console.log(`  Empty in English: ${emptyInEn.length}`);
console.log(`  Empty in Korean: ${emptyInKo.length}`);

// Exit with error code if there are issues
if (missingInKo.length > 0 || missingInEn.length > 0 || emptyInEn.length > 0 || emptyInKo.length > 0) {
  process.exit(1);
} 
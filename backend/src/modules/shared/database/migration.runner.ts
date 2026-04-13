#!/usr/bin/env ts-node

import { migrationService } from './migration.service';
import { database } from './database.service';
import logger from '../utils/logger';

/**
 * Migration Runner Script
 * 
 * Usage:
 * npm run migrate          # Run all pending migrations
 * npm run migrate:status   # Show migration status
 * npm run migrate:validate # Validate migration dependencies
 */

async function main() {
  const command = process.argv[2] || 'run';

  try {
    // Test database connection
    const isHealthy = await database.healthCheck();
    if (!isHealthy) {
      console.error('Database connection failed');
      process.exit(1);
    }

    console.log('Database connection established');

    switch (command) {
      case 'run':
        await runMigrations();
        break;
      case 'status':
        await showStatus();
        break;
      case 'validate':
        await validateDependencies();
        break;
      default:
        console.error('Unknown command:', command);
        console.log('Available commands: run, status, validate');
        process.exit(1);
    }

  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    await database.close();
  }
}

async function runMigrations() {
  console.log('Starting migration process...');
  
  const startTime = Date.now();
  await migrationService.runMigrations();
  const duration = Date.now() - startTime;
  
  console.log(`Migration completed successfully in ${duration}ms`);
}

async function showStatus() {
  const status = await migrationService.getMigrationStatus();
  
  console.log('\n=== Migration Status ===');
  console.log(`Total migrations: ${status.total}`);
  console.log(`Executed: ${status.executed}`);
  console.log(`Pending: ${status.pending.length}`);
  
  if (status.lastExecution) {
    console.log(`Last execution: ${status.lastExecution.toISOString()}`);
  }
  
  if (status.pending.length > 0) {
    console.log('\nPending migrations:');
    status.pending.forEach(name => {
      console.log(`  - ${name}`);
    });
  }
  
  console.log('\n=== End Status ===');
}

async function validateDependencies() {
  console.log('Validating migration dependencies...');
  
  const validation = await migrationService.validateDependencies();
  
  if (validation.valid) {
    console.log('All migration dependencies are valid');
  } else {
    console.error('Migration dependency validation failed:');
    validation.errors.forEach(error => {
      console.error(`  - ${error}`);
    });
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  main();
}

export { main as migrationRunner };

import { Injectable } from '@nestjs/common';
import { MongoClient } from 'mongodb';
import * as fs from 'fs';
import * as path from 'path';
import * as cron from 'node-cron';

@Injectable()
export class BackupService {
  private readonly mongoUrl = 'mongodb://localhost:27017'; // MongoDB URL
  private readonly dbName = 'Elearning'; // Database name to backup
  private readonly backupDir = 'F:\\Materials\\GIU\\Software\\e-learning\\backend\\src\\backup'; // Backup directory path

  constructor() {
    this.scheduleBackup();
  }

  // Method to perform a manual backup
  async backupData() {
    const client = new MongoClient(this.mongoUrl, { });
    try {
      await client.connect();
      const db = client.db(this.dbName);
      const collections = await db.collections();

      // Create a backup folder with timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const backupFolderPath = path.join(this.backupDir, `backup_${timestamp}`);
      fs.mkdirSync(backupFolderPath);

      // Backup each collection
      for (const collection of collections) {
        const data = await collection.find().toArray();
        const filePath = path.join(backupFolderPath, `${collection.collectionName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      }

      console.log('Backup completed successfully.');
    } catch (error) {
      console.error('Error during backup:', error);
    } finally {
      await client.close();
    }
  }

  // Schedule the backup to run at regular intervals (e.g., daily at midnight)
  private scheduleBackup() {
    cron.schedule('0 0 * * 0', () => {
      console.log('Scheduled backup starting...');
      this.backupData();
    });
  }
}

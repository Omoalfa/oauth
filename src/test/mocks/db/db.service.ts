import * as fs from 'fs';
import * as path from 'path';

export class DataService {
  private data = {};
  private filePath = path.join(__dirname, "data.json")

  constructor() {
    this.loadDataFromFile();
  }

  private loadDataFromFile() {
    try {
      const rawData = fs.readFileSync(this.filePath, 'utf8');
      this.data = JSON.parse(rawData);
    } catch (error) {
      console.error('Error loading data:', error);
    }
  }

  getTable(column: string) {
    return this.data[column] || [];
  }
  
  updateTable(column: string, user) {
    this.data[column] = user;
    this.saveDataToFile();
  }

  private saveDataToFile() {
    try {
      fs.writeFileSync(this.filePath, JSON.stringify(this.data, null, 2), 'utf8');
    } catch (error) {
      console.error('Error saving data:', error);
    }
  }
}

import { Connection } from 'mysql2/promise';
import { Inject, Injectable } from "@nestjs/common";
import * as fs from 'fs';
import * as fastCsv from 'fast-csv';

import {CsvRepository } from 'lib/types/src/index';

import { DI_VARIABLES } from "src/di";

@Injectable()
export class SqlCsvRepository implements CsvRepository {
    constructor(@Inject(DI_VARIABLES.DB) private readonly db: Connection){}

    async createDynamicTable(filePath : string,columnsDefinition : string): Promise<string>{
        const tableName = this.generateTableName(filePath);
        await this.createTable(tableName, columnsDefinition);
        await this.insertCsvData(filePath,tableName)
        return tableName
    }

    async CreateStatistic(tableName : string):Promise<string>{
      const numericColumns = await this.getNumericColumns(tableName);
      if (numericColumns.length === 0) {
        console.log("No numeric columns found for statistics.");
        return;
      }
      const statsQuery = this.getStatisticsQuery(tableName, numericColumns);
      const [stats]: any = await this.db.execute(statsQuery);
      return stats;
    }

    async getTableByName(tableName: string): Promise<boolean> {
      const query = `SHOW TABLES LIKE '${tableName}'`;  
      const [rows]: any = await this.db.execute(query);
      if(rows.length > 0){
          return true
      }
      return false
    }



    private generateTableName(filePath: string): string {
        return filePath.replace(/^uploads\\/, '').replace(/\.csv$/, '');
      }

    private async createTable(tableName: string, columnsDefinition: string): Promise<void> {
    const query = `CREATE TABLE \`${tableName}\` (id SERIAL PRIMARY KEY, ${columnsDefinition});`;
    await this.db.execute(query);
    }

    private async insertCsvData(filePath: string, tableName: string): Promise<void> {
    return new Promise((resolve, reject) => {
        fs.createReadStream(filePath)
        .pipe(fastCsv.parse({ headers: true }))
        .on('data', async (row) => {
            try {
            const query = this.buildInsertQuery(row, tableName);
            await this.executeInsertQuery(query); // Execute the insert query
            } catch (error) {
            reject(error);
            }
        })
        .on('end', resolve)
        .on('error', reject);
    });
    }

    private buildInsertQuery(row: any, tableName: string): string {
        const columns = Object.keys(row);
        const values = columns.map(column => `'${row[column]}'`).join(', ');
        return `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${values});`;
      }
      
    private async executeInsertQuery(query: string): Promise<void> {
    await this.db.execute(query);
    }
        
    private async getNumericColumns(tableName: string): Promise<string[]> {
        const columnsQuery = `SHOW COLUMNS FROM \`${tableName}\``;
        const [columns]: any = await this.db.execute(columnsQuery);
    
        return columns
          .filter((col: any) =>
            col.Type.includes('int') ||
            col.Type.includes('decimal') ||
            col.Type.includes('float') ||
            col.Type.includes('double')
          )
          .map((col: any) => col.Field);
      }

    private getStatisticsQuery(tableName: string, numericColumns: string[]): string {
    return `
        SELECT 
        COUNT(*) AS total_rows,
        ${numericColumns.map(col => `AVG(\`${col}\`) AS avg_${col}, MAX(\`${col}\`) AS max_${col}, MIN(\`${col}\`) AS min_${col}`).join(', ')}
        FROM \`${tableName}\`
    `;
    }

 
}
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
        const tableName = filePath.replace(/^uploads\\/, '').replace(/\.csv$/, '');
        
        const query = `CREATE TABLE \`${tableName}\` (id SERIAL PRIMARY KEY, ${columnsDefinition});`;
        await this.db.execute(query);
        await this.insertCsvData(filePath,tableName)
        return tableName
    }

    
    async  insertCsvData(filePath: string, tableName: string): Promise<void> {
        fs.createReadStream(filePath)
            .pipe(fastCsv.parse({ headers: true }))
            .on('data', async (row) => {
            const columns = Object.keys(row);
            const values = columns.map(column => `'${row[column]}'`).join(', ');
            const query = `INSERT INTO \`${tableName}\` (${columns.map(c => `\`${c}\``).join(', ')}) VALUES (${values});`;
            await this.db.execute(query);
            })
        }
    async CreateStatistic(tableName : string):Promise<string>{
            const columnsQuery = `SHOW COLUMNS FROM \`${tableName}\``;
            const [columns]: any = await this.db.execute(columnsQuery);
    
            const numericColumns = columns
            .filter((col: any) =>
                col.Type.includes('int') ||
                col.Type.includes('decimal') ||
                col.Type.includes('float') ||
                col.Type.includes('double')
            )
            .map((col: any) => col.Field);
    
            if (numericColumns.length === 0) {
                console.log("No numeric columns found for statistics.");
                return;
            }
    
            const statsQuery = `
                SELECT 
                    COUNT(*) AS total_rows,
                    ${numericColumns.map(col => `AVG(\`${col}\`) AS avg_${col}, MAX(\`${col}\`) AS max_${col}, MIN(\`${col}\`) AS min_${col}`).join(', ')}
                FROM \`${tableName}\`
            `;

            const [stats]: any = await this.db.execute(statsQuery);
            return stats
    }

    async getTableByName(tableName: string): Promise<boolean> {
        const query = `SHOW TABLES LIKE '${tableName}'`;  // استخدام string interpolation هنا
        const [rows]: any = await this.db.execute(query);
        if(rows.length > 0){
            return true
        }
        return false
    }
    
    
}
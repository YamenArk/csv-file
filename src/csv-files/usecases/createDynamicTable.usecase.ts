import * as fs from 'fs';
import * as fastCsv from 'fast-csv';


import {  Usecase,CsvRepository   } from 'lib/types/src/index';
export class CreateDynamicTableUsecase implements Usecase<string,Promise<string>  > {
  constructor(private csvRepository: CsvRepository) {}

  async execute(filePath: string): Promise<string> {
    const {columns,types} = await this.getCsvStructure(filePath)
    let columnsDefinition = columns.map((col, index) => `\`${col}\` ${types[index]}`).join(', ');
    return this.csvRepository.createDynamicTable(filePath,columnsDefinition);
  }
    
  async  getCsvStructure(filePath: string): Promise<{ columns: string[], types: string[] }> {
  return new Promise((resolve, reject) => {
      let headers: string[] = [];
      let types: string[] = [];
      let seenColumns = new Map<string, number>();

      fs.createReadStream(filePath)
      .pipe(fastCsv.parse({ headers: false }))
      .on('data', (row) => {
          if (headers.length === 0) {
          row.forEach((col: string, index: number) => {
              let colName = col.trim();
              if (seenColumns.has(colName)) {
              let count = seenColumns.get(colName)! + 1;
              seenColumns.set(colName, count);
              colName = `${colName}_${count}`;
              } else {
              seenColumns.set(colName, 1);
              }
              headers.push(colName);
          });
          } else if (types.length === 0) {
          row.forEach((value: string) => {
              let columnType = this.detectColumnType(value);
              types.push(columnType);
          });
          resolve({ columns: headers, types });
          }
      })
      .on('error', (error) => reject(error));
  });
  }

  detectColumnType(value: string): string {
    if (!value || value.trim() === '') return 'TEXT'; // Empty values default to TEXT

    if (/^\d+$/.test(value)) return 'INT'; // Whole numbers are INT

    if (/^\d+\.\d+$/.test(value)) return 'FLOAT'; // Numbers with decimals are FLOAT

    if (
        /^\d{4}-\d{2}-\d{2}$/.test(value) || // YYYY-MM-DD
        /^\d{2}\/\d{2}\/\d{4}$/.test(value) || // MM/DD/YYYY
        /^\d{2}-\d{2}-\d{4}$/.test(value) // DD-MM-YYYY
    ) {
        return 'DATE'; // Recognized date formats
    }

    return 'TEXT'; // Everything else is TEXT
  }


}

import * as fs from 'fs';
import * as fastCsv from 'fast-csv';

import { CsvRepository, Usecase} from 'lib/types/src/index';

export class CreateDynamicTableUsecase implements Usecase<string,Promise<string>  > {
  constructor(
    private csvRepository: CsvRepository,
  ) {}

async execute(filePath: string): Promise<string> {
  const { columns, types } = await this.getCsvStructure(filePath);
  let columnsDefinition = columns.map((col, index) => `\`${col}\` ${types[index]}`).join(', ');
  const fileName = await this.csvRepository.createDynamicTable(filePath, columnsDefinition);
  return fileName;
}

async getCsvStructure(filePath: string): Promise<{ columns: string[]; types: string[] }> {
  const { columns, types } = await this.parseCsv(filePath);
  return { columns, types };
}

private async parseCsv(filePath: string): Promise<{ columns: string[]; types: string[] }> {
  return new Promise((resolve, reject) => {
    const headers: string[] = [];
    const types: string[] = [];
    const seenColumns = new Map<string, number>();

    const stream = fs.createReadStream(filePath);

    stream.on('error', (err) => reject(new Error(`File read error: ${err.message}`))); 

    stream
      .pipe(fastCsv.parse({ headers: false }))
      .on('data', (row) => this.processRow(row, headers, types, seenColumns))
      .on('end', () => resolve({ columns: headers, types }))
      .on('error', (err) => reject(new Error(`CSV Parsing error: ${err.message}`)));
  });
}

private processRow(row: string[], headers: string[], types: string[], seenColumns: Map<string, number>) {
  if (headers.length === 0) {
    this.processHeaders(row, headers, seenColumns);
  } else if (types.length === 0) {
    this.processTypes(row, types);
  }
}

private processHeaders(row: string[], headers: string[], seenColumns: Map<string, number>) {
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
}

private processTypes(row: string[], types: string[]) {
  row.forEach((value: string) => {
    const columnType = this.detectColumnType(value);
    types.push(columnType);
  });
}

detectColumnType(value: string): string {
  if (!value || value.trim() === '') return 'TEXT';
  if (this.isInteger(value)) return 'INT';
  if (this.isFloat(value)) return 'FLOAT';
  if (this.isDate(value)) return 'DATE';
  return 'TEXT';
}

private isInteger(value: string): boolean {
  return /^\d+$/.test(value);
}

private isFloat(value: string): boolean {
  return /^\d+\.\d+$/.test(value);
}

private isDate(value: string): boolean {
  return (
    /^\d{4}-\d{2}-\d{2}$/.test(value) || // YYYY-MM-DD
    /^\d{2}\/\d{2}\/\d{4}$/.test(value) || // MM/DD/YYYY
    /^\d{2}-\d{2}-\d{4}$/.test(value) // DD-MM-YYYY
  );
}
}
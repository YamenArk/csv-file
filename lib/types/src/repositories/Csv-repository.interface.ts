export interface CsvRepository {
    createDynamicTable(filePath : string,columnsDefinition:string): Promise<string>;
    CreateStatistic(tableName : string):Promise<string>
    getTableByName(tableName : string):Promise<boolean>
}

import { Injectable } from "@nestjs/common";

@Injectable()
export class ConfigService{
  getDatabaseNameString(): string {
    return process.env.DATABASE_NAME;
  }

  getDatabaseHostString(): string {
    return process.env.DATABASE_HOST;
  }

  getDatabaseUserString(): string {
    return process.env.DATABASE_USER;
  }

  getDatabasePasswordString(): string {
    return process.env.DATABASE_PASSWORD;
  }
  
  getDatabasePort(): number {
    return parseInt(process.env.DATABASE_PORT, 10) || 3000;
  }

  getDatabaseType(): 'mysql' | 'postgres' | 'sqlite' | 'aurora-mysql' {
    return (process.env.TYPE as 'mysql' | 'postgres' | 'sqlite' | 'aurora-mysql') || 'mysql';
  }

  getRedisHost(): string {
    return process.env.REDIS_HOST || 'localhost';
  }

  getRedisPort(): number {
    return Number(process.env.REDIS_PORT) || 6379;
  }

  getMailHost(): string {
    return process.env.MAIL_HOST || 'smtp.office365.com';
  }

  getMailPort(): number {
    return Number(process.env.MAIL_PORT) || 587;
  }

  getMailUsername(): string {
    return process.env.MAIL_USERNAME;
  }

  getMailPassword(): string {
    return process.env.MAIL_PASSWORD;
  }
}
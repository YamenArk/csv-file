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
}
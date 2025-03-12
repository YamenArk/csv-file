import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { Multer } from 'multer';

@Injectable()
export class FileExistencePipe implements PipeTransform {
  transform(file: Multer.File) {
    if (!file) {
      throw new BadRequestException('No file uploaded'); // Handle file not found here
    }
    return file; // Return the file if it exists
  }
}

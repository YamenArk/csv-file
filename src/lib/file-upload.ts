import { diskStorage } from 'multer';
import { BadRequestException } from '@nestjs/common';

export const fileUpload = {
  storage: diskStorage({
    destination: './uploads', // Folder to store uploaded files
    filename: (req, file, callback) => {
      const filename = `${Date.now()}-${file.originalname}`;
      callback(null, filename);
    },
  }),
  fileFilter: (req, file, callback) => {
    if (!file.originalname.match(/\.(csv)$/)) {
      return callback(new BadRequestException('Only CSV files are allowed!'), false);
    }
    callback(null, true);
  },
};

import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import sharp from 'sharp';
import { type MulterFile } from './assets.type.js';

@Injectable()
export class ThumbnailValidationPipe implements PipeTransform {
  async transform(file: MulterFile): Promise<MulterFile> {
    if (!file) {
      throw new BadRequestException('No file provided');
    }

    try {
      const img = sharp(file.buffer);
      const metadata = await img.metadata();

      // Vérification de la taille (max 2MB)
      if (
        !metadata.size ||
        metadata.size === 0 ||
        metadata.size > 2000 * 1024
      ) {
        throw new BadRequestException('Thumbnail must be smaller than 2MB');
      }

      // Vérification du format
      if (
        metadata.format !== 'jpeg' &&
        metadata.format !== 'png' &&
        metadata.format !== 'webp'
      ) {
        throw new BadRequestException(
          'Thumbnail must be a JPEG, PNG or WEBP image',
        );
      }

      // Vérification de l'aspect ratio (16/9)
      const aspectRatio = (metadata.width || 0) / (metadata.height || 1);
      if (aspectRatio < 16 / 10 || aspectRatio > 16 / 8) {
        throw new BadRequestException('Thumbnail aspect ratio must be 16/9');
      }

      return file;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new BadRequestException('Invalid thumbnail image');
    }
  }
}

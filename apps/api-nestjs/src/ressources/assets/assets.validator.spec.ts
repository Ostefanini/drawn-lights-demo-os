import { BadRequestException } from '@nestjs/common';
import sharp from 'sharp';
import { type MulterFile } from './assets.type.js';
import { ThumbnailValidationPipe } from './assets.validator.js';

describe('ThumbnailValidationPipe', () => {
  let pipe: ThumbnailValidationPipe;

  beforeEach(() => {
    pipe = new ThumbnailValidationPipe();
  });

  describe('valid images', () => {
    it('should accept valid JPEG image with 16:9 aspect ratio', async () => {
      // Créer une image 1920x1080 (16:9)
      const buffer = await sharp({
        create: {
          width: 1920,
          height: 1080,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'test.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      const result = await pipe.transform(file);

      expect(result).toEqual(file);
    });

    it('should accept valid PNG image with 16:9 aspect ratio', async () => {
      const buffer = await sharp({
        create: {
          width: 1600,
          height: 900,
          channels: 3,
          background: { r: 0, g: 255, b: 0 },
        },
      })
        .png()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'test.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: buffer.length,
      };

      const result = await pipe.transform(file);

      expect(result).toEqual(file);
    });

    it('should accept valid WEBP image with 16:9 aspect ratio', async () => {
      const buffer = await sharp({
        create: {
          width: 1280,
          height: 720,
          channels: 3,
          background: { r: 0, g: 0, b: 255 },
        },
      })
        .webp()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'test.webp',
        encoding: '7bit',
        mimetype: 'image/webp',
        size: buffer.length,
      };

      const result = await pipe.transform(file);

      expect(result).toEqual(file);
    });
  });

  describe('error cases', () => {
    it('should throw BadRequestException when no file is provided', async () => {
      await expect(pipe.transform(null as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(pipe.transform(null as any)).rejects.toThrow(
        'No file provided',
      );
    });

    it('should throw BadRequestException when file is undefined', async () => {
      await expect(pipe.transform(undefined as any)).rejects.toThrow(
        BadRequestException,
      );
      await expect(pipe.transform(undefined as any)).rejects.toThrow(
        'No file provided',
      );
    });

    it('should throw BadRequestException for file larger than 2MB', async () => {
      // Créer une grande image (> 2MB) - 6000x3375 avec qualité max
      const buffer = await sharp({
        create: {
          width: 6000,
          height: 3375,
          channels: 4,
          background: { r: 255, g: 255, b: 255, alpha: 1 },
        },
      })
        .png({ compressionLevel: 0 })
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'large.png',
        encoding: '7bit',
        mimetype: 'image/png',
        size: buffer.length,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Thumbnail must be smaller than 2MB',
      );
    });

    it('should throw BadRequestException for invalid format (GIF)', async () => {
      const buffer = await sharp({
        create: {
          width: 1600,
          height: 900,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .gif()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'test.gif',
        encoding: '7bit',
        mimetype: 'image/gif',
        size: buffer.length,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Thumbnail must be a JPEG, PNG or WEBP image',
      );
    });

    it('should throw BadRequestException for invalid format (TIFF)', async () => {
      const buffer = await sharp({
        create: {
          width: 1600,
          height: 900,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .tiff()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'test.tiff',
        encoding: '7bit',
        mimetype: 'image/tiff',
        size: buffer.length,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Thumbnail must be a JPEG, PNG or WEBP image',
      );
    });

    it('should throw BadRequestException for aspect ratio too narrow (portrait)', async () => {
      // 9:16 (portrait, inverse de 16:9)
      const buffer = await sharp({
        create: {
          width: 900,
          height: 1600,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'portrait.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Thumbnail aspect ratio must be 16/9',
      );
    });

    it('should throw BadRequestException for aspect ratio too wide', async () => {
      // 21:9 (ultra-wide)
      const buffer = await sharp({
        create: {
          width: 2100,
          height: 900,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'ultrawide.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Thumbnail aspect ratio must be 16/9',
      );
    });

    it('should throw BadRequestException for square aspect ratio', async () => {
      // 1:1 (carré)
      const buffer = await sharp({
        create: {
          width: 1000,
          height: 1000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'square.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Thumbnail aspect ratio must be 16/9',
      );
    });

    it('should throw BadRequestException for corrupted image data', async () => {
      const file: MulterFile = {
        buffer: Buffer.from('not an image'),
        fieldname: 'thumbnail',
        originalname: 'corrupted.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 13,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
      await expect(pipe.transform(file)).rejects.toThrow(
        'Invalid thumbnail image',
      );
    });

    it('should throw BadRequestException for empty buffer', async () => {
      const file: MulterFile = {
        buffer: Buffer.from([]),
        fieldname: 'thumbnail',
        originalname: 'empty.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: 0,
      };

      await expect(pipe.transform(file)).rejects.toThrow(BadRequestException);
    });
  });

  describe('edge cases', () => {
    it('should accept image with aspect ratio at lower boundary (16/10)', async () => {
      // 16/10 = 1.6 (juste au-dessus de la limite)
      const buffer = await sharp({
        create: {
          width: 1600,
          height: 1000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'boundary-low.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      const result = await pipe.transform(file);

      expect(result).toEqual(file);
    });

    it('should accept image with aspect ratio at upper boundary (16/8 = 2:1)', async () => {
      // 16/8 = 2.0 (juste en dessous de la limite)
      const buffer = await sharp({
        create: {
          width: 2000,
          height: 1000,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'boundary-high.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      const result = await pipe.transform(file);

      expect(result).toEqual(file);
    });

    it('should accept small valid image', async () => {
      // Petite image mais valide
      const buffer = await sharp({
        create: {
          width: 320,
          height: 180,
          channels: 3,
          background: { r: 255, g: 0, b: 0 },
        },
      })
        .jpeg()
        .toBuffer();

      const file: MulterFile = {
        buffer,
        fieldname: 'thumbnail',
        originalname: 'small.jpg',
        encoding: '7bit',
        mimetype: 'image/jpeg',
        size: buffer.length,
      };

      const result = await pipe.transform(file);

      expect(result).toEqual(file);
    });
  });
});

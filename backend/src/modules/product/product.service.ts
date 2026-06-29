import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import * as fs from 'fs/promises';
import { join } from 'path';

import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductQueryDto } from './dto/product-query.dto';

@Injectable()
export class ProductService {
  constructor(private prisma: PrismaService) {}

  private buildImagePaths(filenames: string[]): string[] {
    return filenames.map((f) => `uploads/${f}`);
  }

  private async deleteImageFile(imagePath: string): Promise<void> {
    try {
      const fullPath = join(process.cwd(), imagePath);
      await fs.unlink(fullPath);
    } catch {
      // File may not exist; silently ignore
    }
  }

  async findAll(query: ProductQueryDto) {
    const { page = 1, limit = 10, search, categoryId } = query;
    const skip = (page - 1) * limit;

    const where: Record<string, unknown> = {};
    if (search) {
      where.name = { contains: search, mode: 'insensitive' };
    }
    if (categoryId) {
      where.categoryId = categoryId;
    }

    const [products, total] = await Promise.all([
      this.prisma.product.findMany({
        where,
        skip,
        take: limit,
        orderBy: { createdAt: 'desc' },
        include: {
          category: { select: { id: true, name: true, slug: true } },
        },
      }),
      this.prisma.product.count({ where }),
    ]);

    return {
      data: products,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string) {
    const product = await this.prisma.product.findUnique({
      where: { id },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  async create(dto: CreateProductDto, files: Express.Multer.File[]) {
    const images = files ? this.buildImagePaths(files.map((f) => f.filename)) : [];
    return this.prisma.product.create({
      data: {
        name: dto.name,
        categoryId: dto.categoryId,
        description: dto.description,
        price: dto.price,
        originalPrice: dto.originalPrice ?? null,
        stockQty: dto.stockQty ?? 0,
        tags: dto.tags ?? [],
        images,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
  }

  async update(
    id: string,
    dto: UpdateProductDto,
    files: Express.Multer.File[],
  ) {
    const product = await this.findOne(id);

    // Determine which existing images to keep
    let existingImages = [...product.images];
    if (dto.removeImages && dto.removeImages.length > 0) {
      for (const filename of dto.removeImages) {
        const imagePath = `uploads/${filename}`;
        if (existingImages.includes(imagePath)) {
          await this.deleteImageFile(imagePath);
          existingImages = existingImages.filter((img) => img !== imagePath);
        }
      }
    }

    // Add new uploaded images
    const newImages = files ? this.buildImagePaths(files.map((f) => f.filename)) : [];
    const images = [...existingImages, ...newImages];

    return this.prisma.product.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name }),
        ...(dto.categoryId && { categoryId: dto.categoryId }),
        ...(dto.description && { description: dto.description }),
        ...(dto.price !== undefined && { price: dto.price }),
        ...(dto.originalPrice !== undefined && { originalPrice: dto.originalPrice }),
        ...(dto.stockQty !== undefined && { stockQty: dto.stockQty }),
        ...(dto.tags !== undefined && { tags: dto.tags }),
        images,
      },
      include: { category: { select: { id: true, name: true, slug: true } } },
    });
  }

  async remove(id: string) {
    const product = await this.findOne(id);

    // Delete all associated image files from disk
    for (const imagePath of product.images) {
      await this.deleteImageFile(imagePath);
    }

    await this.prisma.product.delete({ where: { id } });
    return { message: 'Product deleted successfully' };
  }
}

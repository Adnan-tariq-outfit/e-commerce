import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoryService {
  constructor(private prisma: PrismaService) {}

  private toSlug(name: string): string {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }

  async findAll() {
    return this.prisma.category.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: { select: { products: true } },
      },
    });
  }

  async findOne(id: string) {
    const category = await this.prisma.category.findUnique({
      where: { id },
      include: { _count: { select: { products: true } } },
    });
    if (!category) throw new NotFoundException('Category not found');
    return category;
  }

  async create(dto: CreateCategoryDto) {
    const slug = this.toSlug(dto.name);

    const existing = await this.prisma.category.findUnique({ where: { slug } });
    if (existing)
      throw new ConflictException(
        `Category with slug "${slug}" already exists`,
      );

    return this.prisma.category.create({
      data: { name: dto.name, slug },
      include: { _count: { select: { products: true } } },
    });
  }

  async update(id: string, dto: UpdateCategoryDto) {
    await this.findOne(id);

    const data: { name?: string; slug?: string } = {};
    if (dto.name) {
      data.name = dto.name;
      data.slug = this.toSlug(dto.name);

      const existing = await this.prisma.category.findFirst({
        where: { slug: data.slug, NOT: { id } },
      });
      if (existing)
        throw new ConflictException(
          `Category with slug "${data.slug}" already exists`,
        );
    }

    return this.prisma.category.update({
      where: { id },
      data,
      include: { _count: { select: { products: true } } },
    });
  }

  async remove(id: string) {
    const category = await this.findOne(id);

    if (category._count.products > 0) {
      throw new ConflictException(
        `Cannot delete category "${category.name}" because it has ${category._count.products} product(s). Remove or reassign the products first.`,
      );
    }

    await this.prisma.category.delete({ where: { id } });
    return { message: 'Category deleted successfully' };
  }
}

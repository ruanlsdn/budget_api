import { Injectable } from '@nestjs/common';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProductService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: CreateProductDto) {
    return await this.prisma.product.create({
      data,
    });
  }

  async findAll(userId: string) {
    return await this.prisma.product.findMany({
      where: { user_id: userId },
      orderBy: { description: Prisma.SortOrder.asc },
    });
  }

  async findOne(id: string) {
    return await this.prisma.product.findUniqueOrThrow({ where: { id } });
  }

  async update(id: string, data: UpdateProductDto) {
    return await this.prisma.product.update({
      where: { id },
      data,
    });
  }

  async remove(id: string) {
    return await this.prisma.product.delete({ where: { id } });
  }

  async removeMany(userId: string) {
    return await this.prisma.product.deleteMany({ where: { user_id: userId } });
  }
}

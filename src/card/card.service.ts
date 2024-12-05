import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCardDto } from './dto/create-card.dto';
import { UpdateCardStatusDto } from './dto/update-card-status.dto';
import { OrderService } from '../order/order.service';
import { ProductService } from '../product/product.service';

@Injectable()
export class CardService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly orderService: OrderService,
    private readonly productService: ProductService,
  ) {}

  async create(data: CreateCardDto) {
    const createdCard = await this.prisma.card.create({
      data: {
        clientName: data.clientName,
        clientAddress: data.clientAddress,
        userId: data.userId,
      },
    });

    this.orderService.create(createdCard.id, data.products);

    return await this.findUnique(createdCard.id);
  }

  async updateCardStatus(id: string, data: UpdateCardStatusDto) {
    const updatedCard = await this.prisma.card.update({ where: { id }, data });

    if (data.checked) {
      await this.productService.updateProductQuantityFromCard(
        await this.findUnique(updatedCard.id),
      );
    }

    return updatedCard;
  }

  async findByUserId(userId: string) {
    return await this.prisma.card.findMany({
      where: { userId },
      select: {
        id: true,
        clientName: true,
        clientAddress: true,
        checked: true,
        orders: {
          select: {
            productQuantity: true,
            productPrice: true,
            product: { select: { id: true, description: true } },
          },
          orderBy: { productQuantity: 'desc' },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findByPeriod(userId: string, initialDate: Date, finalDate: Date) {
    return await this.prisma.card.findMany({
      where: {
        userId,
        checked: true,
        AND: {
          createdAt: { gte: initialDate },
          AND: { createdAt: { lte: finalDate } },
        },
      },
      select: {
        id: true,
        clientName: true,
        clientAddress: true,
        checked: true,
        orders: {
          select: {
            productQuantity: true,
            productPrice: true,
            product: { select: { id: true, description: true } },
          },
          orderBy: { productQuantity: 'desc' },
        },
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findUnique(id: string) {
    return await this.prisma.card.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        clientName: true,
        clientAddress: true,
        checked: true,
        orders: {
          select: {
            productQuantity: true,
            productPrice: true,
            product: { select: { id: true, description: true } },
          },
          orderBy: { productQuantity: 'desc' },
        },
        createdAt: true,
      },
    });
  }

  async deleteRejectedCards() {
    console.log(`Iniciando exclusão das comandas rejeitadas...`);

    const response = await this.prisma.card.deleteMany({
      where: { checked: false },
    });

    console.log(
      `Foram excluídas ${
        response.count
      } comandas em ${new Date().toLocaleString('pt-br')}.`,
    );
  }
}

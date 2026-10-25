import { Injectable, NotFoundException } from '@nestjs/common';
import { prisma } from '@vendome/database';

@Injectable()
export class OrdersService {
  async create(data: { customerEmail: string; fullName?: string; items: any[]; totalAmountCOP: number }) {
    const reference = `VENDOME-${Date.now()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;

    // Obtener o crear cliente
    let customer = await prisma.customer.findUnique({
      where: { email: data.customerEmail },
    });

    if (!customer) {
      customer = await prisma.customer.create({
        data: {
          email: data.customerEmail,
          fullName: data.fullName || 'Client Haute Joaillerie',
        },
      });
    }

    // Crear orden con items
    const order = await prisma.order.create({
      data: {
        reference,
        customerId: customer.id,
        totalAmountCOP: data.totalAmountCOP,
        status: 'PENDING_PAYMENT',
        items: {
          create: data.items.map((item) => ({
            title: item.title,
            unitPriceCOP: item.priceCOP,
            quantity: item.quantity,
            isBespoke: !!item.isBespoke,
          })),
        },
      },
      include: { items: true },
    });

    return order;
  }

  async findByReference(reference: string) {
    const order = await prisma.order.findUnique({
      where: { reference },
      include: { items: true, customer: true },
    });
    if (!order) throw new NotFoundException('Orden no encontrada');
    return order;
  }
}
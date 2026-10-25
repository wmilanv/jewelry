import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { OrdersService } from './orders.service';

@Controller('orders')
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post()
  createOrder(@Body() body: any) {
    return this.ordersService.create(body);
  }

  @Get(':reference')
  findByRef(@Param('reference') ref: string) {
    return this.ordersService.findByReference(ref);
  }
}
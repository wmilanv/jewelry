import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { WompiService } from './wompi.service';
import { IsString, IsNumber, IsEmail } from 'class-validator';

export class InitiatePaymentDto {
  @IsString()
  orderId: string;

  @IsNumber()
  amountInCents: number;

  @IsString()
  currency: 'COP';

  @IsEmail()
  customerEmail: string;
}

@Controller('payments/wompi')
export class WompiController {
  constructor(private readonly wompiService: WompiService) {}

  @Post('initiate')
  initiatePayment(@Body() dto: InitiatePaymentDto) {
    return this.wompiService.getCheckoutConfig(dto);
  }

  @Post('webhook')
  @HttpCode(HttpStatus.OK)
  handleWebhook(@Body() payload: any) {
    return this.wompiService.processWebhookEvent(payload);
  }
}
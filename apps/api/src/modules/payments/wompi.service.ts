import { Injectable, BadRequestException, Logger } from '@nestjs/common';
import * as crypto from 'crypto';
import { prisma } from '@vendome/database';

@Injectable()
export class WompiService {
  private readonly logger = new Logger(WompiService.name);
  private readonly integritySecret = process.env.WOMPI_INTEGRITY_SECRET || 'test_integrity_xyz';
  private readonly eventsSecret = process.env.WOMPI_EVENTS_SECRET || 'test_events_xyz';
  private readonly publicKey = process.env.WOMPI_PUBLIC_KEY || 'pub_test_xyz';

  generateIntegritySignature(reference: string, amountInCents: number, currency: string): string {
    const rawString = `${reference}${amountInCents}${currency}${this.integritySecret}`;
    return crypto.createHash('sha256').update(rawString).digest('hex');
  }

  getCheckoutConfig(dto: { orderId: string; amountInCents: number; currency: 'COP'; customerEmail: string }) {
    const signature = this.generateIntegritySignature(dto.orderId, dto.amountInCents, dto.currency);
    return {
      publicKey: this.publicKey,
      currency: dto.currency,
      amountInCents: dto.amountInCents,
      reference: dto.orderId,
      signatureHex: signature,
      redirectUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/checkout/confirmation`,
    };
  }

  verifyWebhookChecksum(body: any): boolean {
    try {
      const { data, timestamp, signature } = body;
      const properties: string[] = signature.properties;

      let concatenatedValues = '';
      for (const prop of properties) {
        const parts = prop.split('.');
        let val: any = data;
        for (const part of parts) {
          val = val ? val[part] : undefined;
        }
        concatenatedValues += val !== undefined ? val : '';
      }

      const calculatedChecksum = crypto
        .createHash('sha256')
        .update(`${concatenatedValues}${timestamp}${this.eventsSecret}`)
        .digest('hex');

      return calculatedChecksum === signature.checksum;
    } catch (err) {
      this.logger.error('Error calculando checksum de Wompi', err);
      return false;
    }
  }

  async processWebhookEvent(payload: any) {
    if (!this.verifyWebhookChecksum(payload)) {
      throw new BadRequestException('Firma de evento inválida. Intento de manipulación.');
    }

    const { event, data } = payload;
    if (event === 'transaction.updated') {
      const tx = data.transaction;
      this.logger.log(`Transacción Wompi ${tx.id} estado: ${tx.status} ref: ${tx.reference}`);

      if (tx.status === 'APPROVED') {
        await prisma.order.update({
          where: { reference: tx.reference },
          data: {
            status: 'PAID',
            transactionId: tx.id,
            paymentMetadata: tx,
          },
        });
      }
    }

    return { received: true };
  }
}
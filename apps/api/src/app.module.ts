import { Module, MiddlewareConsumer, RequestMethod } from '@nestjs/common';
import { PrototypePollutionMiddleware } from './common/middleware/prototype-pollution.middleware';
import { WompiModule } from './modules/payments/wompi.module';
import { OrdersModule } from './modules/orders/orders.module';

@Module({
  imports: [WompiModule, OrdersModule],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    // Aplicar Middleware de Prevención de Prototype Pollution globalmente
    consumer
      .apply(PrototypePollutionMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
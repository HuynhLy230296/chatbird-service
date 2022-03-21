import { Application } from 'express';
import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { createExpressServer } from 'routing-controllers';
import { APIs } from '../../../api';
import { env } from '../../../env';

export const expressLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings) {
    const expressApp: Application = createExpressServer({
      cors: true,
      classTransformer: false,
      routePrefix: env.app.routePrefix,
      defaultErrorHandler: false,
      controllers: APIs,
    });
    if (!env.isTest) {
      const server = expressApp.listen(env.app.port);
      settings.setData('express_server', server);
    }
    settings.setData('express_app', expressApp);
  }
};

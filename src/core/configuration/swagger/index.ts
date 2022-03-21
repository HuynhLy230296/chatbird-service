import { MicroframeworkLoader, MicroframeworkSettings } from 'microframework-w3tec';
import { validationMetadatasToSchemas } from 'class-validator-jsonschema';
import { getMetadataArgsStorage } from 'routing-controllers';
import { routingControllersToSpec } from 'routing-controllers-openapi';
import * as swaggerUi from 'swagger-ui-express';

import { env } from '../../../env';

export const swaggerLoader: MicroframeworkLoader = (
  settings: MicroframeworkSettings | undefined,
) => {
  if (settings && env.swagger.enabled) {
    const expressApp = settings.getData('express_app');

    const schemas = validationMetadatasToSchemas({
      refPointerPrefix: '#/components/schemas/',
    });

    const swaggerFile = routingControllersToSpec(
      getMetadataArgsStorage(),
      {},
      {
        openapi: '3.0.0',
        info: {
          title: 'Chatbird API',
          summary: 'API for Chatbird app',
          description: 'This is a API for Chatbird application.',
          termsOfService: 'termsOfService.html',
          contact: {
            name: 'API Support',
            url: 'https://www.example.com/support',
            email: 'anhquoc1414@gmail.com',
          },
          license: { name: 'Apache 2.0', identifier: 'Apache-2.0' },
          version: '1.0.0',
        },
        servers: [
          {
            url: `$http://${env.app.host}:${env.app.port}${env.app.routePrefix}`,
            description: 'Development server',
          },
        ],
        components: {
          schemas,
        },
        security: [],
        tags: [],
      },
    );
    const options = {
      explorer: true,
      swaggerOptions: {},
    };
    expressApp.use(
      `${env.app.routePrefix}${env.swagger.route}`,
      swaggerUi.serve,
      swaggerUi.setup(swaggerFile, options),
    );
  }
};

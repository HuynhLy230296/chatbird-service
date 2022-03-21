import 'reflect-metadata';
import { bootstrapMicroframework } from 'microframework-w3tec';
import { Banner } from './core/command/Banner';
import { loggerLoader } from './core/configuration/logger';
import { expressLoader } from './core/configuration/express';
import { swaggerLoader } from './core/configuration/swagger';
import { firebaseLoader } from './core/configuration/firebase';
import { iocLoader } from './core/ioc/index';
import { Logger } from './core/logger';

class ChatbirdApplication {
  private logger = new Logger(__filename);
  private banner = new Banner(this.logger);
  constructor() {}

  public run = (): void => {
    bootstrapMicroframework({
      loaders: [loggerLoader, iocLoader, expressLoader, swaggerLoader, firebaseLoader],
    })
      .then(() => this.banner.showNotification())
      .catch((error) => {
        this.logger.error('Chatbird API has error');
        this.logger.error(`${error}`);
        this.logger.error('Chatbird API has stoped !!!');
      });
  };
}

const app = new ChatbirdApplication();
app.run();

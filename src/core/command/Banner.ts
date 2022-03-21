import { ILogger } from '../../core/decorator/Logger';
export class Banner {
  constructor(private logger: ILogger) {}

  public showNotification(): void {
    this.logger.info('Chatbird API is running !!!');
  }
}

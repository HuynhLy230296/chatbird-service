import { Service } from 'typedi';
// import { Logger, ILogger } from '../core/decorator/Logger';

@Service()
export class HelloService {
  constructor() {}
  public hello(): string {
    return 'Hello word';
  }
}

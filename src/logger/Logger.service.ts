import { Injectable, Scope, ConsoleLogger } from '@nestjs/common';

@Injectable({ scope: Scope.TRANSIENT })
export class ApplicationLogger extends ConsoleLogger {
  customLog() {
    this.log('Application is working');
  }
}

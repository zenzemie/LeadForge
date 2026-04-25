import { Injectable, Logger } from '@nestjs/common';
import { LangGraphService } from './langgraph.service';

@Injectable()
export class OrchestratorService {
  private readonly logger = new Logger(OrchestratorService.name);

  constructor(private langGraph: LangGraphService) {}

  async runGraph(initialInput: any) {
    this.logger.log('Delegating graph execution to LangGraphService');
    return this.langGraph.runGraph(initialInput);
  }
}

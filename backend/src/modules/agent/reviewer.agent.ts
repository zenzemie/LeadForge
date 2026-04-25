import { Injectable } from '@nestjs/common';
import { BaseAgent } from './base.agent';

@Injectable()
export class ReviewerAgent extends BaseAgent {
  constructor() {
    super('reviewer');
  }

  async setupSubscriptions() {}

  async processTask(data: any) {
    this.logger.log(`Reviewer ${this.id} analyzing results...`);
    
    const isSuccessful = data.result && !data.errors?.length;
    
    if (!isSuccessful) {
        this.logger.warn(`Reviewer detected issues in the output.`);
        return { ...data, needsRevision: true };
    }

    return { ...data, needsRevision: false };
  }
}

import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { RoutingService } from './routing.service';
import { OpenAI } from 'openai';

@Injectable()
export class MetaOptimizerService implements OnModuleInit {
  private readonly logger = new Logger(MetaOptimizerService.name);
  private openai: OpenAI;

  constructor(
    private prisma: PrismaService,
    private knowledgeService: KnowledgeService,
    private routingService: RoutingService,
  ) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  onModuleInit() {
    // Run optimization every 6 hours
    setInterval(() => {
      this.optimizeStrategies().catch(err => this.logger.error('Optimization failed', err));
    }, 6 * 3600 * 1000);
  }

  async optimizeStrategies() {
    this.logger.log('Starting Meta-Optimization loop...');

    // 1. Fetch low-performing strategies
    const strategies = this.routingService.getStrategies();
    const stats = this.routingService.getStats();

    for (const strategy of strategies) {
      const armStats = stats[strategy.id];
      const successRate = armStats.alpha / (armStats.alpha + armStats.beta);

      if (successRate < 0.3 && (armStats.alpha + armStats.beta) > 5) {
        this.logger.log(`Strategy ${strategy.id} is underperforming (${successRate.toFixed(2)}). Evolving...`);
        
        // 2. Fetch successful examples from Knowledge Graph
        const successes = await this.knowledgeService.findSimilarSuccesses({ strategyId: strategy.id });
        
        // 3. Mutate strategy (prompt)
        const newPrompt = await this.mutatePrompt(strategy, successes);
        
        // 4. Update strategy pool
        const newStrategyId = `${strategy.id}-evolved-${Date.now()}`;
        this.routingService.addStrategy({
          ...strategy,
          id: newStrategyId,
          prompt: newPrompt,
        });
        
        this.logger.log(`Added new evolved strategy: ${newStrategyId}`);
      }
    }
  }

  private async mutatePrompt(strategy: any, successes: any[]) {
    try {
      const response = await this.openai.chat.completions.create({
        model: 'gpt-4o',
        messages: [
          {
            role: 'system',
            content: 'You are a Meta-Optimizer. Your goal is to evolve AI outreach strategies based on past successes and failures.',
          },
          {
            role: 'user',
            content: `Original Strategy: ${JSON.stringify(strategy)}
Successful Examples: ${JSON.stringify(successes)}

Generate an improved version of the prompt/strategy that incorporates learnings from the successful examples.`,
          },
        ],
      });

      return response.choices[0].message.content;
    } catch (error) {
      this.logger.error(`Mutation failed: ${error.message}`);
      return strategy.prompt || 'Improved strategy';
    }
  }
}

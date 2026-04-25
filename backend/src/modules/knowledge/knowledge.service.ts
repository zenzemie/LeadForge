import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';

@Injectable()
export class KnowledgeService {
  private readonly logger = new Logger(KnowledgeService.name);

  constructor(private prisma: PrismaService) {}

  async hybridSearch(query: string) {
    // keyword search using FTS
    // Note: This is a simplified version for demonstration
    this.logger.log(`Performing hybrid search for: ${query}`);
    try {
        const keywordResults = await this.prisma.$queryRaw`
          SELECT * FROM "Lead" 
          WHERE name ILIKE ${'%' + query + '%'}
          LIMIT 5
        `;
        return keywordResults;
    } catch (error) {
        this.logger.error('Hybrid search failed', error);
        return [];
    }
  }

  async graphSearch(entity: string) {
    this.logger.log(`Performing graph search for entity: ${entity}`);
    return this.prisma.knowledgeGraph.findMany({
      where: {
        OR: [
          { entity: { contains: entity, mode: 'insensitive' } },
          { target: { contains: entity, mode: 'insensitive' } },
        ],
      },
    });
  }

  async addKnowledge(entity: string, relation: string, target: string, metadata?: any) {
    this.logger.log(`Adding knowledge: ${entity} ${relation} ${target}`);
    return this.prisma.knowledgeGraph.create({
      data: {
        entity,
        relation,
        target,
        metadata,
      },
    });
  }

  async extractAndStoreEntities(text: string) {
    // In a real scenario, we would use an LLM to extract triples.
    // For this implementation, we'll do a simple mock extraction.
    this.logger.log(`Extracting entities from text...`);
    
    // Mock extraction logic
    if (text.includes('works at')) {
        const parts = text.split('works at');
        const entity = parts[0].trim();
        const target = parts[1].trim();
        await this.addKnowledge(entity, 'works_at', target);
    }
  }

  async getContext(query: string) {
    const hybrid = await this.hybridSearch(query);
    const graph = await this.graphSearch(query);

    return {
      hybrid,
      graph,
    };
  }

  async recordOutcome(context: any, strategy: any, success: boolean) {
    this.logger.log(`Recording outcome for strategy ${strategy.id}: ${success ? 'SUCCESS' : 'FAILURE'}`);
    return this.addKnowledge(
        `strategy:${strategy.id}`,
        'has_outcome',
        success ? 'success' : 'failure',
        { 
            context,
            strategyId: strategy.id,
            timestamp: new Date().toISOString()
        }
    );
  }

  async findSimilarSuccesses(context: any) {
    this.logger.log(`Finding similar past successes for context: ${JSON.stringify(context)}`);
    // This would normally use vector search on the metadata of 'has_outcome' relations
    // For now, return recent successful strategies
    return this.prisma.knowledgeGraph.findMany({
        where: {
            relation: 'has_outcome',
            target: 'success'
        },
        take: 3,
        orderBy: { createdAt: 'desc' }
    });
  }
}

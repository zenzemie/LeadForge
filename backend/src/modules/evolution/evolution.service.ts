import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../infra/prisma/prisma.service';
import { OpenAI } from 'openai';

@Injectable()
export class EvolutionService implements OnModuleInit {
  private readonly logger = new Logger(EvolutionService.name);
  private openai: OpenAI;

  constructor(private prisma: PrismaService) {
    this.openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  }

  onModuleInit() {
    // Start evolution loop every hour (simulated background worker)
    setInterval(() => {
        this.evolveCampaigns().catch(err => this.logger.error('Evolution loop failed', err));
    }, 3600000);
  }

  async evolveCampaigns() {
    this.logger.log('Starting campaign evolution loop...');
    const campaigns = await this.prisma.campaign.findMany({
      where: { status: 'RUNNING' },
      include: { 
        leads: { 
          include: { 
            logs: true 
          } 
        } 
      },
    });

    for (const campaign of campaigns) {
      await this.evolveCampaign(campaign);
    }
  }

  private async evolveCampaign(campaign: any) {
    this.logger.log(`Evolving campaign: ${campaign.name}`);
    
    const logs = campaign.leads.flatMap(l => l.logs);
    const sentCount = logs.filter(l => l.status === 'SENT').length;
    const successCount = logs.filter(l => l.status === 'REPLIED' || l.status === 'INTERESTED').length;
    
    const performanceData = {
        sent: sentCount,
        success: successCount,
        rate: sentCount > 0 ? successCount / sentCount : 0
    };

    this.logger.log(`Campaign ${campaign.name} performance: ${JSON.stringify(performanceData)}`);

    if (sentCount > 5) {
        this.logger.log(`Triggering mutation for ${campaign.name}...`);
        const newTemplate = await this.mutatePrompt(campaign.messageTemplate, performanceData);
        
        await this.prisma.campaign.update({
            where: { id: campaign.id },
            data: { messageTemplate: newTemplate }
        });
        this.logger.log(`Updated campaign ${campaign.name} with new template.`);
    }
  }

  private async mutatePrompt(basePrompt: string, performanceData: any) {
    try {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o',
            messages: [
                { 
                    role: 'system', 
                    content: 'You are a Genetic Prompt Optimizer. Your goal is to improve outreach prompts based on historical performance.' 
                },
                { 
                    role: 'user', 
                    content: `Current Prompt: "${basePrompt}"\nPerformance: ${JSON.stringify(performanceData)}\n\nGenerate a mutated version of this prompt that might perform better.` 
                }
            ]
        });

        return response.choices[0].message.content;
    } catch (error) {
        this.logger.error(`Mutation failed: ${error.message}`);
        return basePrompt;
    }
  }

  async getEvolutionStats() {
    const campaigns = await this.prisma.campaign.findMany({
        select: {
            id: true,
            name: true,
            updatedAt: true,
            messageTemplate: true,
        }
    });
    return campaigns.map(c => ({
        campaignId: c.id,
        name: c.name,
        lastEvolved: c.updatedAt,
        templateVersion: c.messageTemplate.substring(0, 50) + '...'
    }));
  }
}

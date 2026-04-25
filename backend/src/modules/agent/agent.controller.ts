import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { LangGraphService } from '../orchestrator/langgraph.service';
import { ScoutAgent } from './scout.agent';
import { StrategistAgent } from './strategist.agent';
import { ExecutionAgent } from './execution.agent';
import { ReviewerAgent } from './reviewer.agent';

@ApiTags('AI')
@Controller('ai')
@ApiBearerAuth()
export class AgentController {
  constructor(
    private readonly langGraphService: LangGraphService,
  ) {}

  @Post('nexus/trigger')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Trigger the Nexus swarm' })
  async triggerNexus(@Body() body: any) {
    const result = await this.langGraphService.runGraph(body);
    return { status: 'Accepted', message: 'Nexus swarm has been triggered', result };
  }
}

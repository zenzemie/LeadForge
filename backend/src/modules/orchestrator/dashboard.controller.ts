import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { LangGraphService } from './langgraph.service';
import { EvolutionService } from '../evolution/evolution.service';
import { RoutingService } from './routing.service';

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(
    private readonly langGraphService: LangGraphService,
    private readonly evolutionService: EvolutionService,
    private readonly routingService: RoutingService,
  ) {}

  @Get('graph/topology')
  @ApiOperation({ summary: 'Get LangGraph topology' })
  getTopology() {
    return this.langGraphService.getTopology();
  }

  @Get('evolution/stats')
  @ApiOperation({ summary: 'Get Meta-Optimizer evolution stats' })
  async getEvolutionStats() {
    return {
        evolution: await this.evolutionService.getEvolutionStats(),
        bandit: this.routingService.getStats()
    };
  }

  @Get('graph/traces')
  @ApiOperation({ summary: 'Get real-time agent traces' })
  getTraces() {
    // Mock traces since we don't have a real Jaeger/Zipkin connected in this environment
    return [
      {
        id: 'trace-1',
        name: 'Nexus Execution',
        timestamp: new Date(),
        spans: [
          { name: 'agent.scout', duration: '120ms', status: 'OK' },
          { name: 'agent.strategist', duration: '450ms', status: 'OK' },
          { name: 'agent.execution', duration: '890ms', status: 'OK' },
          { name: 'agent.reviewer', duration: '150ms', status: 'OK' },
          { name: 'agent.memory', duration: '80ms', status: 'OK' },
        ],
      },
    ];
  }
}

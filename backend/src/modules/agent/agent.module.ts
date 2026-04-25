import { Module, Global } from '@nestjs/common';
import { ScoutAgent } from './scout.agent';
import { StrategistAgent } from './strategist.agent';
import { ExecutionAgent } from './execution.agent';
import { ReviewerAgent } from './reviewer.agent';
import { AgentController } from './agent.controller';

@Global()
@Module({
  providers: [ScoutAgent, StrategistAgent, ExecutionAgent, ReviewerAgent],
  controllers: [AgentController],
  exports: [ScoutAgent, StrategistAgent, ExecutionAgent, ReviewerAgent],
})
export class AgentModule {}

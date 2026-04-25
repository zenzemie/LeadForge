import { Injectable, Logger } from '@nestjs/common';
import { StateGraph, END, START } from '@langchain/langgraph';
import { ScoutAgent } from '../agent/scout.agent';
import { StrategistAgent } from '../agent/strategist.agent';
import { ExecutionAgent } from '../agent/execution.agent';
import { ReviewerAgent } from '../agent/reviewer.agent';
import { KnowledgeService } from '../knowledge/knowledge.service';
import { withSpan } from '../../otel';

export interface AgentState {
  data: any;
  strategy?: any;
  result?: any;
  errors: string[];
  iterations: number;
  needsRevision?: boolean;
}

@Injectable()
export class LangGraphService {
  private readonly logger = new Logger(LangGraphService.name);
  private graph: any;

  constructor(
    private scout: ScoutAgent,
    private strategist: StrategistAgent,
    private execution: ExecutionAgent,
    private reviewer: ReviewerAgent,
    private knowledgeService: KnowledgeService,
  ) {
    this.initGraph();
  }

  private initGraph() {
    const workflow = new StateGraph<AgentState>({
      channels: {
        data: {
          reducer: (a, b) => ({ ...a, ...b }),
          default: () => ({}),
        },
        strategy: {
          reducer: (a, b) => b ?? a,
          default: () => null,
        },
        result: {
          reducer: (a, b) => b ?? a,
          default: () => null,
        },
        errors: {
          reducer: (a, b) => [...a, ...b],
          default: () => [],
        },
        iterations: {
          reducer: (a, b) => b ?? a,
          default: () => 0,
        },
        needsRevision: {
          reducer: (a, b) => b ?? a,
          default: () => false,
        },
      },
    })
      .addNode('scout', async (state) => {
        return withSpan('agent.scout', async (span) => {
          span.setAttribute('agent.id', 'scout');
          const output = await this.scout.processTask(state.data);
          span.setAttributes({
            'agent.output.source': output.source,
          });
          return { data: output };
        });
      })
      .addNode('strategist', async (state) => {
        return withSpan('agent.strategist', async (span) => {
          span.setAttribute('agent.id', 'strategist');
          const output = await this.strategist.processTask(state.data);
          span.setAttribute('agent.strategy.id', output.strategy?.id);
          return { strategy: output.strategy, data: output };
        });
      })
      .addNode('execution', async (state) => {
        return withSpan('agent.execution', async (span) => {
          span.setAttribute('agent.id', 'execution');
          const output = await this.execution.processTask(state.data);
          span.setAttribute('agent.result.length', output.result?.length || 0);
          return { result: output.result, data: output };
        });
      })
      .addNode('reviewer', async (state) => {
        return withSpan('agent.reviewer', async (span) => {
          span.setAttribute('agent.id', 'reviewer');
          const output = await this.reviewer.processTask(state.data);
          span.setAttribute('agent.needsRevision', output.needsRevision);
          return { 
            needsRevision: output.needsRevision, 
            iterations: (state.iterations || 0) + 1 
          };
        });
      })
      .addNode('memory', async (state) => {
        return withSpan('agent.memory', async (span) => {
            this.logger.log('Memory node extracting entities...');
            if (state.result) {
                await this.knowledgeService.extractAndStoreEntities(state.result);
            }
            return {};
        });
      });

    workflow.addEdge(START, 'scout');
    workflow.addEdge('scout', 'strategist');
    workflow.addEdge('strategist', 'execution');
    workflow.addEdge('execution', 'reviewer');

    workflow.addConditionalEdges('reviewer', (state) => {
      if (state.needsRevision && state.iterations < 3) {
        return 'strategist';
      }
      return 'memory';
    });

    workflow.addEdge('memory', END);

    this.graph = workflow.compile();
  }

  async runGraph(input: any) {
    this.logger.log('Running LangGraph workflow...');
    const initialState: Partial<AgentState> = {
      data: input,
      errors: [],
      iterations: 0,
    };

    const result = await this.graph.invoke(initialState);
    return result;
  }

  getTopology() {
    // Return a simplified topology for the dashboard
    return {
      nodes: ['scout', 'strategist', 'execution', 'reviewer', 'memory'],
      edges: [
        { from: 'START', to: 'scout' },
        { from: 'scout', to: 'strategist' },
        { from: 'strategist', to: 'execution' },
        { from: 'execution', to: 'reviewer' },
        { from: 'reviewer', to: 'strategist', condition: 'needsRevision && iterations < 3' },
        { from: 'reviewer', to: 'memory', condition: 'else' },
        { from: 'memory', to: 'END' },
      ],
    };
  }
}

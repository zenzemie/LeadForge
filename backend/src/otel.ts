import { NodeSDK } from '@opentelemetry/sdk-node';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { ProcessDetector, envDetector, hostDetector } from '@opentelemetry/resources';
import { trace, Span } from '@opentelemetry/api';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: 'ai-backend',
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || 'http://localhost:4318/v1/traces',
  }),
  instrumentations: [getNodeAutoInstrumentations()],
  resourceDetectors: [envDetector, ProcessDetector, hostDetector],
});

export const getTracer = () => trace.getTracer('aetheris-ai-os');

export const withSpan = async <T>(name: string, fn: (span: Span) => Promise<T>): Promise<T> => {
  return getTracer().startActiveSpan(name, async (span) => {
    try {
      const result = await fn(span);
      span.setStatus({ code: 0 }); // OK
      return result;
    } catch (error) {
      span.setStatus({ code: 1, message: error.message }); // Error
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
};

export default sdk;

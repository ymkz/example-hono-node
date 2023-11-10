const { PrometheusExporter } = require('@opentelemetry/exporter-prometheus')
const { NodeSDK } = require('@opentelemetry/sdk-node')

const sdk = new NodeSDK({
  metricReader: new PrometheusExporter({ port: 4001 }),
})

sdk.start()

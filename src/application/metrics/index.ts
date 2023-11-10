import { metrics, ValueType } from '@opentelemetry/api'

const meter = metrics.getMeter('')

const accessCounter = meter.createCounter('access', {
  description: 'Count number of access by page',
  unit: 'counts',
  valueType: ValueType.INT,
})
export const incrementAccessCount = (path: string, method: string) => {
  accessCounter.add(1, { path, method })
}

const errorCounter = meter.createCounter('error', {
  description: 'Count number of error by error_code',
  unit: 'counts',
  valueType: ValueType.INT,
})
export const incrementErrorCount = (errorCode = 'other') => {
  errorCounter.add(1, { error_code: errorCode })
}

const warnCounter = meter.createCounter('warn', {
  description: 'Count number of warn by warn_code',
  unit: 'counts',
  valueType: ValueType.INT,
})
export const incrementWarnCount = (warnCode = 'other') => {
  warnCounter.add(1, { warn_code: warnCode })
}

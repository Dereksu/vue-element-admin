import request from '@/utils/request'

export function DiagGearbox(data) {
  console.info('DiagGearbox was called')
  return request({
    url: '/api/diag/diagGearbox',
    method: 'post',
    data: data
  })
}

import dayjs from 'dayjs'

export function getFormatTime(value) {
  return dayjs(value).format('YYYY-MM-DD')
}

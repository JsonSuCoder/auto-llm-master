/**
 * 解析 Postgres `timestamp without time zone` 并格式化输出
 * @param ts Postgres 返回的时间字符串，例如 "2025-09-23 03:25:19.903113"
 * @param options.timeZone 时区，默认取当前系统时区
 * @param options.format 格式化字符串，支持 YYYY、MM、DD、HH、mm、ss
 * @returns 格式化后的时间字符串
 */
export function formatPostgresTimestamp(
  ts: string,
  options: { timeZone?: string; format?: string } = {},
): string {
  const {
    timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone,
    format = 'YYYY-MM-DD HH:mm:ss',
  } = options;

  // 解析为 UTC Date
  const date = new Date(ts.replace(' ', 'T') + 'Z');

  // Intl API 获取目标时区的各部分
  const parts = new Intl.DateTimeFormat('en-GB', {
    timeZone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
  })
    .formatToParts(date)
    .reduce<Record<string, string>>((acc, part) => {
      if (part.type !== 'literal') acc[part.type] = part.value;
      return acc;
    }, {});

  // 按格式替换
  return format
    .replace('YYYY', parts.year)
    .replace('MM', parts.month)
    .replace('DD', parts.day)
    .replace('HH', parts.hour)
    .replace('mm', parts.minute)
    .replace('ss', parts.second);
}
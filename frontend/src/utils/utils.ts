export function getSeriesNameFromPath(path: string): string {
  if (!path) return ''
  const cleanPath = path.replace(/[\\/]+$/, '')
  const parts = cleanPath.split(/[\\/]/)
  if (parts.length === 0) return ''
  // 判断最后一级是否为季/新建文件夹等
  let name = ''
  const last = parts[parts.length - 1].toLowerCase()
  if (/season|第.*季|新建文件夹|^s\d{1,2}$/i.test(last)) {
    name = parts[parts.length - 2]
  } else {
    name = parts[parts.length - 1]
  }
  // 去除括号内的年份，如 "Adolescence (2025)" => "Adolescence"
  name = name.replace(/\(\s*\d{4}\s*\)/g, '').trim()
  // 去除结尾的年份，如 "三体 2023" => "三体"
  name = name.replace(/\s*\d{4}$/, '').trim()
  return name
}

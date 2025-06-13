export function getOS(): 'mac' | 'windows' | 'linux' | 'unknown' {
  if (typeof navigator === 'undefined') {
    return 'unknown';
  }
  const userAgent = navigator.userAgent.toLowerCase();
  const platform = (navigator.platform as string).toLowerCase() || userAgent;
  
  if (platform.includes('mac') || userAgent.includes('mac')) {
    return 'mac';
  } else if (platform.includes('win') || userAgent.includes('win')) {
    return 'windows';
  } else if (platform.includes('linux') || userAgent.includes('linux')) {
    return 'linux';
  }
  return 'unknown';
}

export function getShortcutKey(): string {
  const os = getOS();
  return os === 'mac' ? '⌘' : 'Ctrl';
} 
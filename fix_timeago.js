const fs = require('fs');
const glob = require('glob');

const newTimeAgo = `function timeAgo(dateStr: string | any) {
  if (!dateStr) return 'yakın zamanda';
  try {
    const dStr = String(dateStr);
    const date = new Date(dStr + (dStr.endsWith('Z') ? '' : 'Z'));
    if (isNaN(date.getTime())) return 'yakın zamanda';
    const diff = Date.now() - date.getTime();
    if (diff < 0) return 'az önce';
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'az önce';
    if (mins < 60) return \`\${mins}dk\`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return \`\${hrs}sa\`;
    const days = Math.floor(hrs / 24);
    if (days < 30) return \`\${days}g\`;
    const months = Math.floor(days / 30);
    return \`\${months} ay\`;
  } catch (e) {
    return 'yakın zamanda';
  }
}`;

const files = [
  'frontend/src/app/community/page.tsx',
  'frontend/src/app/notifications/page.tsx',
  'frontend/src/app/profile/page.tsx',
  'frontend/src/components/TopBar.tsx',
  'frontend/src/components/SocialPanel.tsx'
];

files.forEach(f => {
  let content = fs.readFileSync(f, 'utf8');
  // Regex to match function timeAgo(...) { ... }
  content = content.replace(/function timeAgo\([\s\S]*?\n\}/, newTimeAgo);
  fs.writeFileSync(f, content);
  console.log('Fixed', f);
});

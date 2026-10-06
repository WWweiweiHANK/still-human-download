const root = document.documentElement;
const themeButton = document.getElementById('theme');
root.dataset.theme = 'dark';
try { const saved = localStorage.getItem('still-human-theme'); if (saved === 'dark' || saved === 'light') root.dataset.theme = saved; } catch {}
function currentTheme() { return root.dataset.theme || 'dark'; }
function updateThemeLabel() { themeButton.textContent = currentTheme() === 'dark' ? '浅色模式' : '深色模式'; }
updateThemeLabel();
themeButton.addEventListener('click', () => {
  root.dataset.theme = currentTheme() === 'dark' ? 'light' : 'dark';
  try { localStorage.setItem('still-human-theme', root.dataset.theme); } catch {}
  updateThemeLabel();
});
const download = document.getElementById('download');
const status = document.getElementById('download-status');
if (location.protocol === 'file:') {
  download.setAttribute('aria-disabled', 'true');
  status.textContent = '请打开本机下载站使用下载按钮。';
} else {
  fetch(document.body.dataset.releaseEndpoint || 'api/release').then(response => { if (!response.ok) throw new Error('Unavailable'); return response.json(); }).then(release => {
    if (!release.available) { download.setAttribute('aria-disabled', 'true'); status.textContent = release.message || '游戏下载暂时不可用，请稍后再试。'; return; }
    if (release.downloadUrl) {
      const target = new URL(release.downloadUrl);
      if (target.protocol !== 'https:' || target.hostname !== 'github.com') throw new Error('Invalid release URL');
      download.href = target.href;
    }
    document.getElementById('download-meta').textContent = `Windows 64 位 · ${(release.bytes / 1024 / 1024).toFixed(0)} MB · ${release.version || release.releaseDate} · 三种语言`;
    download.title = `下载 ${release.filename}`;
  }).catch(() => { status.textContent = '暂时无法获取版本信息，请重试。'; });
}
download.addEventListener('click', event => {
  if (download.getAttribute('aria-disabled') === 'true') { event.preventDefault(); return; }
  status.textContent = '请查看浏览器的下载列表。';
});

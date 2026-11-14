"""Charts for the journey book, computed from the git history and the test data. Run: python3 tools/docs/charts.py"""
import subprocess, collections, pathlib, datetime
import matplotlib
matplotlib.use('Agg')
import matplotlib.pyplot as plt
import matplotlib.dates as mdates

ROOT = pathlib.Path(__file__).resolve().parents[2]
OUT = ROOT / 'docs' / 'figures'
plt.rcParams.update({'font.family': 'Inter', 'font.size': 10, 'axes.spines.top': False, 'axes.spines.right': False,
                     'axes.edgecolor': '#94a3b8', 'axes.labelcolor': '#334155', 'xtick.color': '#475569', 'ytick.color': '#475569'})
INDIGO, AMBER, GREEN, RED, SLATE = '#4f46e5', '#f59e0b', '#10b981', '#ef4444', '#64748b'
git = lambda *a: subprocess.check_output(['git', '-C', str(ROOT), *a], text=True)

# 1. commits per day (human vs bot)
days = collections.Counter(); bots = collections.Counter()
for line in git('log', '--format=%ad|%an', '--date=short').splitlines():
    d, who = line.split('|')
    (bots if 'bot' in who else days)[d] += 1
fig, ax = plt.subplots(figsize=(8, 2.8))
ds = sorted(set(days) | set(bots))
x = [datetime.date.fromisoformat(d) for d in ds]
ax.bar(x, [days[d] for d in ds], color=INDIGO, width=2.2, label='commits by me')
ax.bar(x, [bots[d] for d in ds], bottom=[days[d] for d in ds], color=AMBER, width=2.2, label='automation (GitHub Actions)')
ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2)); ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y')); ax.set_ylabel('commits per day'); ax.legend(frameon=False, loc='upper center')
ax.set_title('Activity on the repository', loc='left', fontweight='bold'); fig.tight_layout(); fig.savefig(OUT / 'chart-activity.png', dpi=200); plt.close(fig)

# 2. JavaScript size by milestone
rows = []
seen = set()
for line in git('log', '--reverse', '--format=%h %ad', '--date=short').splitlines():
    h, d = line.split()
    rows.append((d, h))
last_by_day = {}
for d, h in rows: last_by_day[d] = h
pts = []
for d in sorted(last_by_day):
    h = last_by_day[d]
    files = [f for f in git('ls-tree', '-r', '--name-only', h).splitlines() if f.endswith('.js') and not any(x in f for x in ('lucide', 'node_modules', 'vendor', 'practice_bank', 'practice-bank', 'tests/', 'tools/', 'netlify/'))]
    total = 0
    for f in files:
        try: total += git('show', f'{h}:{f}').count('\n')
        except subprocess.CalledProcessError: pass
    pts.append((datetime.date.fromisoformat(d), total, len(files)))
fig, ax = plt.subplots(figsize=(8, 2.8))
ax.plot([p[0] for p in pts], [p[1] / 1000 for p in pts], marker='o', color=INDIGO, lw=2)
for i, p in enumerate(pts):
    if i in (0, len(pts) - 1) or i == len(pts) - 2: ax.annotate(f'{p[2]} files', (p[0], p[1] / 1000), textcoords='offset points', xytext=(0, 8), ha='center', fontsize=8, color=SLATE)
ax.set_ylabel('thousand lines of app JS'); ax.xaxis.set_major_locator(mdates.MonthLocator(interval=2)); ax.xaxis.set_major_formatter(mdates.DateFormatter('%b %Y'))
ax.set_ylim(0, max(p[1] for p in pts) / 1000 * 1.25)
ax.set_title('Codebase size at the end of each working day', loc='left', fontweight='bold'); fig.tight_layout(); fig.savefig(OUT / 'chart-codesize.png', dpi=200); plt.close(fig)

# 3. what the audit found
labels = ['FA practice\n(120)', 'PDA practice\n(33)', 'TM practice\n(20)', 'Mealy/Moore\npractice (14)']
wrong = [20, 28, 8, 4]; total = [120, 33, 20, 14]
fig, ax = plt.subplots(figsize=(8, 2.8))
ax.barh(labels, total, color='#e2e8f0', label='questions')
ax.barh(labels, wrong, color=RED, label='stored answer was wrong')
for i, (w, t) in enumerate(zip(wrong, total)): ax.text(t + 1, i, f'{w}/{t} ({100*w//t}%)', va='center', fontsize=9, color='#334155')
ax.invert_yaxis(); ax.legend(frameon=False, loc='lower right'); ax.set_xlim(0, 140)
ax.set_title('Wrong reference answers found by the November 2026 audit', loc='left', fontweight='bold'); fig.tight_layout(); fig.savefig(OUT / 'chart-audit.png', dpi=200); plt.close(fig)

# 4. practice content now
cats = ['FA build', 'FA convert', 'Mealy/Moore', 'PDA', 'TM']; vals = [120, 159, 21, 33, 20]
fig, ax = plt.subplots(figsize=(8, 2.6))
ax.bar(cats, vals, color=[INDIGO, '#818cf8', '#f97316', '#8b5cf6', GREEN])
for i, v in enumerate(vals): ax.text(i, v + 3, str(v), ha='center', fontsize=9)
ax.set_ylabel('exercises'); ax.set_ylim(0, 185)
ax.set_title('Practice exercises, every answer machine-verified', loc='left', fontweight='bold'); fig.tight_layout(); fig.savefig(OUT / 'chart-practice.png', dpi=200); plt.close(fig)
print('charts written')

import { useState } from 'react';

type ProjectStatus = 'booked' | 'shot' | 'editing' | 'delivered' | 'approved' | 'paid';
type ProjectType = 'wedding' | 'event' | 'commercial' | 'portrait';

const demoProjects = [
  { id: '1', clientName: 'Emma & James', projectType: 'wedding' as ProjectType, shootDate: '2026-03-15', deliveryDate: '2026-04-15', price: 3500, depositAmount: 1000, depositReceived: true, fullPaymentReceived: false, status: 'editing' as ProjectStatus },
  { id: '2', clientName: 'SEP Group', projectType: 'commercial' as ProjectType, shootDate: '2026-03-20', deliveryDate: '2026-03-30', price: 2800, depositAmount: 800, depositReceived: true, fullPaymentReceived: true, status: 'paid' as ProjectStatus },
  { id: '3', clientName: 'TyrnaGroup', projectType: 'commercial' as ProjectType, shootDate: '2026-04-05', deliveryDate: '2026-04-20', price: 1800, depositAmount: 500, depositReceived: false, fullPaymentReceived: false, status: 'booked' as ProjectStatus },
  { id: '4', clientName: 'OSIA', projectType: 'event' as ProjectType, shootDate: '2026-04-10', deliveryDate: '2026-04-25', price: 1500, depositAmount: 400, depositReceived: true, fullPaymentReceived: false, status: 'delivered' as ProjectStatus },
  { id: '5', clientName: "Christian's Birthday", projectType: 'event' as ProjectType, shootDate: '2026-04-07', deliveryDate: '2026-04-14', price: 950, depositAmount: 300, depositReceived: true, fullPaymentReceived: true, status: 'paid' as ProjectStatus },
];

const STATUS_COLORS: Record<ProjectStatus, string> = {
  booked: 'bg-blue-500/15 text-blue-300 border-blue-500/30',
  shot: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  editing: 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30',
  delivered: 'bg-slate-500/20 text-slate-300 border-slate-500/30',
  approved: 'bg-green-500/15 text-green-300 border-green-500/30',
  paid: 'bg-green-500/20 text-green-200 border-green-500/40',
};

const TYPE_COLORS: Record<ProjectType, string> = {
  wedding: 'bg-pink-500/15 text-pink-300',
  event: 'bg-purple-500/15 text-purple-300',
  commercial: 'bg-blue-500/15 text-blue-300',
  portrait: 'bg-orange-500/15 text-orange-300',
};

const BORDER = 'hsl(220,10%,22%)';
const SURFACE = 'hsl(220,14%,12%)';
const SURFACE2 = 'hsl(220,14%,16%)';
const MUTED = 'hsl(220,10%,58%)';

function StatusBadge({ status }: { status: ProjectStatus }) {
  return (
    <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-xs font-medium capitalize ${STATUS_COLORS[status]}`}>
      {status}
    </span>
  );
}

function TypeBadge({ type }: { type: ProjectType }) {
  return (
    <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium capitalize ${TYPE_COLORS[type]}`}>
      {type}
    </span>
  );
}

function fmt(date: string) {
  return new Date(date).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
}

function DashboardTab() {
  const active = demoProjects.filter(p => p.status !== 'paid');
  const outstanding = demoProjects.filter(p => !p.fullPaymentReceived).reduce((s, p) => s + p.price - (p.depositReceived ? p.depositAmount : 0), 0);
  const deadlines = demoProjects.filter(p => ['editing', 'shot', 'booked'].includes(p.status)).sort((a, b) => new Date(a.deliveryDate).getTime() - new Date(b.deliveryDate).getTime());

  return (
    <div className="p-6 space-y-6" style={{ background: SURFACE }}>
      <div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Welcome back. Here's your overview.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Active Projects', value: active.length, sub: `${demoProjects.length} total` },
          { title: 'Outstanding', value: `€${outstanding.toLocaleString()}`, sub: 'Awaiting payment' },
          { title: 'Upcoming Deadlines', value: deadlines.length, sub: 'Next 30 days' },
          { title: 'Completed', value: demoProjects.filter(p => p.status === 'paid').length, sub: 'Fully paid' },
        ].map(card => (
          <div key={card.title} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: 'hsl(220,14%,15%)' }}>
            <p className="text-xs" style={{ color: MUTED }}>{card.title}</p>
            <p className="text-2xl font-semibold mt-1">{card.value}</p>
            <p className="text-xs mt-0.5" style={{ color: 'hsl(220,10%,45%)' }}>{card.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold">Upcoming Deadlines</h3>
          </div>
          <div className="divide-y" style={{ borderColor: BORDER }}>
            {deadlines.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3" style={{ borderColor: BORDER }}>
                <div>
                  <p className="text-sm font-medium">{p.clientName}</p>
                  <p className="text-xs" style={{ color: MUTED }}>Due {fmt(p.deliveryDate)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border" style={{ borderColor: BORDER }}>
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: BORDER }}>
            <h3 className="text-sm font-semibold">Outstanding Payments</h3>
          </div>
          <div>
            {demoProjects.filter(p => !p.fullPaymentReceived).map(p => {
              const owed = p.price - (p.depositReceived ? p.depositAmount : 0);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 border-b last:border-0" style={{ borderColor: BORDER }}>
                  <div>
                    <p className="text-sm font-medium">{p.clientName}</p>
                    <p className="text-xs" style={{ color: MUTED }}>{p.depositReceived ? 'Deposit received' : 'No deposit'}</p>
                  </div>
                  <span className="text-sm font-semibold">€{owed.toLocaleString()}</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

function NewProjectModal({ onClose }: { onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="rounded-2xl border w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 space-y-4" style={{ background: 'hsl(220,14%,13%)', borderColor: BORDER }}>
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold">Create New Project</h3>
          <button onClick={onClose} className="text-lg leading-none transition-colors" style={{ color: MUTED }}>✕</button>
        </div>
        <form onSubmit={e => { e.preventDefault(); onClose(); }} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Client Name *</label>
              <input defaultValue="Emma & James Thompson" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Client Email</label>
              <input type="email" placeholder="client@email.com" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 placeholder:opacity-40" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Project Type</label>
              <select defaultValue="wedding" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)' }}>
                <option value="wedding">Wedding</option>
                <option value="event">Event</option>
                <option value="commercial">Commercial</option>
                <option value="portrait">Portrait</option>
              </select>
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Price (€) *</label>
              <input type="number" defaultValue="3500" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Shoot Date *</label>
              <input type="date" defaultValue="2026-06-14" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties} />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Delivery Date *</label>
              <input type="date" defaultValue="2026-07-14" className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties} />
            </div>
            <div className="space-y-1.5 col-span-2">
              <label className="text-xs font-medium" style={{ color: MUTED }}>Notes</label>
              <textarea rows={3} defaultValue="Ceremony in Copenhagen at Frederiksberg Have. 400 photos expected." className="w-full rounded-lg border px-3 py-2 text-sm focus:outline-none focus:ring-1 resize-none" style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties} />
            </div>
          </div>
          <div className="flex justify-end gap-2 pt-1">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-lg border text-sm font-medium transition-colors hover:bg-white/[0.05]" style={{ borderColor: BORDER, color: MUTED }}>Cancel</button>
            <button type="submit" className="px-4 py-2 rounded-lg text-sm font-semibold transition-colors" style={{ background: 'hsl(40,90%,55%)', color: 'hsl(220,15%,10%)' }}>Create Project</button>
          </div>
        </form>
      </div>
    </div>
  );
}

function ProjectsTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const [modalOpen, setModalOpen] = useState(false);
  const statuses: Array<ProjectStatus | 'all'> = ['all', 'booked', 'shot', 'editing', 'delivered', 'approved', 'paid'];
  const filtered = demoProjects.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-4" style={{ background: SURFACE }}>
      {modalOpen && <NewProjectModal onClose={() => setModalOpen(false)} />}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Projects</h2>
          <p className="text-sm mt-0.5" style={{ color: MUTED }}>{demoProjects.length} total projects</p>
        </div>
        <button
          onClick={() => setModalOpen(true)}
          className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm font-medium transition-colors"
          style={{ background: 'hsl(40,90%,55%)', color: 'hsl(220,15%,10%)' }}
        >
          + New Project
        </button>
      </div>
      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1"
          style={{ borderColor: BORDER, background: 'hsl(220,14%,18%)', color: 'hsl(40,20%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties}
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className="px-2.5 py-1 rounded-full text-xs font-medium transition-colors capitalize"
              style={filter === s
                ? { backgroundColor: 'hsl(40,90%,55%)', color: 'hsl(220,15%,10%)' }
                : { backgroundColor: 'hsl(220,14%,20%)', color: MUTED }}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: BORDER, background: 'hsl(220,14%,15%)' }}>
              <th className="text-left text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Client</th>
              <th className="text-left text-xs font-medium px-4 py-3 hidden sm:table-cell" style={{ color: MUTED }}>Type</th>
              <th className="text-left text-xs font-medium px-4 py-3 hidden md:table-cell" style={{ color: MUTED }}>Delivery</th>
              <th className="text-left text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Price</th>
              <th className="text-left text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b last:border-0 transition-colors hover:bg-white/[0.03]" style={{ borderColor: BORDER }}>
                <td className="px-4 py-3 text-sm font-medium">{p.clientName}</td>
                <td className="px-4 py-3 hidden sm:table-cell"><TypeBadge type={p.projectType} /></td>
                <td className="px-4 py-3 text-sm hidden md:table-cell" style={{ color: MUTED }}>{fmt(p.deliveryDate)}</td>
                <td className="px-4 py-3 text-sm">€{p.price.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: MUTED }}>No projects found</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaymentsTab() {
  const total = demoProjects.reduce((s, p) => s + p.price, 0);
  const collected = demoProjects.reduce((s, p) => {
    if (p.fullPaymentReceived) return s + p.price;
    if (p.depositReceived) return s + p.depositAmount;
    return s;
  }, 0);
  const outstanding = total - collected;

  return (
    <div className="p-6 space-y-4" style={{ background: SURFACE }}>
      <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Payments</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Revenue', value: `€${total.toLocaleString()}`, color: '' },
          { label: 'Collected', value: `€${collected.toLocaleString()}`, color: 'hsl(152,60%,50%)' },
          { label: 'Outstanding', value: `€${outstanding.toLocaleString()}`, color: 'hsl(38,92%,60%)' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: BORDER, background: 'hsl(220,14%,15%)' }}>
            <p className="text-xs" style={{ color: MUTED }}>{s.label}</p>
            <p className="text-xl font-semibold mt-1" style={s.color ? { color: s.color } : {}}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: BORDER }}>
        <table className="w-full">
          <thead>
            <tr className="border-b" style={{ borderColor: BORDER, background: 'hsl(220,14%,15%)' }}>
              <th className="text-left text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Client</th>
              <th className="text-left text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Total</th>
              <th className="text-center text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Deposit</th>
              <th className="text-center text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Full Payment</th>
              <th className="text-right text-xs font-medium px-4 py-3" style={{ color: MUTED }}>Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {demoProjects.map(p => {
              const owed = p.fullPaymentReceived ? 0 : p.price - (p.depositReceived ? p.depositAmount : 0);
              return (
                <tr key={p.id} className="border-b last:border-0 transition-colors hover:bg-white/[0.03]" style={{ borderColor: BORDER }}>
                  <td className="px-4 py-3 text-sm font-medium">{p.clientName}</td>
                  <td className="px-4 py-3 text-sm">€{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm">
                    {p.depositReceived ? <span style={{ color: 'hsl(152,60%,50%)' }}>✓</span> : <span style={{ color: 'hsl(0,65%,55%)' }}>✗</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {p.fullPaymentReceived ? <span style={{ color: 'hsl(152,60%,50%)' }}>✓</span> : <span style={{ color: 'hsl(0,65%,55%)' }}>✗</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: owed > 0 ? 'hsl(38,92%,60%)' : 'hsl(152,60%,50%)' }}>
                    €{owed.toLocaleString()}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function ApprovalsTab() {
  const [state, setState] = useState<'pending' | 'approved' | 'changes'>('pending');
  return (
    <div className="p-6 space-y-4" style={{ background: SURFACE }}>
      <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Client Approval</h2>
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: BORDER }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Emma & James — Wedding Gallery</p>
            <p className="text-sm" style={{ color: MUTED }}>Delivered 15 Apr 2026</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${
            state === 'pending' ? 'bg-yellow-500/15 text-yellow-300 border-yellow-500/30' :
            state === 'approved' ? 'bg-green-500/15 text-green-300 border-green-500/30' :
            'bg-orange-500/15 text-orange-300 border-orange-500/30'
          }`}>
            {state === 'pending' ? 'Awaiting approval' : state === 'approved' ? '✓ Approved' : 'Changes requested'}
          </span>
        </div>
        <div className="rounded-lg px-3 py-2 text-xs font-mono" style={{ background: 'hsl(220,14%,18%)', color: MUTED }}>
          gigflowpro.com/approve/1?token=abc123
        </div>
        {state === 'pending' && (
          <div className="flex gap-2 pt-1">
            <button onClick={() => setState('approved')} className="flex-1 rounded-lg py-2 text-sm font-medium transition-colors" style={{ backgroundColor: 'hsl(152,60%,38%)', color: 'white' }}>
              Approve Gallery
            </button>
            <button onClick={() => setState('changes')} className="flex-1 rounded-lg border py-2 text-sm font-medium transition-colors hover:bg-white/[0.05]" style={{ borderColor: BORDER, color: MUTED }}>
              Request Changes
            </button>
          </div>
        )}
        {state !== 'pending' && (
          <button onClick={() => setState('pending')} className="text-xs transition-colors" style={{ color: 'hsl(220,10%,45%)' }}>↩ Reset demo</button>
        )}
      </div>
    </div>
  );
}

function RemindersTab() {
  const reminders = [
    { to: 'OSIA', subject: 'Payment reminder — OSIA', date: 'Apr 11, 2026 · 09:00', preview: 'Hi OSIA, this is a reminder that the full payment for your conference photography is still outstanding.' },
    { to: 'Emma & James', subject: 'Deposit reminder — Emma & James', date: 'Apr 9, 2026 · 10:15', preview: 'Hi Emma & James, this is a friendly reminder that your deposit has not yet been received.' },
    { to: 'TyrnaGroup', subject: 'Deposit reminder — TyrnaGroup', date: 'Apr 7, 2026 · 08:30', preview: 'Hi TyrnaGroup, your deposit for the upcoming shoot has not yet been received. Your shoot is in 14 days.' },
  ];
  return (
    <div className="p-6 space-y-4" style={{ background: SURFACE }}>
      <div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Auto Reminders</h2>
        <p className="text-sm mt-0.5" style={{ color: MUTED }}>Sent automatically. You never have to chase a client manually.</p>
      </div>
      <div className="space-y-3">
        {reminders.map(r => (
          <div key={r.subject} className="rounded-xl border p-4" style={{ borderColor: BORDER }}>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{r.subject}</p>
                <p className="text-xs" style={{ color: MUTED }}>To: {r.to}</p>
                <p className="text-xs mt-1" style={{ color: 'hsl(220,10%,45%)' }}>{r.preview}</p>
              </div>
              <span className="text-xs whitespace-nowrap" style={{ color: 'hsl(220,10%,45%)' }}>{r.date}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function LandingDemo() {
  const [activeTab, setActiveTab] = useState<'dashboard' | 'projects' | 'payments' | 'approvals' | 'reminders'>('dashboard');
  const tabs = [
    { key: 'dashboard', label: 'Dashboard' },
    { key: 'projects', label: 'Projects' },
    { key: 'payments', label: 'Payments' },
    { key: 'approvals', label: 'Approvals' },
    { key: 'reminders', label: 'Reminders' },
  ] as const;

  return (
    <div className="rounded-2xl border overflow-hidden shadow-2xl" style={{ borderColor: BORDER, boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5)' }}>
      {/* Browser bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ backgroundColor: SURFACE2, borderColor: BORDER }}>
        <div className="h-2.5 w-2.5 rounded-full bg-red-400/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-400/60" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-400/60" />
        <div className="mx-auto text-xs" style={{ color: 'hsl(220,10%,48%)' }}>app.gigflowpro.com/dashboard</div>
      </div>
      {/* Tab bar */}
      <div className="flex justify-center px-4 pt-3 pb-0 border-b" style={{ backgroundColor: SURFACE2, borderColor: BORDER }}>
        <div className="flex rounded-xl p-1 gap-1 overflow-x-auto" style={{ backgroundColor: 'hsl(220,14%,20%)' }}>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              style={activeTab === key
                ? { backgroundColor: 'hsl(220,14%,28%)', color: 'hsl(40,90%,60%)', boxShadow: '0 1px 3px rgba(0,0,0,0.3)' }
                : { color: MUTED }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
      {/* Content */}
      {activeTab === 'dashboard' && <DashboardTab />}
      {activeTab === 'projects' && <ProjectsTab />}
      {activeTab === 'payments' && <PaymentsTab />}
      {activeTab === 'approvals' && <ApprovalsTab />}
      {activeTab === 'reminders' && <RemindersTab />}
    </div>
  );
}

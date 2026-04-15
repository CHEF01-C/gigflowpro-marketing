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
  booked: 'bg-blue-100 text-blue-700 border-blue-200',
  shot: 'bg-amber-100 text-amber-700 border-amber-200',
  editing: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  delivered: 'bg-gray-100 text-gray-600 border-gray-200',
  approved: 'bg-green-100 text-green-700 border-green-200',
  paid: 'bg-green-100 text-green-800 border-green-300',
};

const TYPE_COLORS: Record<ProjectType, string> = {
  wedding: 'bg-pink-100 text-pink-700',
  event: 'bg-purple-100 text-purple-700',
  commercial: 'bg-blue-100 text-blue-700',
  portrait: 'bg-orange-100 text-orange-700',
};

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
    <div className="p-6 space-y-6 bg-white">
      <div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Dashboard</h2>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back. Here's your overview.</p>
      </div>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { title: 'Active Projects', value: active.length, sub: `${demoProjects.length} total` },
          { title: 'Outstanding', value: `€${outstanding.toLocaleString()}`, sub: 'Awaiting payment' },
          { title: 'Upcoming Deadlines', value: deadlines.length, sub: 'Next 30 days' },
          { title: 'Completed', value: demoProjects.filter(p => p.status === 'paid').length, sub: 'Fully paid' },
        ].map(card => (
          <div key={card.title} className="rounded-xl border p-4" style={{ borderColor: 'hsl(220,10%,90%)' }}>
            <p className="text-xs text-gray-500">{card.title}</p>
            <p className="text-2xl font-semibold mt-1">{card.value}</p>
            <p className="text-xs text-gray-400 mt-0.5">{card.sub}</p>
          </div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="rounded-xl border" style={{ borderColor: 'hsl(220,10%,90%)' }}>
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(220,10%,90%)' }}>
            <h3 className="text-sm font-semibold">Upcoming Deadlines</h3>
          </div>
          <div className="divide-y" style={{ '--tw-divide-opacity': '1' }}>
            {deadlines.map(p => (
              <div key={p.id} className="flex items-center justify-between p-3">
                <div>
                  <p className="text-sm font-medium">{p.clientName}</p>
                  <p className="text-xs text-gray-500">Due {fmt(p.deliveryDate)}</p>
                </div>
                <StatusBadge status={p.status} />
              </div>
            ))}
          </div>
        </div>
        <div className="rounded-xl border" style={{ borderColor: 'hsl(220,10%,90%)' }}>
          <div className="flex items-center justify-between p-4 border-b" style={{ borderColor: 'hsl(220,10%,90%)' }}>
            <h3 className="text-sm font-semibold">Outstanding Payments</h3>
          </div>
          <div>
            {demoProjects.filter(p => !p.fullPaymentReceived).map(p => {
              const owed = p.price - (p.depositReceived ? p.depositAmount : 0);
              return (
                <div key={p.id} className="flex items-center justify-between p-3 border-b last:border-0" style={{ borderColor: 'hsl(220,10%,90%)' }}>
                  <div>
                    <p className="text-sm font-medium">{p.clientName}</p>
                    <p className="text-xs text-gray-500">{p.depositReceived ? 'Deposit received' : 'No deposit'}</p>
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

function ProjectsTab() {
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState<ProjectStatus | 'all'>('all');
  const statuses: Array<ProjectStatus | 'all'> = ['all', 'booked', 'shot', 'editing', 'delivered', 'approved', 'paid'];
  const filtered = demoProjects.filter(p => {
    const matchSearch = p.clientName.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === 'all' || p.status === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="p-6 space-y-4 bg-white">
      <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Projects</h2>
      <div className="flex flex-wrap gap-2">
        <input
          className="rounded-lg border px-3 py-1.5 text-sm focus:outline-none focus:ring-1"
          style={{ borderColor: 'hsl(220,10%,90%)', '--tw-ring-color': 'hsl(40,90%,55%)' } as React.CSSProperties}
          placeholder="Search clients..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
        <div className="flex flex-wrap gap-1">
          {statuses.map(s => (
            <button key={s} onClick={() => setFilter(s)}
              className={`px-2.5 py-1 rounded-full text-xs font-medium transition-colors capitalize ${filter === s ? 'text-white' : 'bg-gray-100 text-gray-500 hover:text-gray-700'}`}
              style={filter === s ? { backgroundColor: 'hsl(40,90%,55%)' } : {}}>
              {s === 'all' ? 'All' : s}
            </button>
          ))}
        </div>
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(220,10%,90%)' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: 'hsl(220,10%,90%)' }}>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Client</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden sm:table-cell">Type</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3 hidden md:table-cell">Delivery</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Price</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(p => (
              <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'hsl(220,10%,90%)' }}>
                <td className="px-4 py-3 text-sm font-medium">{p.clientName}</td>
                <td className="px-4 py-3 hidden sm:table-cell"><TypeBadge type={p.projectType} /></td>
                <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{fmt(p.deliveryDate)}</td>
                <td className="px-4 py-3 text-sm">€{p.price.toLocaleString()}</td>
                <td className="px-4 py-3"><StatusBadge status={p.status} /></td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-sm text-gray-400">No projects found</td></tr>
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
    <div className="p-6 space-y-4 bg-white">
      <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Payments</h2>
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: 'Total Revenue', value: `€${total.toLocaleString()}`, color: '' },
          { label: 'Collected', value: `€${collected.toLocaleString()}`, color: 'text-green-600' },
          { label: 'Outstanding', value: `€${outstanding.toLocaleString()}`, color: 'text-amber-500' },
        ].map(s => (
          <div key={s.label} className="rounded-xl border p-4" style={{ borderColor: 'hsl(220,10%,90%)' }}>
            <p className="text-xs text-gray-500">{s.label}</p>
            <p className={`text-xl font-semibold mt-1 ${s.color}`}>{s.value}</p>
          </div>
        ))}
      </div>
      <div className="rounded-xl border overflow-hidden" style={{ borderColor: 'hsl(220,10%,90%)' }}>
        <table className="w-full">
          <thead>
            <tr className="border-b bg-gray-50" style={{ borderColor: 'hsl(220,10%,90%)' }}>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Client</th>
              <th className="text-left text-xs font-medium text-gray-500 px-4 py-3">Total</th>
              <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Deposit</th>
              <th className="text-center text-xs font-medium text-gray-500 px-4 py-3">Full Payment</th>
              <th className="text-right text-xs font-medium text-gray-500 px-4 py-3">Outstanding</th>
            </tr>
          </thead>
          <tbody>
            {demoProjects.map(p => {
              const owed = p.fullPaymentReceived ? 0 : p.price - (p.depositReceived ? p.depositAmount : 0);
              return (
                <tr key={p.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors" style={{ borderColor: 'hsl(220,10%,90%)' }}>
                  <td className="px-4 py-3 text-sm font-medium">{p.clientName}</td>
                  <td className="px-4 py-3 text-sm">€{p.price.toLocaleString()}</td>
                  <td className="px-4 py-3 text-center text-sm">
                    {p.depositReceived ? <span className="text-green-600">✓</span> : <span className="text-red-500">✗</span>}
                  </td>
                  <td className="px-4 py-3 text-center text-sm">
                    {p.fullPaymentReceived ? <span className="text-green-600">✓</span> : <span className="text-red-500">✗</span>}
                  </td>
                  <td className="px-4 py-3 text-right text-sm font-semibold" style={{ color: owed > 0 ? 'hsl(40,90%,45%)' : 'hsl(152,60%,42%)' }}>
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
    <div className="p-6 space-y-4 bg-white">
      <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Client Approval</h2>
      <div className="rounded-xl border p-5 space-y-4" style={{ borderColor: 'hsl(220,10%,90%)' }}>
        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium">Emma & James — Wedding Gallery</p>
            <p className="text-sm text-gray-500">Delivered 15 Apr 2026</p>
          </div>
          <span className={`rounded-full border px-3 py-1 text-xs font-medium ${state === 'pending' ? 'bg-yellow-50 text-yellow-700 border-yellow-200' : state === 'approved' ? 'bg-green-50 text-green-700 border-green-200' : 'bg-orange-50 text-orange-700 border-orange-200'}`}>
            {state === 'pending' ? 'Awaiting approval' : state === 'approved' ? '✓ Approved' : 'Changes requested'}
          </span>
        </div>
        <div className="rounded-lg bg-gray-50 px-3 py-2 text-xs text-gray-500 font-mono">
          gigflowpro.com/approve/1?token=abc123
        </div>
        {state === 'pending' && (
          <div className="flex gap-2 pt-1">
            <button onClick={() => setState('approved')} className="flex-1 rounded-lg py-2 text-sm font-medium text-white transition-colors" style={{ backgroundColor: 'hsl(152,60%,42%)' }}>
              Approve Gallery
            </button>
            <button onClick={() => setState('changes')} className="flex-1 rounded-lg border py-2 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors" style={{ borderColor: 'hsl(220,10%,90%)' }}>
              Request Changes
            </button>
          </div>
        )}
        {state !== 'pending' && (
          <button onClick={() => setState('pending')} className="text-xs text-gray-400 hover:text-gray-600 transition-colors">↩ Reset demo</button>
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
    <div className="p-6 space-y-4 bg-white">
      <div>
        <h2 className="text-xl font-semibold" style={{ fontFamily: 'Playfair Display, serif' }}>Auto Reminders</h2>
        <p className="text-sm text-gray-500 mt-0.5">Sent automatically. You never have to chase a client manually.</p>
      </div>
      <div className="space-y-3">
        {reminders.map(r => (
          <div key={r.subject} className="rounded-xl border p-4" style={{ borderColor: 'hsl(220,10%,90%)' }}>
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <p className="text-sm font-medium">{r.subject}</p>
                <p className="text-xs text-gray-500">To: {r.to}</p>
                <p className="text-xs text-gray-400 mt-1">{r.preview}</p>
              </div>
              <span className="text-xs text-gray-400 whitespace-nowrap">{r.date}</span>
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
    <div className="rounded-2xl border overflow-hidden shadow-2xl" style={{ borderColor: 'hsl(220,10%,90%)', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.1)' }}>
      {/* Browser bar */}
      <div className="flex items-center gap-1.5 px-4 py-3 border-b" style={{ backgroundColor: 'hsl(220,10%,96%)', borderColor: 'hsl(220,10%,90%)' }}>
        <div className="h-2.5 w-2.5 rounded-full bg-red-300" />
        <div className="h-2.5 w-2.5 rounded-full bg-yellow-300" />
        <div className="h-2.5 w-2.5 rounded-full bg-green-300" />
        <div className="mx-auto text-xs text-gray-400">gigflowpro.com/dashboard</div>
      </div>
      {/* Tab bar */}
      <div className="flex justify-center px-4 pt-3 pb-0 border-b" style={{ backgroundColor: 'hsl(220,10%,96%)', borderColor: 'hsl(220,10%,90%)' }}>
        <div className="flex rounded-xl p-1 gap-1 overflow-x-auto" style={{ backgroundColor: 'hsl(220,10%,92%)' }}>
          {tabs.map(({ key, label }) => (
            <button
              key={key}
              onClick={() => setActiveTab(key)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-colors whitespace-nowrap"
              style={activeTab === key
                ? { backgroundColor: 'white', color: 'hsl(40,90%,45%)', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }
                : { color: 'hsl(220,10%,50%)' }}
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

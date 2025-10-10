

export default function AdminOverviewPage() {
return (
<div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
{[
{ kpi: "Active listings", val: "–" },
{ kpi: "Pending receipts", val: "–" },
{ kpi: "New signups", val: "–" },
{ kpi: "Open reports", val: "–" },
].map(({ kpi, val }) => (
<div key={kpi} className="rounded-2xl border border-[var(--color-hover-blue)] bg-[var(--color-white)] p-4 shadow-sm">
<div className="text-sm text-[var(--color-medium-gray)]">{kpi}</div>
<div className="mt-1 text-2xl font-semibold text-[var(--color-royal-blue)]">{val}</div>
</div>
))}
</div>
);
}
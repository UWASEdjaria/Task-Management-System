export default function StatCards() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card title="Today's Tasks"  value="0" sub="Due today"       />
      <Card title="Week Deadlines" value="0" sub="This week"       />
      <Card title="Overdue Tasks"  value="0" sub="Needs attention" />
    </div>
  )
}

function Card({ title, value, sub }: { title: string; value: string; sub: string }) {
  return (
    <div className="bg-white rounded-xl border border-gray-300 shadow-sm p-8">
      <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-widest mb-4">{title}</p>
      <h2 className="text-7xl font-light text-gray-900 leading-none mb-3">{value}</h2>
      <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">{sub}</p>
    </div>
  )
}

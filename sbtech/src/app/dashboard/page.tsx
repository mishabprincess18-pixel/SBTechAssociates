"use client";
import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

const data = [
  { month: "Jan", matters: 12 },
  { month: "Feb", matters: 18 },
  { month: "Mar", matters: 10 },
  { month: "Apr", matters: 22 },
  { month: "May", matters: 28 },
  { month: "Jun", matters: 24 },
];

export default function DashboardPage() {
  const { data: session } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (!session) {
      router.replace("/auth/signin");
    }
  }, [session, router]);

  const query = useQuery({
    queryKey: ["kpis"],
    queryFn: async () => ({ activeClients: 42, openMatters: 17, avgResponseTime: "2h" }),
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-10">
      <h1 className="text-3xl font-serif">Dashboard</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Stat label="Active Clients" value={query.data?.activeClients ?? "-"} />
        <Stat label="Open Matters" value={query.data?.openMatters ?? "-"} />
        <Stat label="Avg. Response Time" value={query.data?.avgResponseTime ?? "-"} />
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ left: 0, right: 0, top: 10, bottom: 0 }}>
            <defs>
              <linearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#0b5ea8" stopOpacity={0.6} />
                <stop offset="95%" stopColor="#0b5ea8" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="matters" stroke="#0b5ea8" fill="url(#grad)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="rounded-xl border p-6 bg-white/60 dark:bg-neutral-900/60">
      <div className="text-sm text-neutral-600 dark:text-neutral-400">{label}</div>
      <div className="text-2xl font-semibold mt-1">{value}</div>
    </div>
  );
}
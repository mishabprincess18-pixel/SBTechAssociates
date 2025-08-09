import { Card, CardContent, CardHeader } from "@/components/ui/card";

export function ServiceCard({ title, desc }: { title: string; desc: string }) {
  return (
    <Card>
      <CardHeader>
        <h3 className="font-medium text-lg">{title}</h3>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-neutral-700 dark:text-neutral-300">{desc}</p>
      </CardContent>
    </Card>
  );
}
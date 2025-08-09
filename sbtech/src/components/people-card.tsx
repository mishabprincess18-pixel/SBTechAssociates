import Image from "next/image";
import { Card, CardContent } from "@/components/ui/card";

export function PeopleCard({ name, role, expertise, img }: { name: string; role: string; expertise: string; img: string }) {
  return (
    <Card className="text-center">
      <div className="mx-auto w-28 h-28 relative rounded-full overflow-hidden mb-4">
        <Image src={img} alt={name} fill className="object-cover" />
      </div>
      <CardContent>
        <h3 className="font-medium">{name}</h3>
        <p className="text-sm text-neutral-600 dark:text-neutral-400">{role}</p>
        <p className="mt-2 text-sm">{expertise}</p>
      </CardContent>
    </Card>
  );
}
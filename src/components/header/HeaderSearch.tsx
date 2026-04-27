import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";

export function HeaderSearch({
  value,
  onChange,
}: Readonly<{ value: string; onChange: (v: string) => void }>) {
  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
      <Input
        name="search"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder="What are you looking for?"
        className="rounded-full pl-9"
      />
    </div>
  );
}

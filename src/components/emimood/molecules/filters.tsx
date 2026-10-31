import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export const ALL = "__all__";

type SimpleSelectProps = {
  id: string;
  value: string | undefined;
  onChange: (v: string | undefined) => void;
  options: { value: string; label: string }[];
  placeholder: string;
  allLabel?: string | undefined;
  disabled?: boolean | undefined;
  className?: string | undefined;
};

export function SimpleSelect({
  id,
  value,
  onChange,
  options,
  placeholder,
  allLabel,
  disabled,
  className,
}: SimpleSelectProps) {
  return (
    <Select
      value={value ?? (allLabel ? ALL : "")}
      onValueChange={(v) => onChange(v === ALL ? undefined : v)}
      disabled={disabled ?? false}
    >
      <SelectTrigger id={id} className={cn("w-full sm:w-52", className)} aria-label={placeholder}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent>
        {allLabel && <SelectItem value={ALL}>{allLabel}</SelectItem>}
        {options.map((o) => (
          <SelectItem key={o.value} value={o.value}>
            {o.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

type SearchInputProps = {
  value: string;
  onChange: (v: string) => void;
  label?: string | undefined;
};

export function SearchInput({ value, onChange, label = "Rechercher" }: SearchInputProps) {
  return (
    <Input
      type="search"
      aria-label={label}
      placeholder={`${label}…`}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="w-full sm:w-64"
    />
  );
}

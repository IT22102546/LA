// import { LucideIcon } from "lucide-react";
import { Card } from "../Components/ui/card";

const variantStyles = {
  primary: "bg-primary",
  success: "bg-green-500",
  warning: "bg-red-500",
};

export function StatCard({ icon: Icon, label, count, variant }) {
  return (
    <Card className="p-4 flex items-center gap-3 hover:shadow-md transition-shadow">
      <div className={`${variantStyles[variant]} p-3 rounded-full`}>
        <Icon className="h-5 w-5 text-white" />
      </div>
      <div>
        <p className="text-sm text-muted-foreground">{label}</p>
        <p className="text-2xl font-bold">{count}</p>
      </div>
    </Card>
  );
}

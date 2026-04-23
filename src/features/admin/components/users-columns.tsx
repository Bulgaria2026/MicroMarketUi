import type { Customer, CustomerType, UserRole, UserStatus } from "@/features/admin/types/user";
import type { ColumnDef } from "@tanstack/react-table";

const ROLE_CLASSES: Record<UserRole, string> = {
  ADMINISTRATOR: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  USER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const STATUS_CLASSES: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  INACTIVE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

const TYPE_CLASSES: Record<CustomerType, string> = {
  PROFILE: "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
  GUEST: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400",
};

export const usersColumns: ColumnDef<Customer>[] = [
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <span className="text-sm">{row.original.email}</span>,
  },
  {
    accessorKey: "role",
    header: "Role",
    cell: ({ row }) => {
      const role = row.original.role;
      if (!role) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_CLASSES[role]}`}>
          {role}
        </span>
      );
    },
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.original.status;
      if (!status) return <span className="text-muted-foreground text-xs">—</span>;
      return (
        <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[status]}`}>
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "type",
    header: "Type",
    cell: ({ row }) => (
      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${TYPE_CLASSES[row.original.type]}`}>
        {row.original.type}
      </span>
    ),
  },
  {
    accessorKey: "points",
    header: "Points",
    cell: ({ row }) => {
      const points = row.original.points;
      if (points === null) return <span className="text-muted-foreground text-xs">—</span>;
      return <span className="text-sm tabular-nums">{points.toLocaleString()}</span>;
    },
  },
  {
    accessorKey: "createdAt",
    header: "Joined",
    cell: ({ row }) => (
      <span className="text-muted-foreground text-sm">
        {new Date(row.original.createdAt).toLocaleDateString("en-GB", {
          day: "2-digit",
          month: "short",
          year: "numeric",
        })}
      </span>
    ),
  },
];

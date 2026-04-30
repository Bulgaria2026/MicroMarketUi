import { ErrorDisplay } from "@/components/ErrorDisplay";
import { blurFirst, useAppForm } from "@/components/form/form";
import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { userKeys, userService } from "@/features/admin/services/user-service";
import type { Profile, UserRole, UserStatus } from "@/features/admin/types/user";
import { emailField } from "@/features/auth/schemas";
import { getApiErrorMessage } from "@/lib/api";
import { Route } from "@/routes/admin/users/$userId";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useParams } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";

const ROLE_CLASSES: Record<UserRole, string> = {
  ADMINISTRATOR: "bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300",
  USER: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
};

const STATUS_CLASSES: Record<UserStatus, string> = {
  ACTIVE: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  INACTIVE: "bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300",
};

function DetailRow({ label, children }: Readonly<{ label: string; children: React.ReactNode }>) {
  return (
    <div>
      <p className="text-muted-foreground text-sm mb-0.5">{label}</p>
      <div className="text-sm">{children}</div>
    </div>
  );
}

function GuestDetail({ email, createdAt }: Readonly<{ email: string; createdAt?: string }>) {
  return (
    <div className="rounded-lg border bg-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
      <DetailRow label="Email">{email}</DetailRow>
      <DetailRow label="Type">
        <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400">
          GUEST
        </span>
      </DetailRow>
      {createdAt && (
        <DetailRow label="Joined">
          {new Date(createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </DetailRow>
      )}
      <DetailRow label="Role">
        <span className="text-muted-foreground">—</span>
      </DetailRow>
      <DetailRow label="Status">
        <span className="text-muted-foreground">—</span>
      </DetailRow>
      <DetailRow label="Points">
        <span className="text-muted-foreground">—</span>
      </DetailRow>
    </div>
  );
}

function ProfileEditForm({ userId, profile }: Readonly<{ userId: string; profile: Profile }>) {
  const queryClient = useQueryClient();

  const patchMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: (patch: { email?: string; role?: UserRole; status?: UserStatus }) => userService.patch(userId, patch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
      queryClient.invalidateQueries({ queryKey: userKeys.all });
    },
  });

  const form = useAppForm({
    defaultValues: {
      email: profile.user.email,
      role: profile.user.role as string,
      status: profile.user.status as string,
    },
    onSubmit: async ({ value }) => {
      const patch: { email?: string; role?: UserRole; status?: UserStatus } = {};
      if (value.email !== profile.user.email) patch.email = value.email;
      if (value.role !== profile.user.role) patch.role = value.role as UserRole;
      if (value.status !== profile.user.status) patch.status = value.status as UserStatus;
      if (Object.keys(patch).length > 0) await patchMutation.mutateAsync(patch);
    },
  });

  return (
    <form
      noValidate
      onSubmit={e => {
        e.preventDefault();
        e.stopPropagation();
        form.handleSubmit();
      }}
    >
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="text-base font-medium">Edit</h3>
        <div className="flex flex-wrap gap-4 items-start">
          <form.AppField name="email" validators={blurFirst(emailField)}>
            {({ TextField }) => <TextField label="Email" type="email" placeholder="user@example.com" />}
          </form.AppField>

          <form.Field name="role">
            {field => (
              <Field className="w-auto">
                <FieldLabel>Role</FieldLabel>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger className="h-8 text-sm w-44">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USER">User</SelectItem>
                    <SelectItem value="ADMINISTRATOR">Administrator</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>

          <form.Field name="status">
            {field => (
              <Field className="w-auto">
                <FieldLabel>Status</FieldLabel>
                <Select value={field.state.value} onValueChange={field.handleChange}>
                  <SelectTrigger className="h-8 text-sm w-36">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ACTIVE">Active</SelectItem>
                    <SelectItem value="INACTIVE">Inactive</SelectItem>
                  </SelectContent>
                </Select>
              </Field>
            )}
          </form.Field>
        </div>

        {patchMutation.isError && (
          <FieldError>{getApiErrorMessage(patchMutation.error, "Failed to update user")}</FieldError>
        )}

        <form.Subscribe
          selector={state => ({ isDirty: state.isDirty, isSubmitting: state.isSubmitting, canSubmit: state.canSubmit })}
        >
          {({ isDirty, isSubmitting, canSubmit }) => (
            <Button type="submit" size="sm" disabled={!isDirty || !canSubmit || isSubmitting}>
              {isSubmitting ? "Saving…" : "Save changes"}
            </Button>
          )}
        </form.Subscribe>
      </div>
    </form>
  );
}

function PointsAdjustmentForm({ userId, currentPoints }: Readonly<{ userId: string; currentPoints: number }>) {
  const queryClient = useQueryClient();
  const [value, setValue] = useState(String(currentPoints));

  const updateMutation = useMutation({
    meta: { suppressGlobalError: true },
    mutationFn: (points: number) => userService.updateProfilePoints(userId, points),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: userKeys.profile(userId) });
    },
  });

  const isDirty = value !== String(currentPoints);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const points = Number.parseInt(value);
    if (Number.isNaN(points) || points < 0) return;
    updateMutation.mutate(points);
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="rounded-lg border bg-card p-6 space-y-4">
        <h3 className="text-base font-medium">Adjust Points</h3>
        <div className="flex items-end gap-3">
          <Field className="w-auto">
            <FieldLabel>Points Balance</FieldLabel>
            <Input
              type="number"
              min="0"
              value={value}
              onChange={e => setValue(e.target.value)}
              className="h-8 text-sm w-36"
            />
          </Field>
          <Button type="submit" size="sm" disabled={!isDirty || updateMutation.isPending}>
            {updateMutation.isPending ? "Saving…" : "Save"}
          </Button>
        </div>
        {updateMutation.isError && (
          <FieldError>{getApiErrorMessage(updateMutation.error, "Failed to update points")}</FieldError>
        )}
      </div>
    </form>
  );
}

function ProfileDetail({ userId }: Readonly<{ userId: string }>) {
  const {
    data: profile,
    isLoading,
    isError,
  } = useQuery({
    queryKey: userKeys.profile(userId),
    queryFn: () => userService.findProfileById(userId),
  });

  if (isLoading) {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }, (_, i) => `skeleton-row-${i}`).map(rowKey => (
          <Skeleton key={rowKey} className="h-5 w-1/3" />
        ))}
      </div>
    );
  }

  if (isError || !profile) {
    return <ErrorDisplay />;
  }

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card p-6 grid grid-cols-1 sm:grid-cols-2 gap-4">
        <DetailRow label="ID">
          <span className="font-mono text-xs">{profile.user.id}</span>
        </DetailRow>
        <DetailRow label="Email">{profile.user.email}</DetailRow>
        <DetailRow label="Type">
          <span className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300">
            PROFILE
          </span>
        </DetailRow>
        <DetailRow label="Points">
          <span className="tabular-nums">{profile.points.toLocaleString()}</span>
        </DetailRow>
        <DetailRow label="Role">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${ROLE_CLASSES[profile.user.role]}`}
          >
            {profile.user.role}
          </span>
        </DetailRow>
        <DetailRow label="Status">
          <span
            className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_CLASSES[profile.user.status]}`}
          >
            {profile.user.status}
          </span>
        </DetailRow>
        <DetailRow label="Joined">
          {new Date(profile.createdAt).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
        </DetailRow>
      </div>

      <ProfileEditForm key={profile.user.id} userId={userId} profile={profile} />
      <PointsAdjustmentForm key={`pts-${profile.user.id}`} userId={userId} currentPoints={profile.points} />
    </div>
  );
}

export function AdminUserDetail() {
  const { userId } = useParams({ from: "/admin/users/$userId" });
  const search = Route.useSearch();

  const isGuest = search.type === "GUEST";

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Button variant="ghost" size="icon-sm" asChild>
          <Link to="/admin/users">
            <ArrowLeft />
          </Link>
        </Button>
        <h2 className="text-2xl font-semibold">User Details</h2>
      </div>

      {isGuest ? (
        <GuestDetail email={search.email ?? userId} createdAt={search.createdAt} />
      ) : (
        <ProfileDetail userId={userId} />
      )}
    </div>
  );
}

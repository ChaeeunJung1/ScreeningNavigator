"use client";

import { useTransition } from "react";
import { Button } from "~/components/ui/button";
import { deleteUserAccount, setAdminStatus } from "./actions";

export function AdminRowActions({
  userId,
  email,
  isAdmin,
  isSelf,
}: {
  userId: string;
  email: string | null;
  isAdmin: boolean;
  isSelf: boolean;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggleAdmin() {
    const next = !isAdmin;
    const message = next
      ? `Grant admin access to ${email ?? "this user"}?`
      : `Remove admin access from ${email ?? "this user"}?`;

    if (!window.confirm(message)) return;

    startTransition(async () => {
      try {
        await setAdminStatus(userId, next);
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Failed.");
      }
    });
  }

  function handleDelete() {
    const message = `Permanently delete ${email ?? "this user"}? This cannot be undone.`;
    if (!window.confirm(message)) return;

    startTransition(async () => {
      try {
        await deleteUserAccount(userId);
      } catch (error) {
        window.alert(error instanceof Error ? error.message : "Failed.");
      }
    });
  }

  return (
    <div className="flex gap-2">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={isPending || isSelf}
        onClick={handleToggleAdmin}
      >
        {isAdmin ? "Remove admin" : "Make admin"}
      </Button>
      <Button
        type="button"
        variant="destructive"
        size="sm"
        disabled={isPending || isSelf}
        onClick={handleDelete}
      >
        Delete
      </Button>
    </div>
  );
}

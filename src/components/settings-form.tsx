"use client";

import { useState } from "react";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";
import { US_STATES } from "~/lib/screening-data";

const LANGUAGES = ["English", "Spanish", "Vietnamese", "Chinese"] as const;

export function SettingsForm({ email }: { email: string }) {
  const [displayName, setDisplayName] = useState("");
  const [defaultState, setDefaultState] = useState("");
  const [language, setLanguage] =
    useState<(typeof LANGUAGES)[number]>("English");
  const [plainLanguage, setPlainLanguage] = useState(true);
  const [notifications, setNotifications] = useState({
    onSave: true,
    onProgramUpdate: true,
    onRightsChange: false,
  });
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [saved, setSaved] = useState(false);

  const stateName =
    US_STATES.find((s) => s.code === defaultState)?.name ?? "Not set";

  return (
    <div className="mx-auto flex max-w-6xl flex-col gap-6 p-4 py-6">
      <div className="flex flex-col gap-1">
        <p className="text-sm font-semibold text-primary uppercase tracking-wide">
          Account and app preferences
        </p>
        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-muted-foreground">
          Manage your profile, language, and saved screening-check data. You can
          review privacy details before making changes.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="flex flex-col gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Profile</CardTitle>
            </CardHeader>
            <CardContent className="grid gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="settings-name">Display name</Label>
                <Input
                  id="settings-name"
                  value={displayName}
                  onChange={(e) => {
                    setDisplayName(e.target.value);
                    setSaved(false);
                  }}
                  placeholder="Your name"
                />
                <p className="text-xs text-muted-foreground">
                  Used for saved progress.
                </p>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="settings-email">Email address</Label>
                <Input id="settings-email" value={email} readOnly disabled />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="settings-state">Default state</Label>
                <select
                  id="settings-state"
                  value={defaultState}
                  onChange={(e) => {
                    setDefaultState(e.target.value);
                    setSaved(false);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  <option value="">Select your state</option>
                  {US_STATES.map((s) => (
                    <option key={s.code} value={s.code}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Preferences</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="settings-language">Preferred language</Label>
                <select
                  id="settings-language"
                  value={language}
                  onChange={(e) => {
                    setLanguage(e.target.value as (typeof LANGUAGES)[number]);
                    setSaved(false);
                  }}
                  className="h-9 w-full rounded-md border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
                >
                  {LANGUAGES.map((l) => (
                    <option key={l} value={l}>
                      {l}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex items-center justify-between gap-4 border-t border-border pt-4">
                <span className="text-sm">Show guidance in plain language</span>
                <Switch
                  checked={plainLanguage}
                  onCheckedChange={() => {
                    setPlainLanguage((v) => !v);
                    setSaved(false);
                  }}
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Notifications</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col divide-y divide-border">
              <NotificationRow
                label="Email when screening check is saved"
                checked={notifications.onSave}
                onCheckedChange={() =>
                  setNotifications((p) => ({ ...p, onSave: !p.onSave }))
                }
              />
              <NotificationRow
                label="Email when program matches update"
                checked={notifications.onProgramUpdate}
                onCheckedChange={() =>
                  setNotifications((p) => ({
                    ...p,
                    onProgramUpdate: !p.onProgramUpdate,
                  }))
                }
              />
              <NotificationRow
                label="Email when rights guidance changes"
                checked={notifications.onRightsChange}
                onCheckedChange={() =>
                  setNotifications((p) => ({
                    ...p,
                    onRightsChange: !p.onRightsChange,
                  }))
                }
              />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Data & privacy</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-4">
              <p className="text-sm text-muted-foreground">
                We only store the information you choose to save. Results are
                based on your answers and verified public sources.
              </p>
              <label className="flex items-start gap-2 text-sm">
                <input
                  type="checkbox"
                  checked={agreedToTerms}
                  onChange={() => setAgreedToTerms((v) => !v)}
                  className="mt-0.5 accent-primary"
                />
                <span>
                  I agree to the{" "}
                  <a href="/rights" className="text-primary underline">
                    Terms of Use
                  </a>{" "}
                  and{" "}
                  <a
                    href="mailto:support@screeningnavigator.com"
                    className="text-primary underline"
                  >
                    Privacy Policy
                  </a>
                </span>
              </label>
              <div>
                <Button variant="destructive">Delete saved progress</Button>
                <p className="mt-1 text-xs text-muted-foreground">
                  You can delete saved progress at any time.
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={() => setSaved(true)}>
              {saved ? "Saved" : "Save changes"}
            </Button>
          </div>
        </div>

        <div className="flex flex-col gap-6 lg:sticky lg:top-6 lg:h-fit">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Your current setup</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col gap-2 text-sm">
              <SetupRow label="State" value={stateName} />
              <SetupRow label="Language" value={language} />
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">What is saved</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="flex flex-col gap-1 text-sm text-muted-foreground">
                <li>State and insurance answers</li>
                <li>Income and household size</li>
                <li>Program match history</li>
                <li>Billing rights guidance</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Help and support</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">
                Questions about your data or settings? Contact{" "}
                <a
                  href="mailto:support@screeningnavigator.com"
                  className="text-primary underline hover:no-underline"
                >
                  support@screeningnavigator.com
                </a>
                .
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

function NotificationRow({
  label,
  checked,
  onCheckedChange,
}: {
  label: string;
  checked: boolean;
  onCheckedChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="text-sm">{label}</span>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  );
}

function SetupRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}

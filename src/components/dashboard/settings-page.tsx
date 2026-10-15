"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import {
  Bell,
  Check,
  Laptop,
  Lock,
  Smartphone,
  Store,
  Upload,
  UserRound,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { panelCard, Switch } from "@/components/dashboard/page-kit";

const sections = [
  { id: "profile", label: "Profile", description: "Photo and personal details", icon: UserRound },
  { id: "store", label: "Store", description: "Name, currency and region", icon: Store },
  { id: "notifications", label: "Notifications", description: "What we tell you about", icon: Bell },
  { id: "security", label: "Security", description: "Password and sessions", icon: Lock },
] as const;

type SectionId = (typeof sections)[number]["id"];

const fieldClass =
  "h-10 w-full rounded-xl border border-white/[.12] bg-[#1f1f1f] px-3.5 text-[13px] text-white outline-none transition-colors placeholder:text-white/30 [color-scheme:dark] focus:border-[#f35177]/70 disabled:text-white/45";

function Field({ label, hint, children }: { label: string; hint?: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-[11px] font-medium text-white/60">{label}</span>
      {children}
      {hint && <span className="mt-1.5 block text-[10px] text-white/35">{hint}</span>}
    </label>
  );
}

function SectionHeader({ title, description }: { title: string; description: string }) {
  return (
    <div className="border-b border-white/[.08] px-5 py-5 sm:px-7">
      <h2 className="text-[clamp(15px,1.5vw,18px)] font-medium text-white">{title}</h2>
      <p className="mt-1 text-[11px] text-white/45">{description}</p>
    </div>
  );
}

function SaveBar({ saved, label = "Save changes" }: { saved: boolean; label?: string }) {
  return (
    <div className="flex items-center justify-end gap-3 border-t border-white/[.08] px-5 py-4 sm:px-7">
      {saved && (
        <span role="status" className="mr-auto flex items-center gap-1.5 text-[11px] text-[#2fe4c0]">
          <Check className="size-3.5" />
          Saved
        </span>
      )}
      <Button
        type="reset"
        variant="outline"
        className="h-9 rounded-full border-white/20 bg-transparent px-4 text-xs text-white/80 hover:bg-white/[.06]"
      >
        Cancel
      </Button>
      <Button
        type="submit"
        className="h-9 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-4 text-xs text-white shadow-[0_8px_20px_rgba(240,68,121,.25)] hover:brightness-110"
      >
        {label}
      </Button>
    </div>
  );
}

function useSaved() {
  const [saved, setSaved] = useState(false);
  const timer = useRef<number | undefined>(undefined);
  useEffect(() => () => window.clearTimeout(timer.current), []);
  return {
    saved,
    onSubmit(event: FormEvent<HTMLFormElement>) {
      event.preventDefault();
      setSaved(true);
      window.clearTimeout(timer.current);
      timer.current = window.setTimeout(() => setSaved(false), 2200);
    },
  };
}

function ProfileSection() {
  const { saved, onSubmit } = useSaved();
  const [photo, setPhoto] = useState<string | null>(
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=160&q=80",
  );
  const fileInput = useRef<HTMLInputElement>(null);

  return (
    <form onSubmit={onSubmit}>
      <SectionHeader title="Profile" description="Update your photo and personal details." />
      <div className="space-y-6 px-5 py-6 sm:px-7">
        <div className="flex flex-wrap items-center gap-4">
          <Avatar className="size-16">
            {photo && <AvatarImage src={photo} alt="" />}
            <AvatarFallback className="bg-[#80545e] text-lg text-white">I</AvatarFallback>
          </Avatar>
          <div className="mr-auto">
            <p className="text-sm font-semibold text-white">Ismail</p>
            <p className="text-[11px] text-white/45">Store owner</p>
          </div>
          <input
            ref={fileInput}
            type="file"
            accept="image/*"
            className="sr-only"
            aria-label="Upload a profile photo"
            onChange={(event) => {
              const file = event.target.files?.[0];
              if (file) setPhoto(URL.createObjectURL(file));
            }}
          />
          <Button
            type="button"
            variant="outline"
            className="h-9 rounded-full border-white/20 bg-transparent px-4 text-xs text-white/85 hover:bg-white/[.06]"
            onClick={() => fileInput.current?.click()}
          >
            <Upload className="size-3.5" />
            Change photo
          </Button>
          <Button
            type="button"
            variant="ghost"
            className="h-9 rounded-full px-3 text-xs text-white/55 hover:text-white"
            onClick={() => setPhoto(null)}
          >
            Remove
          </Button>
        </div>
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
          <Field label="Full name">
            <input className={fieldClass} name="name" autoComplete="name" defaultValue="Ismail" />
          </Field>
          <Field label="Email">
            <input className={fieldClass} name="email" type="email" autoComplete="email" defaultValue="ismail@brinhildr.com" />
          </Field>
          <Field label="Phone">
            <input className={fieldClass} name="phone" type="tel" autoComplete="tel" placeholder="+1 555 0100" />
          </Field>
          <Field label="Role" hint="Only the account owner can change roles.">
            <input className={fieldClass} defaultValue="Store owner" disabled />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Bio">
              <textarea
                name="bio"
                rows={3}
                className={`${fieldClass} h-auto resize-none py-2.5`}
                defaultValue="Running Brinhildr, a fashion and accessories store."
              />
            </Field>
          </div>
        </div>
      </div>
      <SaveBar saved={saved} />
    </form>
  );
}

function StoreSection() {
  const { saved, onSubmit } = useSaved();
  return (
    <form onSubmit={onSubmit}>
      <SectionHeader title="Store" description="How your store appears to clients and in reports." />
      <div className="grid grid-cols-1 gap-5 px-5 py-6 sm:grid-cols-2 sm:px-7">
        <Field label="Store name">
          <input className={fieldClass} name="storeName" defaultValue="Brinhildr" />
        </Field>
        <Field label="Store URL">
          <input className={fieldClass} name="storeUrl" defaultValue="brinhildr.store" />
        </Field>
        <Field label="Currency">
          <select className={fieldClass} name="currency" defaultValue="USD">
            <option value="USD">US Dollar (USD)</option>
            <option value="EUR">Euro (EUR)</option>
            <option value="GBP">British Pound (GBP)</option>
            <option value="MAD">Moroccan Dirham (MAD)</option>
          </select>
        </Field>
        <Field label="Time zone">
          <select className={fieldClass} name="timezone" defaultValue="Europe/London">
            <option value="America/Los_Angeles">Pacific Time (US)</option>
            <option value="America/New_York">Eastern Time (US)</option>
            <option value="Europe/London">London</option>
            <option value="Africa/Casablanca">Casablanca</option>
          </select>
        </Field>
        <Field label="Order number prefix" hint="Shown before every order number, like #624.">
          <input className={fieldClass} name="prefix" defaultValue="#" />
        </Field>
        <Field label="Low stock alert at">
          <input className={fieldClass} name="lowStock" type="number" min={0} defaultValue={200} />
        </Field>
      </div>
      <SaveBar saved={saved} />
    </form>
  );
}

const notificationGroups = [
  {
    title: "Email",
    items: [
      { id: "orders", label: "Order updates", description: "New orders, cancellations and refunds." },
      { id: "clients", label: "New clients", description: "When someone creates an account." },
      { id: "stock", label: "Low stock alerts", description: "When a product drops below your alert level." },
      { id: "report", label: "Weekly report", description: "A summary of sales every Monday." },
    ],
  },
  {
    title: "In the app",
    items: [
      { id: "messages", label: "Messages", description: "Replies from clients and sellers." },
      { id: "promotions", label: "Promotion performance", description: "When a promotion hits its limit or ends." },
    ],
  },
];

function NotificationsSection() {
  const { saved, onSubmit } = useSaved();
  const [enabled, setEnabled] = useState<Record<string, boolean>>({
    orders: true,
    clients: true,
    stock: true,
    report: false,
    messages: true,
    promotions: false,
  });

  return (
    <form onSubmit={onSubmit}>
      <SectionHeader title="Notifications" description="Choose what Brinhildr tells you about, and where." />
      <div className="space-y-6 px-5 py-6 sm:px-7">
        {notificationGroups.map((group) => (
          <div key={group.title}>
            <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[.08em] text-white/40">{group.title}</h3>
            <div className="divide-y divide-white/[.07] rounded-2xl border border-white/[.08] bg-white/[.02]">
              {group.items.map((item) => (
                <div key={item.id} className="flex items-center justify-between gap-4 px-4 py-3.5">
                  <div className="min-w-0">
                    <p className="text-[13px] font-medium text-white/90">{item.label}</p>
                    <p className="mt-0.5 text-[10px] text-white/45">{item.description}</p>
                  </div>
                  <Switch
                    checked={enabled[item.id]}
                    onChange={(checked) => setEnabled((current) => ({ ...current, [item.id]: checked }))}
                    label={`${group.title} notifications for ${item.label}`}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
      <SaveBar saved={saved} />
    </form>
  );
}

function SecuritySection() {
  const { saved, onSubmit } = useSaved();
  const [twoFactor, setTwoFactor] = useState(true);
  const [sessions, setSessions] = useState([
    { id: "mac", device: "MacBook Pro · Chrome", place: "London, UK", time: "This device", icon: Laptop, current: true },
    { id: "iphone", device: "iPhone 15 · Safari", place: "London, UK", time: "2 hours ago", icon: Smartphone, current: false },
    { id: "ipad", device: "iPad Air · Safari", place: "Manchester, UK", time: "3 days ago", icon: Smartphone, current: false },
  ]);

  return (
    <form onSubmit={onSubmit}>
      <SectionHeader title="Security" description="Keep your account safe." />
      <div className="space-y-7 px-5 py-6 sm:px-7">
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
          <Field label="Current password">
            <input className={fieldClass} type="password" name="currentPassword" autoComplete="current-password" />
          </Field>
          <Field label="New password" hint="At least 8 characters.">
            <input className={fieldClass} type="password" name="newPassword" autoComplete="new-password" minLength={8} />
          </Field>
          <Field label="Confirm new password">
            <input className={fieldClass} type="password" name="confirmPassword" autoComplete="new-password" minLength={8} />
          </Field>
        </div>

        <div className="flex items-center justify-between gap-4 rounded-2xl border border-white/[.08] bg-white/[.02] px-4 py-3.5">
          <div>
            <p className="text-[13px] font-medium text-white/90">Two-factor authentication</p>
            <p className="mt-0.5 text-[10px] text-white/45">Ask for a code from your phone when you log in.</p>
          </div>
          <Switch checked={twoFactor} onChange={setTwoFactor} label="Two-factor authentication" />
        </div>

        <div>
          <h3 className="mb-2 text-[11px] font-semibold uppercase tracking-[.08em] text-white/40">Active sessions</h3>
          <ul className="divide-y divide-white/[.07] rounded-2xl border border-white/[.08] bg-white/[.02]">
            {sessions.map((session) => (
              <li key={session.id} className="flex items-center gap-3 px-4 py-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-white/[.06]">
                  <session.icon className="size-4 text-white/70" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-[13px] font-medium text-white/90">{session.device}</span>
                  <span className="block truncate text-[10px] text-white/45">
                    {session.place} ·{" "}
                    <span className={session.current ? "text-[#2fe4c0]" : ""}>{session.time}</span>
                  </span>
                </span>
                {!session.current && (
                  <Button
                    type="button"
                    variant="outline"
                    className="h-8 rounded-full border-white/20 bg-transparent px-3 text-[11px] text-white/75 hover:bg-white/[.06]"
                    onClick={() => setSessions((current) => current.filter((item) => item.id !== session.id))}
                  >
                    Sign out
                  </Button>
                )}
              </li>
            ))}
          </ul>
        </div>
      </div>
      <SaveBar saved={saved} label="Update security" />
    </form>
  );
}

export function SettingsPage() {
  const [active, setActive] = useState<SectionId>("profile");

  return (
    <section className="grid grid-cols-1 gap-5 pb-6 min-[900px]:grid-cols-[230px_minmax(0,1fr)]">
      <Card className={`${panelCard} h-fit gap-0 p-2`}>
        <nav aria-label="Settings sections" className="flex gap-1 overflow-x-auto min-[900px]:flex-col">
          {sections.map(({ id, label, description, icon: Icon }) => (
            <button
              key={id}
              type="button"
              onClick={() => setActive(id)}
              aria-current={active === id ? "page" : undefined}
              className={`flex shrink-0 items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-colors min-[900px]:w-full ${
                active === id ? "bg-gradient-to-r from-[#f04479] to-[#ff8866] text-white" : "text-white/70 hover:bg-white/[.05] hover:text-white"
              }`}
            >
              <Icon className="size-4 shrink-0" strokeWidth={1.8} />
              <span className="min-w-0">
                <span className="block text-[13px] font-medium">{label}</span>
                <span className={`hidden truncate text-[10px] min-[900px]:block ${active === id ? "text-white/80" : "text-white/40"}`}>
                  {description}
                </span>
              </span>
            </button>
          ))}
        </nav>
      </Card>
      <Card className={`${panelCard} gap-0 p-0`}>
        {active === "profile" && <ProfileSection />}
        {active === "store" && <StoreSection />}
        {active === "notifications" && <NotificationsSection />}
        {active === "security" && <SecuritySection />}
      </Card>
    </section>
  );
}

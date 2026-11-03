"use client";

import { useState, useSyncExternalStore } from "react";
import type { FormEvent } from "react";
import { useRouter } from "next/navigation";
import { createPortal } from "react-dom";
import { Dialog as DialogPrimitive } from "@base-ui/react/dialog";
import "./dashboard.css";
import {
  ArrowLeft,
  Bell,
  Bot,
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronsUpDown,
  Check,
  CircleHelp,
  Clock3,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Send,
  Settings,
  ShoppingBag,
  Tag,
  Users,
  Warehouse,
  Wrench,
  X,
} from "lucide-react";
import { BrandMark } from "@/components/brand-mark";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { CountrySales } from "@/components/dashboard/country-sales";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { OrderDetailPage, OrdersPage } from "@/components/dashboard/orders-page";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProducts } from "@/components/dashboard/top-products";
import { AIChatPage } from "@/components/dashboard/ai-chat-page";
import { ClientsPage, clientStatuses } from "@/components/dashboard/clients-page";
import { HelpPage } from "@/components/dashboard/help-page";
import { PromotionsPage, promotionStatuses } from "@/components/dashboard/promotions-page";
import { SettingsPage } from "@/components/dashboard/settings-page";
import { PageHeadingContext, PageTitleBar } from "@/components/dashboard/page-kit";
import {
  globalSearchItems,
  InventoryPage,
  SellersPage,
} from "@/components/dashboard/extra-pages";

const mainNavigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "AI Chat", icon: MessageSquare },
  { label: "Orders", icon: ClipboardList, count: "22" },
  { label: "Inventory", icon: Warehouse },
  { label: "Promotions", icon: Tag, count: "4" },
  { label: "Sellers", icon: ShoppingBag },
  { label: "Clients", icon: Users },
];

const supportNavigation = [
  { label: "Settings", icon: Wrench },
  { label: "Help & Support", icon: CircleHelp },
  { label: "Logout", icon: LogOut },
];

type DateRange = {
  start: Date | null;
  end: Date | null;
};

type DateFilter = {
  period: string;
  range: DateRange;
};

const datePresets = [
  "Last 24 Hours",
  "Yesterday",
  "Last Week",
  "Last Month",
  "Last 90 Days",
  "Last Year",
];

const filterPillClass =
  "dashboard-period-trigger h-8 gap-1.5 rounded-full border-white/[.2] bg-[#242424] px-3 text-white/85 hover:bg-white/[.08] data-[popup-open]:bg-white/[.08]";

function startOfDay(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}

function addDays(date: Date, amount: number) {
  const result = new Date(date);
  result.setDate(result.getDate() + amount);
  return result;
}

function addMonths(date: Date, amount: number) {
  return new Date(date.getFullYear(), date.getMonth() + amount, 1);
}

function dateId(date: Date) {
  return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
}

function getPresetRange(preset: string): DateRange {
  const today = startOfDay(new Date());
  const yesterday = addDays(today, -1);
  if (preset === "Last 24 Hours") return { start: yesterday, end: today };
  if (preset === "Yesterday") return { start: yesterday, end: yesterday };
  if (preset === "Last Week") return { start: addDays(today, -6), end: today };
  if (preset === "Last 90 Days") return { start: addDays(today, -89), end: today };
  if (preset === "Last Year") {
    return {
      start: new Date(today.getFullYear() - 1, 0, 1),
      end: new Date(today.getFullYear() - 1, 11, 31),
    };
  }

  const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
  return {
    start: lastMonth,
    end: new Date(today.getFullYear(), today.getMonth(), 0),
  };
}

/**
 * The left month of the dual view: a range ending in a past month opens on that
 * month (with the next beside it); otherwise the range's last month sits on the right.
 */
function firstVisibleMonth(range: DateRange, today: Date) {
  const endMonth = startOfMonth(range.end ?? range.start ?? today);
  return endMonth < startOfMonth(today) ? endMonth : addMonths(endMonth, -1);
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("en", { month: "short", day: "numeric" }).format(date);
}

function formatNumericDate(date: Date) {
  return `${date.getMonth() + 1}/${date.getDate()}/${date.getFullYear()}`;
}

function CalendarMonth({
  month,
  range,
  today,
  onSelect,
  onPrevious,
  onNext,
  previousClassName = "",
  nextClassName = "",
}: {
  month: Date;
  range: DateRange;
  today: Date;
  onSelect: (date: Date) => void;
  onPrevious: () => void;
  onNext: () => void;
  previousClassName?: string;
  nextClassName?: string;
}) {
  // Weeks start on Monday; neighbouring months fill the first and last rows.
  const leadingDays = (startOfMonth(month).getDay() + 6) % 7;
  const daysInMonth = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const cellCount = Math.ceil((leadingDays + daysInMonth) / 7) * 7;
  const days = Array.from({ length: cellCount }, (_, index) =>
    new Date(month.getFullYear(), month.getMonth(), index - leadingDays + 1),
  );
  const weekdays = ["M", "T", "W", "T", "F", "S", "S"];
  const monthLabel = new Intl.DateTimeFormat("en", { month: "long", year: "numeric" }).format(month);

  return (
    <div className="min-w-0">
      <div className="mb-3 flex items-center justify-between gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className={`rounded-full border-white/25 bg-transparent text-white/70 hover:bg-white/[.08] hover:text-white ${previousClassName}`}
          aria-label={`Previous month, from ${monthLabel}`}
          onClick={onPrevious}
        >
          <ChevronLeft className="size-3.5" />
        </Button>
        <span className="text-[13px] font-medium text-white/90">{monthLabel}</span>
        <Button
          type="button"
          variant="outline"
          size="icon-xs"
          className={`rounded-full border-white/25 bg-transparent text-white/70 hover:bg-white/[.08] hover:text-white ${nextClassName}`}
          aria-label={`Next month, from ${monthLabel}`}
          onClick={onNext}
        >
          <ChevronRight className="size-3.5" />
        </Button>
      </div>
      <div className="grid grid-cols-7 gap-y-1.5">
        {weekdays.map((day, index) => (
          <span
            key={`${day}-${index}`}
            className="flex h-7 items-center justify-center text-[10px] font-medium text-white/45"
          >
            {day}
          </span>
        ))}
        {days.map((date) => {
          // Overflow days stay muted so a range never shows twice across the two months.
          const outside = date.getMonth() !== month.getMonth();
          const selected =
            !outside &&
            ((range.start && dateId(date) === dateId(range.start)) ||
              (range.end && dateId(date) === dateId(range.end)));
          const inRange =
            !outside &&
            range.start &&
            range.end &&
            date >= range.start &&
            date <= range.end &&
            !selected;
          const isToday = dateId(date) === dateId(today);

          return (
            <button
              key={dateId(date)}
              type="button"
              onClick={() => onSelect(date)}
              aria-pressed={Boolean(selected)}
              aria-label={new Intl.DateTimeFormat("en", { dateStyle: "full" }).format(date)}
              className={`relative mx-auto flex size-8 items-center justify-center rounded-full border text-[11px] transition-colors ${
                selected
                  ? "border-transparent bg-gradient-to-br from-[#f04479] to-[#ff8866] font-semibold text-white shadow-[0_4px_14px_rgba(240,68,121,.35)]"
                  : inRange
                    ? "border-[#f35177]/55 bg-[#f35177]/15 text-[#ff8da3]"
                    : `border-transparent hover:bg-white/[.08] hover:text-white ${
                        outside ? "text-white/30" : "text-white/80"
                      }`
              } ${isToday && !outside && !selected && !inRange ? "border-[#f35177]/60" : ""}`}
            >
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/**
 * Dual-month range picker with presets on the right. The toolbar opens it from
 * the "Filter by" pill and from the calendar icon; both edit the same filter.
 */
function DateRangePicker({
  filter,
  onApply,
  variant = "pill",
}: {
  filter: DateFilter;
  onApply: (filter: DateFilter) => void;
  variant?: "pill" | "icon";
}) {
  const [open, setOpen] = useState(false);
  const [visibleMonth, setVisibleMonth] = useState(() => new Date(2000, 0, 1));
  const [today, setToday] = useState(() => new Date(2000, 0, 1));
  const [draft, setDraft] = useState(filter);

  function beginSelection(date: Date) {
    const selected = startOfDay(date);
    setDraft(({ range }) => ({
      period: "Custom",
      range:
        !range.start || range.end || selected < range.start
          ? { start: selected, end: null }
          : { start: range.start, end: selected },
    }));
  }

  function choosePreset(preset: string) {
    const range = getPresetRange(preset);
    setDraft({ period: preset, range });
    setVisibleMonth(firstVisibleMonth(range, today));
  }

  function applyRange() {
    const { start, end } = draft.range;
    if (!start) return;
    onApply({ period: draft.period, range: { start, end: end ?? start } });
    setOpen(false);
  }

  function resetRange() {
    const reset = { period: "Last Month", range: getPresetRange("Last Month") };
    setDraft(reset);
    setVisibleMonth(firstVisibleMonth(reset.range, today));
    onApply(reset);
  }

  const { period, range } = filter;
  const label =
    period === "Custom" && range.start && range.end
      ? `${formatDate(range.start)} – ${formatDate(range.end)}`
      : period;

  return (
    <DropdownMenu
      open={open}
      onOpenChange={(nextOpen) => {
        if (nextOpen) {
          const now = startOfDay(new Date());
          const currentRange = period === "Custom" ? range : getPresetRange(period);
          setToday(now);
          setVisibleMonth(firstVisibleMonth(currentRange, now));
          setDraft({ period, range: currentRange });
        }
        setOpen(nextOpen);
      }}
    >
      {variant === "icon" ? (
        <DropdownMenuTrigger
          render={
            <Button
              variant="ghost"
              size="icon-sm"
              className="text-white/65 hover:bg-white/[.08] hover:text-white data-[popup-open]:bg-white/[.08] data-[popup-open]:text-white"
              aria-label={`Open calendar, showing ${label}`}
            />
          }
        >
          <CalendarDays className="size-4" />
        </DropdownMenuTrigger>
      ) : (
        <DropdownMenuTrigger
          render={
            <Button
              variant="outline"
              className={filterPillClass}
              aria-label={`Select date range, currently ${label}`}
            />
          }
        >
          <CalendarDays className="size-[13px] text-white/60" />
          <span>{label}</span>
          <ChevronDown className="size-[11px] text-white/50" />
        </DropdownMenuTrigger>
      )}
      <DropdownMenuContent
        align="end"
        sideOffset={10}
        className="w-[min(800px,calc(100vw-24px))] overflow-hidden rounded-3xl border border-white/[.08] bg-gradient-to-br from-[#2d2d2d] to-[#252525] p-0 text-white shadow-[0_30px_70px_rgba(0,0,0,.5)] ring-0"
      >
        <div className="grid grid-cols-1 sm:grid-cols-[minmax(0,1fr)_176px]">
          <div className="grid min-w-0 grid-cols-1 sm:grid-cols-2">
            <div className="p-4 sm:p-5">
              <CalendarMonth
                month={visibleMonth}
                range={draft.range}
                today={today}
                onSelect={beginSelection}
                onPrevious={() => setVisibleMonth((month) => addMonths(month, -1))}
                onNext={() => setVisibleMonth((month) => addMonths(month, 1))}
                nextClassName="sm:invisible"
              />
            </div>
            <div className="hidden border-l border-white/[.08] p-5 sm:block">
              <CalendarMonth
                month={addMonths(visibleMonth, 1)}
                range={draft.range}
                today={today}
                onSelect={beginSelection}
                onPrevious={() => setVisibleMonth((month) => addMonths(month, -1))}
                onNext={() => setVisibleMonth((month) => addMonths(month, 1))}
                previousClassName="invisible"
              />
            </div>
          </div>
          <div
            role="group"
            aria-label="Quick ranges"
            className="order-first flex overflow-x-auto border-b border-white/[.08] py-2 sm:order-none sm:flex-col sm:overflow-visible sm:border-b-0 sm:border-l sm:py-4"
          >
            {datePresets.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => choosePreset(preset)}
                aria-pressed={draft.period === preset}
                className={`shrink-0 px-5 py-3 text-left text-[13px] transition-colors sm:w-full ${
                  draft.period === preset
                    ? "bg-gradient-to-r from-[#f04479] to-[#ff8866] font-medium text-white"
                    : "text-white/80 hover:bg-white/[.05] hover:text-white"
                }`}
              >
                {preset}
              </button>
            ))}
          </div>
        </div>
        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/[.08] px-5 py-4">
          <div className="flex items-center gap-2 text-[11px] text-white/70">
            <CalendarDays className="size-4 text-white/55" />
            {draft.range.start
              ? `${draft.period === "Custom" ? "Custom range" : draft.period} ${formatNumericDate(draft.range.start)} – ${
                  draft.range.end ? formatNumericDate(draft.range.end) : "select end date"
                }`
              : "Select a date range"}
          </div>
          <div className="ml-auto flex items-center gap-2.5">
            <Button
              type="button"
              variant="outline"
              className="h-9 rounded-full border-white/25 bg-transparent px-4 text-xs text-white/85 hover:bg-white/[.06]"
              onClick={resetRange}
            >
              Reset
            </Button>
            <Button
              type="button"
              className="h-9 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] px-4 text-xs text-white shadow-[0_8px_20px_rgba(240,68,121,.3)] hover:brightness-110"
              disabled={!draft.range.start}
              onClick={applyRange}
            >
              <Check className="size-3.5" />
              Apply
            </Button>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

type HistoryNavigation = EventTarget & { canGoBack: boolean; canGoForward: boolean };

function getHistoryNavigation() {
  return (window as Window & { navigation?: HistoryNavigation }).navigation;
}

function subscribeToHistory(onChange: () => void) {
  const navigation = getHistoryNavigation();
  navigation?.addEventListener("currententrychange", onChange);
  return () => navigation?.removeEventListener("currententrychange", onChange);
}

// Browsers without the Navigation API keep both buttons enabled.
function getHistorySnapshot() {
  const navigation = getHistoryNavigation();
  return `${navigation?.canGoBack ?? true}:${navigation?.canGoForward ?? true}`;
}

function getServerHistorySnapshot() {
  return "false:false";
}

function HistoryControls() {
  const router = useRouter();
  const [canGoBack, canGoForward] = useSyncExternalStore(
    subscribeToHistory,
    getHistorySnapshot,
    getServerHistorySnapshot,
  )
    .split(":")
    .map((value) => value === "true");
  const buttonClass =
    "flex w-[34px] items-center justify-center text-white/70 transition-colors hover:bg-white/[.08] hover:text-white focus-visible:bg-white/[.08] focus-visible:text-white focus-visible:outline-none disabled:pointer-events-none disabled:text-white/25";

  return (
    <div className="hidden h-[30px] shrink-0 items-stretch overflow-hidden rounded-full border border-white/[.2] bg-[#242424] sm:flex">
      <button
        type="button"
        className={buttonClass}
        aria-label="Go back"
        disabled={!canGoBack}
        onClick={() => router.back()}
      >
        <ChevronLeft className="size-4" />
      </button>
      <span aria-hidden="true" className="w-px bg-white/[.16]" />
      <button
        type="button"
        className={buttonClass}
        aria-label="Go forward"
        disabled={!canGoForward}
        onClick={() => router.forward()}
      >
        <ChevronRight className="size-4" />
      </button>
    </div>
  );
}

function Brand({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-[clamp(56px,5.3vw,61px)] items-center gap-[clamp(8px,1vw,12px)] border-b border-white/[.07] px-[clamp(12px,1.6vw,18px)]">
      <BrandMark className="w-[clamp(24px,3.1vw,34px)]" />
      <span
        className={`flex-1 text-[clamp(12px,1.48vw,17px)] font-semibold tracking-[.01em] text-white/90 ${
          collapsed ? "sr-only" : ""
        }`}
      >
        Brinhildr
      </span>
      <button
        type="button"
        onClick={onToggle}
        className="hidden size-6 items-center justify-center rounded text-[10px] text-white/40 transition-colors hover:bg-white/10 hover:text-white sm:flex"
        aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
        aria-expanded={!collapsed}
      >
        {collapsed ? "›" : "‹"}
      </button>
    </div>
  );
}

function SidebarNavigation({
  activeSection,
  onNavigate,
  collapsed,
}: {
  activeSection: string;
  onNavigate: (section: string) => void;
  collapsed: boolean;
}) {
  return (
    <>
      <div className="space-y-2 px-0 pb-4 pt-2.5">
        {mainNavigation.map(({ label, icon: Icon, count }) => {
          const active = activeSection === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(label)}
              aria-current={active ? "page" : undefined}
              className={`group mx-auto flex items-center text-left text-[clamp(10px,1.3vw,15px)] font-medium transition-colors ${
                active
                  ? "bg-gradient-to-r from-[#f04479] to-[#ff8866] font-medium text-white shadow-[0_3px_12px_rgba(244,68,121,.12)]"
                  : "text-white/65 hover:bg-white/[.06] hover:text-white"
              } ${
                collapsed
                  ? "size-11 justify-center rounded-lg px-0"
                  : "h-[clamp(27px,3.6vw,42px)] w-full gap-[clamp(8px,1vw,12px)] px-[clamp(12px,1.6vw,18px)]"
              }`}
            >
              <Icon className="size-[clamp(14px,1.5vw,18px)] shrink-0" strokeWidth={1.7} />
              <span className={collapsed ? "sr-only" : "flex-1"}>{label}</span>
              {count && !collapsed && (
                <span
                  className={`flex h-[15px] min-w-[16px] items-center justify-center rounded-full border px-1 text-[8px] ${
                    active
                      ? "border-white/20 bg-white/10 text-white"
                      : "border-white/10 bg-white/[.04] text-white/65"
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>
      <div className="mt-auto space-y-2 border-t border-white/[.06] px-0 pb-3 pt-3">
        {supportNavigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(label)}
            className={`mx-auto flex items-center text-left text-[clamp(10px,1.3vw,15px)] font-medium transition-colors ${
              label === "Logout"
                ? activeSection === label
                  ? "bg-red-500/10 text-red-400 hover:bg-red-500/15 hover:text-red-300"
                  : "text-red-400 hover:bg-red-500/10 hover:text-red-300"
                : activeSection === label
                  ? "bg-gradient-to-r from-[#f04479] to-[#ff8866] text-white shadow-[0_3px_12px_rgba(244,68,121,.12)]"
                  : "text-white/65 hover:bg-white/[.06] hover:text-white"
              } ${
                collapsed
                  ? "size-11 justify-center rounded-lg px-0"
                  : "h-[clamp(27px,3.6vw,42px)] w-full gap-[clamp(8px,1vw,12px)] px-[clamp(12px,1.6vw,18px)]"
              }`}
          >
              <Icon className="size-[clamp(14px,1.5vw,18px)] shrink-0" strokeWidth={1.7} />
              <span className={collapsed ? "sr-only" : ""}>{label}</span>
          </button>
        ))}
      </div>
    </>
  );
}

function SidebarProfile({
  onNavigate,
  collapsed,
}: {
  onNavigate: (section: string) => void;
  collapsed: boolean;
}) {
  return (
    <div className="border-t border-white/[.06] p-[clamp(6px,.8vw,10px)]">
      <DropdownMenu>
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className={`flex w-full items-center rounded-xl text-left transition-colors hover:bg-white/[.06] data-[popup-open]:bg-white/[.06] ${
                collapsed ? "justify-center p-1.5" : "gap-[clamp(8px,1vw,12px)] p-[clamp(6px,.8vw,8px)]"
              }`}
              aria-label="Open account menu"
            />
          }
        >
          <Avatar className="size-[clamp(26px,2.9vw,34px)]">
            <AvatarImage
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=96&q=80"
              alt=""
            />
            <AvatarFallback className="bg-[#80545e] text-[11px] text-white">I</AvatarFallback>
          </Avatar>
          {!collapsed && (
            <>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-[clamp(10px,1.2vw,14px)] font-semibold text-white/90">
                  Ismail
                </span>
                <span className="block truncate text-[clamp(8px,.9vw,11px)] text-white/45">
                  ismail@brinhildr.com
                </span>
              </span>
              <ChevronsUpDown className="size-3.5 shrink-0 text-white/45" />
            </>
          )}
        </DropdownMenuTrigger>
        <DropdownMenuContent
          side={collapsed ? "right" : "top"}
          align={collapsed ? "end" : "start"}
          sideOffset={8}
          className="min-w-44 bg-[#252525] text-white"
        >
          <DropdownMenuGroup>
            <DropdownMenuLabel>Ismail</DropdownMenuLabel>
          </DropdownMenuGroup>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={() => onNavigate("Settings")}>
            <Settings />
            Settings
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onNavigate("Logout")}>
            <LogOut />
            Log out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

function Sidebar({
  activeSection,
  onNavigate,
  mobile = false,
  collapsed = false,
  onToggleCollapse = () => {},
}: {
  activeSection: string;
  onNavigate: (section: string) => void;
  mobile?: boolean;
  collapsed?: boolean;
  onToggleCollapse?: () => void;
}) {
  return (
    <div
      className={`flex h-full flex-col bg-[#191919] ${
        mobile
          ? "w-full"
          : `${collapsed ? "w-[72px]" : "dashboard-sidebar"} dashboard-sidebar-panel shrink-0 overflow-y-auto rounded-2xl border border-white/[.08]`
      }`}
    >
      <Brand collapsed={collapsed} onToggle={onToggleCollapse} />
      <nav aria-label="Main navigation" className="flex flex-1 flex-col">
        <SidebarNavigation
          activeSection={activeSection}
          onNavigate={onNavigate}
          collapsed={collapsed}
        />
      </nav>
      <SidebarProfile onNavigate={onNavigate} collapsed={collapsed} />
    </div>
  );
}

function subscribeToPortalReady() {
  return () => {};
}

function getPortalReadySnapshot() {
  return true;
}

function getServerPortalSnapshot() {
  return false;
}

type DashboardPage =
  | "dashboard"
  | "orders"
  | "order"
  | "ai-chat"
  | "inventory"
  | "sellers"
  | "promotions"
  | "clients"
  | "settings"
  | "help";

const sectionByPage: Record<DashboardPage, string> = {
  dashboard: "Dashboard",
  orders: "Orders",
  order: "Orders",
  "ai-chat": "AI Chat",
  inventory: "Inventory",
  sellers: "Sellers",
  promotions: "Promotions",
  clients: "Clients",
  settings: "Settings",
  help: "Help & Support",
};

const routeBySection: Record<string, string> = {
  Dashboard: "/",
  "AI Chat": "/ai-chat",
  Orders: "/orders",
  Inventory: "/inventory",
  Promotions: "/promotions",
  Sellers: "/sellers",
  Clients: "/clients",
  Settings: "/settings",
  "Help & Support": "/help",
};

const pageSearchPlaceholder: Partial<Record<DashboardPage, string>> = {
  orders: "Search for orders...",
  inventory: "Search for products...",
  sellers: "Search for manufacturers...",
  promotions: "Search for promotions...",
  clients: "Search for clients...",
  help: "Search help articles...",
};

function StatusFilterMenu({
  options,
  value,
  onChange,
}: {
  options: readonly string[];
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            className={filterPillClass}
            aria-label={`Filter by status, currently ${value === "All" ? "all statuses" : value}`}
          />
        }
      >
        <span>{value === "All" ? "All statuses" : value}</span>
        <ChevronDown className="size-[11px] text-white/50" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" sideOffset={8} className="min-w-40 bg-[#252525] text-white">
        <DropdownMenuRadioGroup value={value} onValueChange={(next) => onChange(String(next))}>
          {["All", ...options].map((option) => (
            <DropdownMenuRadioItem key={option} value={option} closeOnClick className="text-xs">
              {option === "All" ? "All statuses" : option}
            </DropdownMenuRadioItem>
          ))}
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

function LogoutDialog({
  open,
  onOpenChange,
  onConfirm,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}) {
  return (
    <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm transition-opacity duration-150 data-ending-style:opacity-0 data-starting-style:opacity-0" />
        <DialogPrimitive.Popup className="fixed left-1/2 top-1/2 z-50 w-[min(400px,calc(100vw-32px))] -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-white/[.08] bg-gradient-to-br from-[#2d2d2d] to-[#232323] p-7 text-center text-white shadow-[0_30px_70px_rgba(0,0,0,.5)] transition duration-150 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <span className="mx-auto flex size-14 items-center justify-center rounded-full bg-[#f35177]/15">
            <LogOut className="size-6 text-[#ff8da3]" />
          </span>
          <DialogPrimitive.Title className="mt-4 text-lg font-semibold">Log out of Brinhildr?</DialogPrimitive.Title>
          <DialogPrimitive.Description className="mt-1.5 text-xs leading-relaxed text-white/55">
            You’ll need to log in again to manage your store.
          </DialogPrimitive.Description>
          <div className="mt-6 grid grid-cols-2 gap-3">
            <DialogPrimitive.Close
              render={
                <Button
                  variant="outline"
                  className="h-10 rounded-full border-white/20 bg-transparent text-xs text-white/85 hover:bg-white/[.06]"
                />
              }
            >
              Cancel
            </DialogPrimitive.Close>
            <Button
              className="h-10 rounded-full bg-gradient-to-r from-[#f04479] to-[#ff8866] text-xs text-white hover:brightness-110"
              onClick={onConfirm}
            >
              Log out
            </Button>
          </div>
        </DialogPrimitive.Popup>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
}

function ChatPanel({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const portalReady = useSyncExternalStore(
    subscribeToPortalReady,
    getPortalReadySnapshot,
    getServerPortalSnapshot,
  );
  const [width, setWidth] = useState(360);
  const [resizeStart, setResizeStart] = useState<{
    pointerId: number;
    startX: number;
    width: number;
  } | null>(null);
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      text: "Hi! This is a demo chat. Send a message to try the conversation panel.",
    },
  ]);

  function appendMessage(text: string) {
    setMessages((current) => [
      ...current,
      { role: "user", text },
      {
        role: "assistant",
        text: "This is a design demo and isn’t connected to store data or a live AI service yet. Connect an assistant to get a verified answer for this request.",
      },
    ]);
  }

  function getResizeBounds() {
    const viewportWidth = typeof window === "undefined" ? 1024 : window.innerWidth;
    const minWidth = Math.min(280, Math.max(180, viewportWidth * 0.35));
    return {
      minWidth,
      maxWidth: Math.max(minWidth, Math.min(640, viewportWidth * 0.6)),
    };
  }

  function sendMessage(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const text = draft.trim();
    if (!text) return;

    appendMessage(text);
    setDraft("");
  }

  return (
    <>
      {!open && portalReady &&
        createPortal(
          <Button
            variant="default"
            size="icon"
            className="fixed bottom-5 right-5 z-40 size-12 rounded-full bg-gradient-to-br from-[#ff8866] to-[#f04479] text-white shadow-[0_8px_28px_rgba(240,68,121,.32)] hover:brightness-110"
            aria-label="Open chat"
            onClick={() => {
              setWidth((current) => Math.min(current, getResizeBounds().maxWidth));
              onOpenChange(true);
            }}
          >
            <MessageSquare className="size-5" />
          </Button>,
          document.body,
        )}
      <aside
        className={`dashboard-chat-dock ${resizeStart ? "is-resizing" : ""}`}
        data-open={open}
        style={{
          width: open ? width : 0,
          flexBasis: open ? width : 0,
        }}
        aria-label="Chat panel"
        aria-hidden={!open}
      >
        {open && (
          <>
            <button
              type="button"
              className="dashboard-chat-resize absolute inset-y-0 left-0 z-10 w-2 cursor-col-resize touch-none"
              role="separator"
              aria-label="Resize chat panel"
              aria-orientation="vertical"
              aria-valuenow={width}
              aria-valuemin={180}
              aria-valuemax={640}
              onPointerDown={(event) => {
                event.currentTarget.setPointerCapture(event.pointerId);
                const panelWidth =
                  (event.currentTarget.parentElement?.getBoundingClientRect().width ?? width * 1.1) /
                  1.1;
                setResizeStart({
                  pointerId: event.pointerId,
                  startX: event.clientX / 1.1,
                  width: panelWidth,
                });
              }}
              onPointerMove={(event) => {
                if (!resizeStart || resizeStart.pointerId !== event.pointerId) return;
                const { minWidth, maxWidth } = getResizeBounds();
                const pointerX = event.clientX / 1.1;
                setWidth(
                  Math.min(
                    maxWidth,
                    Math.max(minWidth, resizeStart.width + resizeStart.startX - pointerX),
                  ),
                );
              }}
              onPointerUp={() => setResizeStart(null)}
              onPointerCancel={() => setResizeStart(null)}
              onKeyDown={(event) => {
                const { minWidth, maxWidth } = getResizeBounds();
                const panelWidth =
                  (event.currentTarget.parentElement?.getBoundingClientRect().width ?? width * 1.1) /
                  1.1;
                let nextWidth: number | undefined;
                if (event.key === "ArrowLeft") nextWidth = Math.min(maxWidth, panelWidth + 20);
                if (event.key === "ArrowRight") nextWidth = Math.max(minWidth, panelWidth - 20);
                if (event.key === "Home") nextWidth = minWidth;
                if (event.key === "End") nextWidth = maxWidth;
                if (nextWidth !== undefined) {
                  event.preventDefault();
                  setWidth(nextWidth);
                }
              }}
            >
              <span className="absolute inset-y-0 left-[3px] w-px bg-white/10 transition-colors hover:bg-[#f35177]/70" />
            </button>
            <div className="flex h-full min-w-0 flex-col bg-[#191919]">
              <div className="flex min-w-0 items-center gap-3 border-b border-white/[.08] px-5 py-4 pl-6">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-[#ff8866] to-[#f04479]">
                  <Bot className="size-5 text-white" />
                </span>
                <div className="min-w-0 flex-1">
                  <h2 className="truncate text-sm font-semibold text-white">Store assistant</h2>
                  <p className="mt-0.5 truncate text-xs text-white/45">Demo chat · local replies</p>
                </div>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  className="shrink-0 text-white/55 hover:text-white"
                  aria-label="Close chat"
                  onClick={() => onOpenChange(false)}
                >
                  <X className="size-4" />
                </Button>
              </div>
              <div
                className="flex min-h-0 flex-1 flex-col gap-3 overflow-y-auto px-4 py-5"
                aria-live="polite"
              >
                {messages.map((message, index) => (
                  <div
                    key={`${message.role}-${index}`}
                    className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed ${
                      message.role === "user"
                        ? "self-end rounded-br-md bg-gradient-to-br from-[#f04479] to-[#ff8866] text-white"
                        : "self-start rounded-bl-md border border-white/[.08] bg-[#252525] text-white/85"
                    }`}
                  >
                    {message.text}
                  </div>
                ))}
              </div>
              <form
                onSubmit={sendMessage}
                className="flex items-center gap-2 border-t border-white/[.08] p-4"
              >
                <Input
                  aria-label="Type a message"
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  placeholder="Type a message..."
                  className="h-10 min-w-0 rounded-full border-white/[.12] bg-[#242424] px-4 text-sm text-white placeholder:text-white/40 focus-visible:border-white/25 focus-visible:ring-0"
                />
                <Button
                  type="submit"
                  size="icon"
                  className="size-10 shrink-0 rounded-full bg-[#f35177] text-white hover:bg-[#f35177]/85"
                  aria-label="Send message"
                  disabled={!draft.trim()}
                >
                  <Send className="size-4" />
                </Button>
              </form>
            </div>
          </>
        )}
      </aside>
    </>
  );
}

export function Dashboard({
  page = "dashboard",
  orderId,
}: {
  page?: DashboardPage;
  orderId?: string;
}) {
  const router = useRouter();
  const [dateFilter, setDateFilter] = useState<DateFilter>({
    period: "Last Month",
    range: { start: null, end: null },
  });
  const [statusFilter, setStatusFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);
  const [chatOpen, setChatOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);
  const isOrdersPage = page === "orders";
  const statusOptions =
    page === "promotions" ? promotionStatuses : page === "clients" ? clientStatuses : null;
  const hasFilter =
    page === "dashboard" ||
    isOrdersPage ||
    page === "inventory" ||
    page === "sellers" ||
    Boolean(statusOptions);
  const searchPlaceholder = pageSearchPlaceholder[page] ?? "Search";
  const searchResults = globalSearchItems.filter((item) =>
    `${item.title} ${item.detail}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );
  const currentSection = sectionByPage[page];
  const pageTitle =
    page === "order" && orderId
      ? `Order #${orderId}`
      : page === "sellers"
        ? "Manufacturers"
        : currentSection;

  const pageHeading = {
    title: pageTitle,
    leading:
      page === "order" ? (
        <Button
          variant="outline"
          size="icon"
          className="size-[clamp(26px,2.6vw,32px)] shrink-0 rounded-full border-white/20 bg-transparent text-white/80 hover:bg-white/[.07]"
          onClick={() => router.push("/orders")}
          aria-label="Back to orders"
        >
          <ArrowLeft className="size-3.5" />
        </Button>
      ) : null,
    filter: hasFilter ? (
      <div className="flex shrink-0 items-center gap-2">
        <span className="dashboard-filter-label hidden text-white/50 sm:inline">Filter by</span>
        {page === "dashboard" ? (
          <DateRangePicker filter={dateFilter} onApply={setDateFilter} />
        ) : statusOptions ? (
          <StatusFilterMenu options={statusOptions} value={statusFilter} onChange={setStatusFilter} />
        ) : (
          <Button variant="outline" className={filterPillClass}>
            Latest
          </Button>
        )}
      </div>
    ) : null,
  };

  function navigateSection(section: string) {
    if (section === "Logout") {
      setLogoutOpen(true);
      return;
    }
    const route = routeBySection[section];
    if (route) router.push(route);
  }

  return (
    <>
      <div
        className="dashboard-shell dark flex bg-[#151515] text-white"
        data-page={page}
        data-chat-open={chatOpen}
      >
        <aside
          className={`dashboard-sidebar-rail sticky z-20 hidden shrink-0 self-start sm:block ${
            sidebarCollapsed ? "w-[72px]" : "dashboard-sidebar"
          }`}
        >
          <Sidebar
            activeSection={currentSection}
            onNavigate={navigateSection}
            collapsed={sidebarCollapsed}
            onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
          />
        </aside>

        <main className="min-w-0 flex-1">
          <div className="dashboard-content w-full">
          <header className="dashboard-toolbar flex flex-wrap items-center gap-[clamp(8px,1.3vw,16px)] sm:grid">
            <div className="flex min-w-0 items-center gap-[clamp(8px,1vw,12px)]">
              <Sheet open={mobileNavigationOpen} onOpenChange={setMobileNavigationOpen}>
                <SheetTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="sm:hidden"
                      aria-label="Open navigation"
                    />
                  }
                >
                  <Menu className="size-4" />
                </SheetTrigger>
                <SheetContent side="left" className="w-[240px] border-white/10 bg-[#191919] p-0">
                  <SheetTitle className="sr-only">Navigation</SheetTitle>
                  <Sidebar
                    activeSection={currentSection}
                    onNavigate={(section) => {
                      navigateSection(section);
                      setMobileNavigationOpen(false);
                    }}
                    mobile
                  />
                </SheetContent>
              </Sheet>

              <HistoryControls />
            </div>

            <div className="dashboard-search relative min-w-0 max-sm:order-last max-sm:basis-full">
              <Search className="dashboard-search-icon pointer-events-none absolute top-1/2 -translate-y-1/2 text-white/50" />
              <Input
                placeholder={searchPlaceholder}
                aria-label={isOrdersPage ? "Search orders" : page === "sellers" ? "Search manufacturers" : "Search"}
                value={searchTerm}
                onFocus={() => setSearchOpen(Boolean(searchTerm))}
                onChange={(event) => {
                  setSearchTerm(event.target.value);
                  setSearchOpen(Boolean(event.target.value));
                }}
                className="dashboard-search-input rounded-full border-white/[.16] bg-[#242424] text-white placeholder:text-white/45 focus-visible:border-white/30 focus-visible:ring-0"
              />
              <button
                type="button"
                className="dashboard-search-action absolute top-1/2 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label={searchTerm ? "Clear search" : "Show recent searches"}
                onClick={() => {
                  if (searchTerm) {
                    setSearchTerm("");
                    setSearchOpen(false);
                  } else {
                    setSearchOpen((open) => !open);
                  }
                }}
              >
                {searchTerm ? <X className="size-3" /> : <ChevronDown className="size-3" />}
              </button>
              {searchOpen && searchTerm && (
                <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-white/[.12] bg-[#242424] py-1.5 shadow-2xl">
                  {searchResults.length ? (
                    searchResults.slice(0, 5).map(({ title, detail, href, icon: Icon }, index) => (
                      <button
                        key={`${href}-${title}-${index}`}
                        type="button"
                        className="flex w-full items-center gap-3 border-b border-white/[.06] px-3 py-2.5 text-left last:border-0 hover:bg-white/[.06]"
                        onClick={() => {
                          router.push(href);
                          setSearchTerm("");
                          setSearchOpen(false);
                        }}
                      >
                        <Clock3 className="size-4 shrink-0 text-white/45" />
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-xs font-medium text-white/85">{title}</span>
                          <span className="mt-0.5 block truncate text-[10px] text-white/45">{detail}</span>
                        </span>
                        <Icon className="size-3.5 shrink-0 text-white/35" />
                      </button>
                    ))
                  ) : (
                    <p className="px-3 py-4 text-center text-xs text-white/45">No matches found.</p>
                  )}
                </div>
              )}
            </div>

            <div className="ml-auto flex shrink-0 items-center justify-end">
              <div className="flex items-center rounded-full border border-white/[.18] bg-[#242424] px-1">
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="text-white/65 hover:bg-white/[.08] hover:text-white"
                        aria-label="Open messages"
                      />
                    }
                  >
                    <MessageSquare className="size-4" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#252525] text-white">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Messages</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>No new messages</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span aria-hidden="true" className="h-4 w-px bg-white/[.14]" />
                <DropdownMenu>
                  <DropdownMenuTrigger
                    render={
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        className="relative text-white/65 hover:bg-white/[.08] hover:text-white"
                        aria-label="Open notifications"
                      />
                    }
                  >
                    <Bell className="size-4" />
                    <span className="absolute right-[6px] top-[5px] size-[4px] rounded-full bg-[#f35177]" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="bg-[#252525] text-white">
                    <DropdownMenuGroup>
                      <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                    </DropdownMenuGroup>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem>Your store is looking good today.</DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                <span aria-hidden="true" className="h-4 w-px bg-white/[.14]" />
                <DateRangePicker filter={dateFilter} onApply={setDateFilter} variant="icon" />
              </div>
            </div>
          </header>

          <PageHeadingContext value={pageHeading}>
          {page === "order" && orderId ? (
            <OrderDetailPage orderId={orderId} />
          ) : isOrdersPage ? (
            <OrdersPage searchTerm={searchTerm} onCreate={() => router.push("/orders/1001")} />
          ) : page === "ai-chat" ? (
            <>
              <PageTitleBar />
              <AIChatPage />
            </>
          ) : page === "inventory" ? (
            <InventoryPage searchTerm={searchTerm} />
          ) : page === "sellers" ? (
            <SellersPage searchTerm={searchTerm} />
          ) : page === "promotions" ? (
            <PromotionsPage searchTerm={searchTerm} statusFilter={statusFilter} />
          ) : page === "clients" ? (
            <ClientsPage searchTerm={searchTerm} statusFilter={statusFilter} />
          ) : page === "settings" ? (
            <>
              <PageTitleBar />
              <SettingsPage />
            </>
          ) : page === "help" ? (
            <>
              <PageTitleBar />
              <HelpPage searchTerm={searchTerm} onOpenChat={() => setChatOpen(true)} />
            </>
          ) : (
            <>
              <PageTitleBar />
              <div
                className="dashboard-grid grid grid-cols-1 min-[640px]:grid-cols-2"
                onPointerMove={(event) => {
                  if (event.pointerType === "touch") return;
                  const card = (event.target as HTMLElement).closest<HTMLElement>(
                    '[data-slot="card"]',
                  );
                  if (!card) return;
                  // Client coordinates include the 110% scale; the glow is drawn in the card's own pixels.
                  const bounds = card.getBoundingClientRect();
                  const scale = card.offsetWidth / bounds.width;
                  card.style.setProperty("--pointer-x", `${(event.clientX - bounds.left) * scale}px`);
                  card.style.setProperty("--pointer-y", `${(event.clientY - bounds.top) * scale}px`);
                }}
              >
                <div className="min-[640px]:col-span-2">
                  <SalesChart period={dateFilter.period} />
                </div>
                <EarningsChart period={dateFilter.period} />
                <TopProducts searchTerm={searchTerm} />
                <CountrySales />
                <CategoryBreakdown />
              </div>
            </>
          )}
          </PageHeadingContext>
          </div>
        </main>
        {page !== "ai-chat" && <ChatPanel open={chatOpen} onOpenChange={setChatOpen} />}
        <LogoutDialog
          open={logoutOpen}
          onOpenChange={setLogoutOpen}
          onConfirm={() => router.push("/login")}
        />
      </div>
    </>
  );
}

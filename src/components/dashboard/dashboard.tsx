"use client";

import { useState } from "react";
import "./dashboard.css";
import {
  Bell,
  CalendarDays,
  ChevronDown,
  CircleHelp,
  ClipboardList,
  LayoutDashboard,
  LogOut,
  Menu,
  MessageSquare,
  Search,
  Settings,
  ShoppingBag,
  Sparkles,
  Tag,
  Users,
  Warehouse,
  Wrench,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { CategoryBreakdown } from "@/components/dashboard/category-breakdown";
import { CountrySales } from "@/components/dashboard/country-sales";
import { EarningsChart } from "@/components/dashboard/earnings-chart";
import { SalesChart } from "@/components/dashboard/sales-chart";
import { TopProducts } from "@/components/dashboard/top-products";

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

function Brand({
  collapsed,
  onToggle,
}: {
  collapsed: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex h-[clamp(56px,5.3vw,61px)] items-center gap-[clamp(8px,1vw,12px)] border-b border-white/[.07] px-[clamp(12px,1.6vw,18px)]">
      <span className="flex size-[clamp(21px,2.6vw,30px)] items-center justify-center rounded-full bg-gradient-to-br from-[#ff8b66] via-[#f44d7b] to-[#a852ee] shadow-[0_0_14px_rgba(243,81,119,.22)]">
        <Sparkles className="size-[clamp(12px,1.5vw,17px)] text-white" strokeWidth={1.8} />
      </span>
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
      <div className="space-y-1 px-0 pb-4 pt-1.5">
        {mainNavigation.map(({ label, icon: Icon, count }) => {
          const active = activeSection === label;
          return (
            <button
              key={label}
              type="button"
              onClick={() => onNavigate(label)}
              aria-current={active ? "page" : undefined}
              className={`group flex h-[clamp(27px,3.6vw,42px)] w-full items-center text-left text-[clamp(10px,1.3vw,15px)] transition-colors ${
                active
                  ? "bg-gradient-to-r from-[#f04479] to-[#ff8866] font-medium text-white shadow-[0_3px_12px_rgba(244,68,121,.12)]"
                  : "text-white/65 hover:bg-white/[.06] hover:text-white"
              } ${collapsed ? "justify-center px-0" : "gap-[clamp(8px,1vw,12px)] px-[clamp(12px,1.6vw,18px)]"}`}
            >
              <Icon className="size-[clamp(12px,1.5vw,17px)] shrink-0" strokeWidth={1.7} />
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
      <div className="mt-auto space-y-1 border-t border-white/[.06] px-0 pb-7 pt-2">
        {supportNavigation.map(({ label, icon: Icon }) => (
          <button
            key={label}
            type="button"
            onClick={() => onNavigate(label)}
            className={`flex h-[clamp(27px,3.6vw,42px)] w-full items-center text-left text-[clamp(10px,1.3vw,15px)] transition-colors ${
              activeSection === label
                ? "bg-white/[.08] text-white"
                : "text-white/65 hover:bg-white/[.06] hover:text-white"
              } ${collapsed ? "justify-center px-0" : "gap-[clamp(8px,1vw,12px)] px-[clamp(12px,1.6vw,18px)]"}`}
          >
              <Icon className="size-[clamp(12px,1.5vw,17px)] shrink-0" strokeWidth={1.7} />
              <span className={collapsed ? "sr-only" : ""}>{label}</span>
          </button>
        ))}
      </div>
    </>
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
          : `${collapsed ? "w-[72px]" : "dashboard-sidebar"} shrink-0 border-r border-white/[.07]`
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
    </div>
  );
}

export function Dashboard() {
  const [activeSection, setActiveSection] = useState("Dashboard");
  const [period, setPeriod] = useState("Last month");
  const [searchTerm, setSearchTerm] = useState("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileNavigationOpen, setMobileNavigationOpen] = useState(false);

  return (
    <div className="dark flex min-h-screen bg-[#151515] text-white">
      <aside
        className={`fixed inset-y-0 left-0 z-20 hidden sm:block ${
          sidebarCollapsed ? "w-[72px]" : "dashboard-sidebar"
        }`}
      >
        <Sidebar
          activeSection={activeSection}
          onNavigate={setActiveSection}
          collapsed={sidebarCollapsed}
          onToggleCollapse={() => setSidebarCollapsed((collapsed) => !collapsed)}
        />
      </aside>

      <main
        className={`min-w-0 flex-1 ${
          sidebarCollapsed ? "sm:ml-[72px]" : "sm:ml-[clamp(152px,20.4vw,235px)]"
        }`}
      >
        <div className="dashboard-content mx-auto w-full max-w-[1600px]">
          <header className="dashboard-toolbar flex items-center gap-[clamp(8px,1.3vw,15px)]">
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
                  activeSection={activeSection}
                  onNavigate={(section) => {
                    setActiveSection(section);
                    setMobileNavigationOpen(false);
                  }}
                  mobile
                />
              </SheetContent>
            </Sheet>

            <div className="relative min-w-0 max-w-[clamp(316px,42vw,484px)] flex-1 sm:ml-1">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 size-[12px] -translate-y-1/2 text-white/45" />
              <Input
                aria-label="Search products"
                placeholder="Search"
                value={searchTerm}
                onChange={(event) => setSearchTerm(event.target.value)}
                className="h-[clamp(25px,3.2vw,37px)] rounded-full border-white/[.16] bg-[#242424] pl-[clamp(28px,3.6vw,42px)] pr-9 text-[clamp(9px,1.05vw,12px)] text-white placeholder:text-white/45 focus-visible:border-white/30 focus-visible:ring-0"
              />
              <button
                type="button"
                className="absolute right-1 top-1/2 flex size-[clamp(17px,2vw,23px)] -translate-y-1/2 items-center justify-center rounded-full border border-white/20 text-white/60 transition-colors hover:bg-white/10 hover:text-white"
                aria-label="Clear search"
                onClick={() => setSearchTerm("")}
              >
                <ChevronDown className="size-[10px]" />
              </button>
            </div>

            <div className="ml-auto flex shrink-0 items-center gap-[clamp(4px,0.8vw,9px)]">
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="text-white/65 hover:text-white"
                      aria-label="Open messages"
                    />
                  }
                >
                  <MessageSquare className="size-[13px]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#252525] text-white">
                  <DropdownMenuLabel>Messages</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>No new messages</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      size="icon-sm"
                      className="relative text-white/65 hover:text-white"
                      aria-label="Open notifications"
                    />
                  }
                >
                  <Bell className="size-[13px]" />
                  <span className="absolute right-[6px] top-[5px] size-[4px] rounded-full bg-[#f35177]" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#252525] text-white">
                  <DropdownMenuLabel>Notifications</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Your store is looking good today.</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              <Button
                variant="ghost"
                size="icon-sm"
                className="hidden text-white/65 hover:text-white sm:inline-flex"
                aria-label="Calendar"
              >
                <CalendarDays className="size-[13px]" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="ghost"
                      className="h-[clamp(26px,3.4vw,39px)] gap-[clamp(6px,.9vw,10px)] rounded-full border border-white/[.18] bg-[#242424] px-[clamp(6px,.9vw,10px)] text-[clamp(9px,1vw,12px)] text-white/90 hover:bg-white/10 sm:ml-1"
                      aria-label="Open account menu"
                    />
                  }
                >
                  <Avatar size="sm" className="size-[17px]">
                    <AvatarImage
                      src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=64&q=80"
                      alt=""
                    />
                    <AvatarFallback className="bg-[#80545e] text-[7px]">I</AvatarFallback>
                  </Avatar>
                  <span className="hidden sm:inline">Ismail</span>
                  <ChevronDown className="size-[10px] text-white/60" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-[#252525] text-white">
                  <DropdownMenuLabel>Ismail</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => setActiveSection("Settings")}>
                    <Settings />
                    Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setActiveSection("Logout")}>
                    <LogOut />
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </header>

          <div className="dashboard-page-heading flex items-center justify-between gap-3">
            <h1 className="truncate font-semibold tracking-[-.025em] text-white">
              {activeSection}
            </h1>
            <div className="flex shrink-0 items-center gap-2">
              <span className="hidden text-[9px] text-white/50 sm:inline">Filter by</span>
              <Select value={period} onValueChange={(value) => value && setPeriod(value)}>
                <SelectTrigger className="h-[24px] gap-1 rounded-full border-white/[.2] bg-transparent px-2 text-[9px] text-white/90 focus-visible:ring-0">
                  <CalendarDays className="size-[10px] text-white/70" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent align="end" className="bg-[#252525] text-white">
                  <SelectItem value="Last 7 days">Last 7 days</SelectItem>
                  <SelectItem value="Last month">Last month</SelectItem>
                  <SelectItem value="This month">This month</SelectItem>
                  <SelectItem value="Last year">Last year</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="dashboard-grid grid grid-cols-1 min-[640px]:grid-cols-2">
            <div className="min-[640px]:col-span-2">
              <SalesChart period={period} />
            </div>
            <EarningsChart period={period} />
            <TopProducts searchTerm={searchTerm} />
            <CountrySales />
            <CategoryBreakdown />
          </div>
        </div>
      </main>
    </div>
  );
}

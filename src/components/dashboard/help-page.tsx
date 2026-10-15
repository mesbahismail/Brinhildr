"use client";

import { useState } from "react";
import {
  BookOpen,
  ChevronDown,
  CreditCard,
  Mail,
  MessageSquare,
  Phone,
  ShieldCheck,
  Truck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { EmptyState, panelCard, SectionTitle } from "@/components/dashboard/page-kit";

const topics = [
  { id: "start", title: "Getting started", description: "Set up your store, products and team.", icon: BookOpen },
  { id: "orders", title: "Orders & shipping", description: "Fulfil, track and refund orders.", icon: Truck },
  { id: "payments", title: "Payments & payouts", description: "Get paid and manage fees.", icon: CreditCard },
  { id: "account", title: "Account & security", description: "Profile, passwords and access.", icon: ShieldCheck },
] as const;

type TopicId = (typeof topics)[number]["id"];

const faqs: { topic: TopicId; question: string; answer: string }[] = [
  { topic: "start", question: "How do I add my first product?", answer: "Go to Inventory and select New. Give the product a name, then fill in its price, quantity and category. It stays in Draft until you publish it." },
  { topic: "start", question: "Can I invite teammates?", answer: "Yes. Open Settings, then Store, and invite people by email. Each teammate gets their own login and you can remove access at any time." },
  { topic: "orders", question: "How do I change an order’s status?", answer: "Open the order from the Orders page and select Edit. Status moves from Ordered to Confirmed, Shipped and Delivered, and the client is notified at each step." },
  { topic: "orders", question: "How do refunds work?", answer: "Open the order, select the items to refund and confirm. The money goes back to the original payment method, usually within 5 to 10 business days." },
  { topic: "payments", question: "When do I receive payouts?", answer: "Payouts are sent every Monday for the previous week’s delivered orders, minus fees and refunds." },
  { topic: "payments", question: "Which payment methods can clients use?", answer: "Clients can pay by card or PayPal. You can turn methods on or off from Settings." },
  { topic: "account", question: "How do I turn on two-factor authentication?", answer: "Open Settings, then Security, and switch on two-factor authentication. You’ll be asked for a code from your phone whenever you log in." },
  { topic: "account", question: "I forgot my password. What should I do?", answer: "On the login screen, choose Forgot password and follow the link we email you. The link expires after one hour." },
];

const services = [
  { name: "Storefront", status: "Operational" },
  { name: "Checkout & payments", status: "Operational" },
  { name: "Order notifications", status: "Operational" },
  { name: "AI assistant", status: "Operational" },
];

export function HelpPage({
  searchTerm,
  onOpenChat,
}: {
  searchTerm: string;
  onOpenChat: () => void;
}) {
  const [topic, setTopic] = useState<TopicId | null>(null);
  const [openQuestion, setOpenQuestion] = useState<string | null>(faqs[0].question);

  const visibleFaqs = faqs.filter(
    (faq) =>
      (!topic || faq.topic === topic) &&
      `${faq.question} ${faq.answer}`.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <section className="space-y-[clamp(20px,calc(2vw+4px),28px)] pb-6">
      <Card className={`${panelCard} relative gap-0 overflow-hidden p-[clamp(20px,3vw,36px)]`}>
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-20 -top-24 size-72 rounded-full bg-[#f35177]/20 blur-3xl"
        />
        <p className="text-[11px] font-semibold uppercase tracking-[.12em] text-[#ff9aa9]">Help center</p>
        <h2 className="mt-2 text-[clamp(20px,2.4vw,30px)] font-medium text-white">How can we help you today?</h2>
        <p className="mt-2 max-w-xl text-[12px] leading-relaxed text-white/55">
          Browse a topic, search the questions using the bar above, or reach the support team directly.
        </p>
      </Card>

      <div className="grid grid-cols-1 gap-5 min-[640px]:grid-cols-2 min-[1100px]:grid-cols-4">
        {topics.map(({ id, title, description, icon: Icon }) => {
          const active = topic === id;
          const count = faqs.filter((faq) => faq.topic === id).length;
          return (
            <button
              key={id}
              type="button"
              aria-pressed={active}
              onClick={() => setTopic(active ? null : id)}
              className={`group rounded-xl border p-4 text-left transition-colors sm:p-5 ${
                active
                  ? "border-[#f35177]/60 bg-gradient-to-br from-[#3a2a2e] to-[#262224]"
                  : "border-white/[.08] bg-gradient-to-br from-[#292929] to-[#222] hover:border-white/20"
              }`}
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#f04479] to-[#ff8866] shadow-[0_8px_20px_rgba(240,68,121,.25)]">
                <Icon className="size-5 text-white" />
              </span>
              <span className="mt-4 block text-sm font-semibold text-white/90">{title}</span>
              <span className="mt-1 block text-[11px] leading-relaxed text-white/50">{description}</span>
              <span className="mt-3 block text-[10px] font-medium text-white/40">
                {count} questions {active && "· showing"}
              </span>
            </button>
          );
        })}
      </div>

      <div className="grid grid-cols-1 gap-5 min-[1100px]:grid-cols-[minmax(0,1fr)_340px]">
        <div>
          <SectionTitle title="Frequently asked questions">
            {topic && (
              <button type="button" onClick={() => setTopic(null)} className="text-[11px] text-[#ff9aa9] hover:text-white">
                Show all topics
              </button>
            )}
          </SectionTitle>
          {visibleFaqs.length ? (
            <Card className={`${panelCard} gap-0 divide-y divide-white/[.07] p-0`}>
              {visibleFaqs.map((faq) => {
                const open = openQuestion === faq.question;
                return (
                  <div key={faq.question}>
                    <button
                      type="button"
                      aria-expanded={open}
                      onClick={() => setOpenQuestion(open ? null : faq.question)}
                      className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
                    >
                      <span className="text-[13px] font-medium text-white/90">{faq.question}</span>
                      <ChevronDown
                        className={`size-4 shrink-0 text-white/50 transition-transform ${open ? "rotate-180 text-white" : ""}`}
                      />
                    </button>
                    {open && <p className="-mt-1 px-5 pb-4 text-[12px] leading-relaxed text-white/55">{faq.answer}</p>}
                  </div>
                );
              })}
            </Card>
          ) : (
            <EmptyState>No questions match your search.</EmptyState>
          )}
        </div>

        <div className="space-y-5">
          <SectionTitle title="Contact us" />
          <Card className={`${panelCard} -mt-1 gap-3 p-4`}>
            <Button
              type="button"
              onClick={onOpenChat}
              className="h-11 justify-start gap-3 rounded-xl bg-gradient-to-r from-[#f04479] to-[#ff8866] px-4 text-[13px] text-white shadow-[0_8px_20px_rgba(240,68,121,.25)] hover:brightness-110"
            >
              <MessageSquare className="size-4" />
              Start a live chat
              <span className="ml-auto text-[10px] font-normal text-white/80">Replies in ~2 min</span>
            </Button>
            <a
              href="mailto:support@brinhildr.com"
              className="flex h-11 items-center gap-3 rounded-xl border border-white/[.1] px-4 text-[13px] text-white/85 transition-colors hover:bg-white/[.05]"
            >
              <Mail className="size-4 text-white/60" />
              Email support
              <span className="ml-auto text-[10px] text-white/40">Within a day</span>
            </a>
            <a
              href="tel:+15550100"
              className="flex h-11 items-center gap-3 rounded-xl border border-white/[.1] px-4 text-[13px] text-white/85 transition-colors hover:bg-white/[.05]"
            >
              <Phone className="size-4 text-white/60" />
              Call us
              <span className="ml-auto text-[10px] text-white/40">Mon–Fri, 9–6</span>
            </a>
          </Card>

          <Card className={`${panelCard} gap-0 p-0`}>
            <div className="flex items-center gap-2.5 border-b border-white/[.08] px-4 py-3.5">
              <span className="relative flex size-2.5">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-[#2fe4c0] opacity-50" />
                <span className="relative inline-flex size-2.5 rounded-full bg-[#2fe4c0]" />
              </span>
              <span className="text-[13px] font-medium text-white/90">All systems operational</span>
            </div>
            <ul className="px-4 py-2">
              {services.map((service) => (
                <li key={service.name} className="flex items-center justify-between py-2 text-[11px]">
                  <span className="text-white/65">{service.name}</span>
                  <span className="text-[#2fe4c0]">{service.status}</span>
                </li>
              ))}
            </ul>
          </Card>
        </div>
      </div>
    </section>
  );
}

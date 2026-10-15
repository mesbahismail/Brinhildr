"use client";

import { useEffect, useRef, useState } from "react";
import type { FormEvent } from "react";
import Link from "next/link";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bot,
  Check,
  ChevronRight,
  Download,
  Eye,
  FileText,
  LayoutGrid,
  Mic,
  Plus,
  ShoppingBag,
  Store,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardMenu } from "@/components/dashboard/card-menu";
import { createTextPdf, downloadBlob } from "@/lib/dashboard-utils";
import "./dashboard.css";

const prompts = [
  {
    icon: BarChart3,
    title: "Show my sales growth",
    subtitle: "A linear graph of your store sales over the last 5 years.",
    message: "Give me a linear graph showing my store sales in the last 5 years",
  },
  {
    icon: Store,
    title: "Plan a revenue strategy",
    subtitle: "A PDF of strategies that could grow sales and revenue.",
    message: "Give me a PDF file that contains strategies to grow my revenue",
  },
  {
    icon: LayoutGrid,
    title: "Review my inventory",
    subtitle: "See what is running low, out of stock or still in draft.",
    message: "Give me an overview of my inventory",
  },
  {
    icon: ShoppingBag,
    title: "Find products to sell",
    subtitle: "Trending products picked from market insights.",
    message: "Give me the best products to sell this season",
  },
];

const yearlySales = [
  1000, 1200, 1350, 1300, 1600, 1700, 1800, 1650, 1900, 2000, 2050, 2450, 2550, 2300,
  2500, 2550, 2400, 2300, 2450, 2350,
].map((sales, index) => ({
  period: `Y${Math.floor(index / 4) + 1} Q${(index % 4) + 1}`,
  sales,
}));

type Product = {
  name: string;
  category: string;
  price: string;
  sellingPrice: string;
  profit: string;
  image: string;
};

function unsplash(id: string) {
  return `https://images.unsplash.com/${id}?auto=format&fit=crop&w=240&h=240&q=80`;
}

const productSets: Record<"trending" | "similar" | "different", Product[]> = {
  trending: [
    { name: "Chic Maroon Satchel", category: "Leather, Bags", price: "$120", sellingPrice: "$300", profit: "$180", image: unsplash("photo-1575032617751-6ddec2089882") },
    { name: "Elegant Black Tote", category: "Leather, Bags", price: "$140", sellingPrice: "$320", profit: "$180", image: unsplash("photo-1614179689702-355944cd0918") },
    { name: "Stylish Grey Crossbody", category: "Leather, Bags", price: "$95", sellingPrice: "$240", profit: "$145", image: unsplash("photo-1559563458-527698bf5295") },
    { name: "Trendy Teal Handbag", category: "Leather, Bags", price: "$110", sellingPrice: "$280", profit: "$170", image: unsplash("photo-1594223274512-ad4803739b7c") },
  ],
  similar: [
    { name: "Classic Red Satchel", category: "Leather, Bags", price: "$130", sellingPrice: "$310", profit: "$180", image: unsplash("photo-1584917865442-de89df76afd3") },
    { name: "Woven Tan Top-Handle", category: "Rattan, Bags", price: "$85", sellingPrice: "$210", profit: "$125", image: unsplash("photo-1590874103328-eac38a683ce7") },
    { name: "Cognac Saddle Bag", category: "Leather, Bags", price: "$90", sellingPrice: "$230", profit: "$140", image: unsplash("photo-1600857062241-98e5dba7f214") },
    { name: "Blush Chain Bag", category: "Vegan leather, Bags", price: "$60", sellingPrice: "$160", profit: "$100", image: unsplash("photo-1566150905458-1bf1fc113f0d") },
  ],
  different: [
    { name: "Navy Commuter Backpack", category: "Nylon, Backpacks", price: "$70", sellingPrice: "$180", profit: "$110", image: unsplash("photo-1553062407-98eeb64c6a62") },
    { name: "Rose Suede Backpack", category: "Suede, Backpacks", price: "$80", sellingPrice: "$200", profit: "$120", image: unsplash("photo-1622560480605-d83c853bc5c3") },
  ],
};

const strategyLines = [
  "A sample brief prepared by the Brinhildr demo assistant.",
  "",
  "1. Bundle best sellers with slower items to lift average order value.",
  "2. Win back lapsed clients with a time-limited loyalty discount.",
  "3. Promote top products on the channels that convert best.",
  "4. Restock fast movers early so they never sell out mid-campaign.",
  "5. Run seasonal flash sales with clear start and end dates.",
  "6. Collect reviews after delivery and feature them on product pages.",
  "7. Offer free shipping above a threshold slightly over your average order.",
  "8. Review margins monthly and retire products that no longer earn their space.",
];

type Reply =
  | { kind: "text"; text: string; link?: { href: string; label: string } }
  | { kind: "chart"; intro: string; outro: string }
  | { kind: "file"; intro: string }
  | { kind: "products"; intro: string; set: keyof typeof productSets; question?: string };

type Message =
  | { id: number; role: "user"; text: string }
  | { id: number; role: "assistant"; reply: Reply };

function buildReply(text: string): Reply {
  const request = text.toLowerCase();
  if (request === "yes, please.") {
    return { kind: "products", intro: "Here are more products in the same style:", set: "similar" };
  }
  if (request.startsWith("no, give me different")) {
    return {
      kind: "products",
      intro: "Here are a few different options. Backpacks are trending with the same audience:",
      set: "different",
    };
  }
  if (/graph|chart|sales growth|sales in/.test(request)) {
    return {
      kind: "chart",
      intro: "Here’s a linear graph illustrating the growth of your store sales in the last 5 years:",
      outro:
        "This chart shows a steady increase in your sales year over year, with a slight decrease in the last year.",
    };
  }
  if (/pdf|strateg|plan|report/.test(request)) {
    return {
      kind: "file",
      intro:
        "Here is a PDF that contains strategies used by companies around the world to grow sales and revenue.",
    };
  }
  if (/inventory|stock/.test(request)) {
    return {
      kind: "text",
      text: "You have 11 products: 7 published, 3 in draft and 1 deleted. Lightweight Utility Jacket is out of stock, and Casual Denim Jacket (190 units) and Cozy Knit Cardigan (280 units) are running low.",
      link: { href: "/inventory", label: "Open inventory" },
    };
  }
  if (/product|sell|trend/.test(request)) {
    return {
      kind: "products",
      intro:
        "Here are some of the top trending products to consider selling this season, based on market insights and consumer interests:",
      set: "trending",
      question: "Do you want more products like this?",
    };
  }
  return {
    kind: "text",
    text: "I can show your sales growth, put together a strategy PDF, review your inventory or suggest products to sell. Try asking for one of those.",
  };
}

function ChatChart() {
  return (
    <div className="dashboard-ai-panel overflow-hidden rounded-[20px] border border-white/[.06] bg-gradient-to-br from-[#2c2c2c] to-[#232323] shadow-[0_14px_35px_rgba(0,0,0,.2)]">
      <div className="flex items-center justify-between px-6 pb-2 pt-5">
        <h3 className="text-[clamp(14px,1.5vw,18px)] font-medium text-white">
          My store sales in the last 5 years
        </h3>
        <CardMenu
          filename="brinhildr-sales-5-years.csv"
          headers={["Period", "Sales"]}
          rows={yearlySales.map(({ period, sales }) => [period, sales])}
        />
      </div>
      <div className="h-[clamp(200px,24vw,300px)] px-3 pb-4">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={yearlySales} margin={{ top: 10, right: 16, bottom: 0, left: 0 }}>
            <defs>
              <linearGradient id="ai-chat-sales" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#2fe4c0" stopOpacity={0.42} />
                <stop offset="100%" stopColor="#2fe4c0" stopOpacity={0.02} />
              </linearGradient>
            </defs>
            <CartesianGrid stroke="rgba(255,255,255,.09)" horizontal={false} />
            <XAxis
              dataKey="period"
              ticks={["Y1 Q2", "Y2 Q2", "Y3 Q2", "Y4 Q2", "Y5 Q2"]}
              tickFormatter={(value: string) => `Year ${value.slice(1, 2)}`}
              tick={{ fill: "rgba(255,255,255,.5)", fontSize: 10 }}
              tickLine={false}
              axisLine={{ stroke: "rgba(255,255,255,.14)" }}
              tickMargin={6}
            />
            <YAxis
              ticks={[0, 500, 1000, 1500, 2000, 2500, 3000]}
              domain={[0, 3000]}
              tickFormatter={(value: number) =>
                value === 0 ? "0" : value < 1000 ? `$${value}` : `$${value / 1000}k`
              }
              tick={{ fill: "rgba(255,255,255,.5)", fontSize: 10 }}
              tickLine={false}
              axisLine={false}
              width={40}
            />
            <Tooltip
              contentStyle={{
                background: "#1b1b1b",
                border: "1px solid rgba(255,255,255,.12)",
                borderRadius: 8,
                fontSize: 11,
              }}
              labelStyle={{ color: "#fff" }}
              formatter={(value) => [`$${Number(value).toLocaleString("en-US")}`, "Sales"]}
            />
            <Area
              type="linear"
              dataKey="sales"
              stroke="#2fe4c0"
              strokeWidth={2}
              fill="url(#ai-chat-sales)"
              animationDuration={650}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function ChatFile() {
  const [pdf] = useState(() =>
    createTextPdf("Revenue Growth Strategy", strategyLines),
  );
  const size = `${Math.max(1, Math.round(pdf.size / 1024))} KB`;

  return (
    <div className="dashboard-ai-panel flex w-full max-w-[460px] items-center gap-4 rounded-[18px] border border-white/[.06] bg-gradient-to-br from-[#2c2c2c] to-[#232323] p-3 pr-4 shadow-[0_14px_35px_rgba(0,0,0,.2)]">
      <span className="flex size-[54px] shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[#474747] to-[#2e2e2e]">
        <FileText className="size-6 text-white/75" />
      </span>
      <span className="min-w-0 flex-1">
        <span className="block truncate text-[15px] font-medium text-white">Revenue Growth Strategy</span>
        <span className="mt-1 flex items-center gap-2 text-[11px] text-white/50">
          PDF File
          <span aria-hidden="true" className="size-1 rounded-full bg-white/30" />
          {size}
        </span>
      </span>
      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0 rounded-full border-white/25 bg-transparent text-white/80 hover:bg-white/[.08]"
        aria-label="Preview Revenue Growth Strategy PDF"
        onClick={() => window.open(URL.createObjectURL(pdf), "_blank", "noopener")}
      >
        <Eye className="size-4" />
      </Button>
      <Button
        variant="outline"
        size="icon"
        className="size-9 shrink-0 rounded-full border-white/25 bg-transparent text-white/80 hover:bg-white/[.08]"
        aria-label="Download Revenue Growth Strategy PDF"
        onClick={() => downloadBlob("revenue-growth-strategy.pdf", pdf)}
      >
        <Download className="size-4" />
      </Button>
    </div>
  );
}

function ChatProducts({ products }: { products: Product[] }) {
  const [added, setAdded] = useState<string[]>([]);

  return (
    <div className="grid grid-cols-1 gap-[clamp(12px,1.4vw,20px)] min-[900px]:grid-cols-2">
      {products.map((product) => {
        const isAdded = added.includes(product.name);
        return (
          <article
            key={product.name}
            className="dashboard-ai-panel flex gap-4 rounded-[18px] border border-white/[.06] bg-gradient-to-br from-[#2c2c2c] to-[#232323] p-3 shadow-[0_14px_35px_rgba(0,0,0,.2)]"
          >
            <span
              role="img"
              aria-label={product.name}
              className="size-[clamp(84px,8vw,116px)] shrink-0 rounded-xl bg-white/5 bg-cover bg-center"
              style={{ backgroundImage: `url("${product.image}")` }}
            />
            <div className="flex min-w-0 flex-1 flex-col justify-between py-1 pr-1">
              <div className="flex items-start justify-between gap-2 border-b border-white/[.1] pb-2.5">
                <div className="min-w-0">
                  <h3 className="truncate text-[clamp(13px,1.3vw,16px)] font-medium text-white">
                    {product.name}
                  </h3>
                  <p className="mt-0.5 truncate text-[10px] text-white/50">{product.category}</p>
                </div>
                <Button
                  variant="outline"
                  size="icon"
                  className={`size-8 shrink-0 rounded-full bg-transparent ${
                    isAdded
                      ? "border-[#2fe4c0]/50 text-[#2fe4c0] hover:bg-[#2fe4c0]/10"
                      : "border-white/25 text-white/80 hover:bg-white/[.08]"
                  }`}
                  aria-pressed={isAdded}
                  aria-label={isAdded ? `Remove ${product.name} from inventory` : `Add ${product.name} to inventory`}
                  onClick={() =>
                    setAdded((current) =>
                      isAdded ? current.filter((name) => name !== product.name) : [...current, product.name],
                    )
                  }
                >
                  {isAdded ? <Check className="size-4" /> : <Plus className="size-4" />}
                </Button>
              </div>
              <dl className="grid grid-cols-3 pt-2.5">
                {[
                  ["Price", product.price],
                  ["Selling price", product.sellingPrice],
                  ["Profit", product.profit],
                ].map(([label, value], index) => (
                  <div key={label} className={index ? "border-l border-white/[.1] pl-3" : ""}>
                    <dt className="text-[8px] text-white/45">{label}</dt>
                    <dd className="text-[clamp(12px,1.2vw,15px)] font-medium text-white">{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </article>
        );
      })}
    </div>
  );
}

function AssistantReply({
  reply,
  showActions,
  onSend,
}: {
  reply: Reply;
  showActions: boolean;
  onSend: (text: string) => void;
}) {
  const textClass = "text-[clamp(12px,1.15vw,14px)] leading-relaxed text-white/85";

  if (reply.kind === "text") {
    return (
      <div className="space-y-3">
        <p className={textClass}>{reply.text}</p>
        {reply.link && (
          <Link
            href={reply.link.href}
            className="inline-flex h-9 items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-medium text-white/85 transition-colors hover:bg-white/[.06]"
          >
            {reply.link.label}
            <ArrowRight className="size-3.5" />
          </Link>
        )}
      </div>
    );
  }

  if (reply.kind === "chart") {
    return (
      <div className="space-y-4">
        <p className={textClass}>{reply.intro}</p>
        <ChatChart />
        <p className={textClass}>{reply.outro}</p>
      </div>
    );
  }

  if (reply.kind === "file") {
    return (
      <div className="space-y-4">
        <p className={textClass}>{reply.intro}</p>
        <ChatFile />
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <p className={textClass}>{reply.intro}</p>
      <ChatProducts products={productSets[reply.set]} />
      {reply.question && (
        <>
          <p className={textClass}>{reply.question}</p>
          {showActions && (
            <div className="flex flex-wrap gap-3">
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-medium text-white/85 transition-colors hover:bg-white/[.06]"
                onClick={() => onSend("Yes, please.")}
              >
                <Check className="size-4" />
                Yes, please.
              </button>
              <button
                type="button"
                className="inline-flex h-10 items-center gap-2 rounded-full border border-white/20 px-4 text-xs font-medium text-white/85 transition-colors hover:bg-white/[.06]"
                onClick={() => onSend("No, give me different options")}
              >
                <X className="size-4" />
                No, give me different options
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

type SpeechRecognitionLike = {
  lang: string;
  interimResults: boolean;
  onresult: ((event: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
};

function getSpeechRecognition() {
  if (typeof window === "undefined") return undefined;
  const speechWindow = window as unknown as {
    SpeechRecognition?: new () => SpeechRecognitionLike;
    webkitSpeechRecognition?: new () => SpeechRecognitionLike;
  };
  return speechWindow.SpeechRecognition ?? speechWindow.webkitSpeechRecognition;
}

export function AIChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [draft, setDraft] = useState("");
  const [thinking, setThinking] = useState(false);
  const [listening, setListening] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const replyTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const scroller = scrollRef.current;
    scroller?.scrollTo({ top: scroller.scrollHeight, behavior: "smooth" });
  }, [messages, thinking]);

  useEffect(
    () => () => {
      window.clearTimeout(replyTimer.current);
      recognitionRef.current?.stop();
    },
    [],
  );

  function send(text: string) {
    const message = text.trim();
    if (!message || thinking) return;
    setMessages((current) => [...current, { id: current.length, role: "user", text: message }]);
    setDraft("");
    setThinking(true);
    replyTimer.current = window.setTimeout(() => {
      setMessages((current) => [
        ...current,
        { id: current.length, role: "assistant", reply: buildReply(message) },
      ]);
      setThinking(false);
    }, 700);
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    send(draft);
  }

  function toggleVoice() {
    if (listening) {
      recognitionRef.current?.stop();
      return;
    }
    const Recognition = getSpeechRecognition();
    if (!Recognition) return;
    const recognition = new Recognition();
    recognition.lang = "en-US";
    recognition.interimResults = true;
    recognition.onresult = (event) => {
      setDraft(
        Array.from(event.results)
          .map((result) => result[0]?.transcript ?? "")
          .join(""),
      );
    };
    recognition.onend = () => setListening(false);
    recognitionRef.current = recognition;
    recognition.start();
    setListening(true);
  }

  const lastAssistantId = [...messages].reverse().find((message) => message.role === "assistant")?.id;

  return (
    <section className="dashboard-ai-page">
      <div ref={scrollRef} className="dashboard-ai-scroll" aria-live="polite">
        <div className="dashboard-ai-thread">
          {messages.length === 0 ? (
            <div className="flex min-h-full flex-col items-center justify-center py-8">
              <div className="mb-6 flex size-[clamp(88px,9vw,128px)] items-center justify-center rounded-full bg-gradient-to-br from-[#ff8866] to-[#f04479] shadow-[0_0_48px_rgba(243,81,119,.5),0_0_110px_rgba(243,81,119,.22)]">
                <Bot className="size-[45%] text-white" strokeWidth={1.8} />
              </div>
              <h2 className="mb-[clamp(28px,4vw,56px)] text-center text-[clamp(20px,2.4vw,30px)] font-medium text-white">
                Hi, how can I help you today?
              </h2>
              <div className="grid w-full grid-cols-1 gap-[clamp(12px,1.6vw,22px)] min-[900px]:grid-cols-2">
                {prompts.map(({ icon: Icon, title, subtitle, message }) => (
                  <button
                    key={title}
                    type="button"
                    onClick={() => send(message)}
                    className="dashboard-ai-panel group flex items-center gap-[clamp(12px,1.4vw,18px)] rounded-[20px] border border-white/[.06] bg-gradient-to-br from-[#2c2c2c] to-[#232323] p-[clamp(10px,1.2vw,16px)] text-left shadow-[0_14px_35px_rgba(0,0,0,.2)] transition-colors hover:border-white/[.14]"
                  >
                    <span className="flex size-[clamp(56px,6vw,84px)] shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-[#4a4a4a] to-[#2e2e2e] shadow-[inset_0_1px_0_rgba(255,255,255,.08)]">
                      <Icon className="size-[45%] text-white/75" strokeWidth={2.2} />
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="block text-[clamp(13px,1.3vw,16px)] font-semibold text-white">
                        {title}
                      </span>
                      <span className="mt-1 block text-[clamp(10px,.95vw,12px)] leading-snug text-white/55">
                        {subtitle}
                      </span>
                    </span>
                    <ChevronRight className="size-5 shrink-0 text-white/50 transition-transform group-hover:translate-x-0.5 group-hover:text-white" />
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-[clamp(20px,2.4vw,32px)] py-6">
              {messages.map((message) =>
                message.role === "user" ? (
                  <div key={message.id} className="flex justify-end">
                    <p className="max-w-[85%] rounded-[24px] border border-white/[.1] bg-gradient-to-br from-[#2c2c2c] to-[#242424] px-5 py-3 text-[clamp(11px,1vw,13px)] font-semibold text-white/90 shadow-[0_8px_24px_rgba(0,0,0,.18)]">
                      {message.text}
                    </p>
                  </div>
                ) : (
                  <AssistantReply
                    key={message.id}
                    reply={message.reply}
                    showActions={message.id === lastAssistantId && !thinking}
                    onSend={send}
                  />
                ),
              )}
              {thinking && (
                <div className="flex items-center gap-1.5" role="status" aria-label="Assistant is typing">
                  {[0, 150, 300].map((delay) => (
                    <span
                      key={delay}
                      className="size-2 animate-bounce rounded-full bg-white/40"
                      style={{ animationDelay: `${delay}ms` }}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <form onSubmit={submit} className="dashboard-ai-composer">
        <div className="flex h-[clamp(42px,3.6vw,50px)] min-w-0 flex-1 items-center gap-3 rounded-full border border-white/[.14] bg-[#232323] pl-1.5 pr-4 shadow-[0_10px_30px_rgba(0,0,0,.25)] focus-within:border-white/30">
          <button
            type="button"
            onClick={toggleVoice}
            className={`flex size-[clamp(30px,2.6vw,36px)] shrink-0 items-center justify-center rounded-full transition-colors ${
              listening ? "bg-[#f35177] text-white" : "bg-white/[.1] text-white/70 hover:bg-white/[.16] hover:text-white"
            }`}
            aria-label={listening ? "Stop voice input" : "Start voice input"}
            aria-pressed={listening}
          >
            <Mic className="size-4" />
          </button>
          <input
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder={listening ? "Listening…" : "Ask anything"}
            aria-label="Ask the assistant"
            className="min-w-0 flex-1 bg-transparent text-[clamp(12px,1.05vw,14px)] text-white outline-none placeholder:text-white/45"
          />
        </div>
        <Button
          type="submit"
          size="icon"
          disabled={!draft.trim() || thinking}
          className="size-[clamp(42px,3.6vw,50px)] shrink-0 rounded-full bg-gradient-to-br from-[#f04479] to-[#ff8866] text-white shadow-[0_8px_24px_rgba(240,68,121,.35)] hover:brightness-110 disabled:opacity-60"
          aria-label="Send message"
        >
          <ArrowUp className="size-5" strokeWidth={2.4} />
        </Button>
      </form>
      <p className="dashboard-ai-note">Demo assistant · replies use sample store data</p>
    </section>
  );
}

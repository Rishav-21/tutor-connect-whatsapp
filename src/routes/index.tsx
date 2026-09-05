import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { MessageCircle, Send, BookOpen, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "WhatsApp Tutor Message Sender" },
      {
        name: "description",
        content:
          "Send a custom home-tutor promotion message to any phone number via WhatsApp.",
      },
      { property: "og:title", content: "WhatsApp Tutor Message Sender" },
      {
        property: "og:description",
        content:
          "Send a custom home-tutor promotion message to any phone number via WhatsApp.",
      },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Index,
});

const DEFAULT_MESSAGE = `📚 Experienced Home Tutors Available | Classes 1–14

Looking for a qualified and experienced home tutor for your child?

✅ Experienced Tutors
✅ Maths, Science & All Subjects
✅ Classes 1–14
✅ Home Tuition Available
🎓 Free Demo Class can also be arranged

If you have a tuition requirement, simply reply "YES" or share your details with us.

📞 Contact: 9319647541`;

function normalizePhone(raw: string): string {
  let digits = raw.replace(/[^\d+]/g, "");
  if (digits.startsWith("+")) digits = digits.slice(1);
  digits = digits.replace(/\D/g, "");
  // Default to India (+91) for 10-digit numbers without a country code
  if (digits.length === 10) digits = "91" + digits;
  return digits;
}

function Index() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState(DEFAULT_MESSAGE);

  const normalized = useMemo(() => normalizePhone(phone), [phone]);
  const isValid = normalized.length >= 11;

  const waLink = useMemo(() => {
    if (!isValid) return "#";
    const url = new URL("https://api.whatsapp.com/send");
    url.searchParams.set("phone", normalized);
    url.searchParams.set("text", message);
    return url.toString();
  }, [normalized, message, isValid]);

  const handleSend = () => {
    if (!isValid) return;
    window.open(waLink, "_blank", "noopener,noreferrer");
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-brand text-brand-foreground shadow-md">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-4">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-foreground/15">
            <MessageCircle className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-lg font-semibold leading-tight">
              WhatsApp Message Sender
            </h1>
            <p className="text-xs text-brand-foreground/80">
              Home Tutor Promotion
            </p>
          </div>
        </div>
      </header>

      <main className="mx-auto grid max-w-5xl gap-6 px-4 py-8 md:grid-cols-2">
        {/* Form */}
        <section className="rounded-2xl border bg-card p-6 shadow-sm">
          <div className="mb-5 flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-primary" />
            <h2 className="text-base font-semibold">Compose &amp; Send</h2>
          </div>

          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="phone">Recipient phone number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="e.g. 9876543210 or +91 98765 43210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                {phone
                  ? isValid
                    ? `Will send to: +${normalized}`
                    : "Enter a valid number (10 digits, or include country code)."
                  : "Indian numbers get +91 added automatically."}
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="message">Message</Label>
              <Textarea
                id="message"
                rows={14}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="resize-none text-sm leading-relaxed"
              />
            </div>

            <Button
              onClick={handleSend}
              disabled={!isValid || !message.trim()}
              className="w-full gap-2 text-base"
              size="lg"
            >
              <Send className="h-4 w-4" />
              Send via WhatsApp
            </Button>
            <p className="text-center text-xs text-muted-foreground">
              Opens WhatsApp with the message pre-filled — you press send there.
            </p>
          </div>
        </section>

        {/* Chat preview */}
        <section className="overflow-hidden rounded-2xl border shadow-sm">
          <div className="flex items-center gap-3 bg-brand px-4 py-3 text-brand-foreground">
            <div className="flex h-9 w-9 items-center justify-center rounded-full bg-brand-foreground/20">
              <BookOpen className="h-4 w-4" />
            </div>
            <div className="leading-tight">
              <p className="text-sm font-semibold">
                {isValid ? `+${normalized}` : "Recipient"}
              </p>
              <p className="text-xs text-brand-foreground/75">online</p>
            </div>
          </div>
          <div className="chat-pattern min-h-[420px] p-4">
            <div className="ml-auto max-w-[85%] rounded-xl rounded-tr-sm bg-bubble-out px-3 py-2 shadow-sm">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-bubble-out-foreground">
                {message}
              </p>
              <p className="mt-1 text-right text-[10px] text-bubble-out-foreground/60">
                {new Date().toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}{" "}
                ✓✓
              </p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}

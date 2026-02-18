import { useState } from "react";
import { Send, Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollReveal } from "@/hooks/useScrollReveal";

const EMAIL_SUBMISSION_STORAGE_KEY = "contact_form_last_submission_by_email";
const BROWSER_SUBMISSION_STORAGE_KEY = "contact_form_last_submission_browser";
const EMAIL_COOLDOWN_MS = 24* 60 * 60 * 1000;
const BROWSER_COOLDOWN_MS = 5 * 60 * 1000;

const readEmailSubmissionMap = (): Record<string, number> => {
  if (typeof window === "undefined") return {};

  try {
    const raw = window.localStorage.getItem(EMAIL_SUBMISSION_STORAGE_KEY);
    if (!raw) return {};

    const parsed = JSON.parse(raw) as unknown;
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};

    const sanitized: Record<string, number> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (typeof value === "number") {
        sanitized[key] = value;
      }
    }

    return sanitized;
  } catch {
    return {};
  }
};

const writeEmailSubmissionMap = (map: Record<string, number>) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(EMAIL_SUBMISSION_STORAGE_KEY, JSON.stringify(map));
};

const readBrowserLastSubmission = () => {
  if (typeof window === "undefined") return 0;

  const stored = window.localStorage.getItem(BROWSER_SUBMISSION_STORAGE_KEY);
  if (!stored) return 0;

  const parsed = Number(stored);
  return Number.isFinite(parsed) ? parsed : 0;
};

const writeBrowserLastSubmission = (timestamp: number) => {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(BROWSER_SUBMISSION_STORAGE_KEY, String(timestamp));
};

const ContactSection = () => {
  const [sent, setSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { ref, isVisible } = useScrollReveal();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");
    setIsSubmitting(true);

    const form = e.currentTarget;
    const formData = new FormData(form);
    const email = String(formData.get("email") ?? "")
      .trim()
      .toLowerCase();

    const now = Date.now();
    const lastBrowserSubmission = readBrowserLastSubmission();
    if (now - lastBrowserSubmission < BROWSER_COOLDOWN_MS) {
      const remainingSeconds = Math.ceil((BROWSER_COOLDOWN_MS - (now - lastBrowserSubmission)) / 1000);
      setSubmitError(`Please wait ${remainingSeconds}s before sending another message.`);
      setIsSubmitting(false);
      return;
    }

    const lastSubmissionByEmail = readEmailSubmissionMap();
    const lastEmailSubmission = lastSubmissionByEmail[email] ?? 0;
    if (now - lastEmailSubmission < EMAIL_COOLDOWN_MS) {
      const remainingMinutes = Math.ceil((EMAIL_COOLDOWN_MS - (now - lastEmailSubmission)) / 60000);
      setSubmitError(`This email already submitted recently. Please try again in ${remainingMinutes} minute${remainingMinutes === 1 ? "" : "s"}.`);
      setIsSubmitting(false);
      return;
    }

    formData.append("_subject", "New message from portfolio contact form");
    formData.append("_captcha", "false");

    try {
      const response = await fetch("https://formsubmit.co/ajax/alijahinnovates@gmail.com", {
        method: "POST",
        headers: {
          Accept: "application/json",
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to send message");
      }

      setSent(true);
      lastSubmissionByEmail[email] = now;
      writeEmailSubmissionMap(lastSubmissionByEmail);
      writeBrowserLastSubmission(now);
      form.reset();
      setTimeout(() => setSent(false), 3000);
    } catch {
      setSubmitError("Message could not be sent. Please email me directly at alijahinnovates@gmail.com.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-2xl" ref={ref}>
        <h2 className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <p className={`text-center text-muted-foreground mb-12 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          Have a project in mind? Let's talk!
        </p>

        <div className={`flex justify-center gap-8 mb-10 ${isVisible ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          {/* <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Mail className="h-4 w-4 text-primary" /> <a href="mailto:alijahinnovates@gmail.com">alijahinnovates@gmail.com</a>
          </div> */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" /> Lahore,Pakistan
          </div>
        </div>

        <div className={`glass rounded-2xl p-8 ${isVisible ? "animate-scale-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          {sent ? (
            <div className="text-center py-8 animate-scale-up">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground">Message Sent!</h3>
              <p className="text-muted-foreground mt-2">Thanks for reaching out. I'll get back to you soon.</p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input name="name" placeholder="Your Name" required className="bg-muted/50 border-border/50 focus:glow-primary" />
                <Input name="email" type="email" placeholder="Your Email" required className="bg-muted/50 border-border/50" />
              </div>
              <Input name="subject" placeholder="Subject" required className="bg-muted/50 border-border/50" />
              <Textarea name="message" placeholder="Your Message" required rows={5} className="bg-muted/50 border-border/50 resize-none" />
              {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
              <Button type="submit" disabled={isSubmitting} className="w-full rounded-full glow-primary">
                <Send className="h-4 w-4 mr-2" /> {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

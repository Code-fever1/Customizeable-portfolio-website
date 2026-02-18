import { useState, type FormEvent } from "react";
import { Send, Mail, MapPin, CheckCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useScrollReveal } from "@/hooks/useScrollReveal";

type ContactSectionProps = {
  email?: string;
  location: string;
};

const ContactSection = ({ email, location }: ContactSectionProps) => {
  const [sent, setSent] = useState(false);
  const [submitError, setSubmitError] = useState("");
  const { ref, isVisible } = useScrollReveal();

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError("");

    if (!email) {
      setSubmitError("No email configured for this profile.");
      return;
    }

    const form = e.currentTarget;
    const formData = new FormData(form);
    const name = String(formData.get("name") ?? "").trim();
    const senderEmail = String(formData.get("email") ?? "").trim();
    const subject = String(formData.get("subject") ?? "").trim();
    const message = String(formData.get("message") ?? "").trim();

    const mailto = new URLSearchParams({
      subject: subject || `Portfolio inquiry for ${name}`,
      body: `Name: ${name}\nEmail: ${senderEmail}\n\n${message}`,
    });

    window.location.href = `mailto:${email}?${mailto.toString()}`;
    setSent(true);
    form.reset();
    setTimeout(() => setSent(false), 3000);
  };

  return (
    <section id="contact" className="relative py-24 md:py-32">
      <div className="container mx-auto px-4 max-w-2xl" ref={ref}>
        <h2 className={`text-3xl md:text-4xl font-display font-bold text-center mb-4 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          Get In <span className="gradient-text">Touch</span>
        </h2>
        <p className={`text-center text-muted-foreground mb-12 ${isVisible ? "animate-slide-up" : "opacity-0"}`}>
          Send a direct message using your email client.
        </p>

        <div className={`flex flex-wrap justify-center gap-8 mb-10 ${isVisible ? "animate-slide-up" : "opacity-0"}`} style={{ animationDelay: "0.15s" }}>
          {email ? (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Mail className="h-4 w-4 text-primary" />
              <a href={`mailto:${email}`}>{email}</a>
            </div>
          ) : null}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 text-primary" /> {location}
          </div>
        </div>

        <div className={`glass rounded-2xl p-8 ${isVisible ? "animate-scale-up" : "opacity-0"}`} style={{ animationDelay: "0.2s" }}>
          {sent ? (
            <div className="text-center py-8 animate-scale-up">
              <CheckCircle className="h-16 w-16 text-primary mx-auto mb-4" />
              <h3 className="font-display text-xl font-semibold text-foreground">
                Ready to Send
              </h3>
              <p className="text-muted-foreground mt-2">
                Your email app was opened with the message pre-filled.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid sm:grid-cols-2 gap-4">
                <Input
                  name="name"
                  placeholder="Your Name"
                  required
                  className="bg-muted/50 border-border/50 focus:glow-primary"
                />
                <Input
                  name="email"
                  type="email"
                  placeholder="Your Email"
                  required
                  className="bg-muted/50 border-border/50"
                />
              </div>
              <Input
                name="subject"
                placeholder="Subject"
                required
                className="bg-muted/50 border-border/50"
              />
              <Textarea
                name="message"
                placeholder="Your Message"
                required
                rows={5}
                className="bg-muted/50 border-border/50 resize-none"
              />
              {submitError ? <p className="text-sm text-destructive">{submitError}</p> : null}
              <Button type="submit" className="w-full rounded-full glow-primary">
                <Send className="h-4 w-4 mr-2" /> Compose Email
              </Button>
            </form>
          )}
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

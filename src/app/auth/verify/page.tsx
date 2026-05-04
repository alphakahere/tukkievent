"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { motion } from "motion/react";
import { toast } from "sonner";
import { ArrowLeft, MailCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const CODE_LENGTH = 6;
const RESEND_DELAY = 30;

export default function VerifyPage() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "votre adresse";

  const [digits, setDigits] = useState<string[]>(() => Array(CODE_LENGTH).fill(""));
  const [submitting, setSubmitting] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(RESEND_DELAY);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);

  useEffect(() => {
    inputs.current[0]?.focus();
  }, []);

  useEffect(() => {
    if (secondsLeft <= 0) return;
    const t = setTimeout(() => setSecondsLeft((s) => s - 1), 1000);
    return () => clearTimeout(t);
  }, [secondsLeft]);

  const code = digits.join("");
  const filled = code.length === CODE_LENGTH;

  function setDigit(i: number, v: string) {
    setDigits((prev) => {
      const next = [...prev];
      next[i] = v;
      return next;
    });
  }

  function handleChange(i: number, value: string) {
    const cleaned = value.replace(/\D/g, "");
    if (!cleaned) {
      setDigit(i, "");
      return;
    }
    if (cleaned.length === 1) {
      setDigit(i, cleaned);
      if (i < CODE_LENGTH - 1) inputs.current[i + 1]?.focus();
      return;
    }
    // Pasted multi-char string
    const chars = cleaned.slice(0, CODE_LENGTH - i).split("");
    setDigits((prev) => {
      const next = [...prev];
      chars.forEach((c, idx) => (next[i + idx] = c));
      return next;
    });
    const lastIdx = Math.min(i + chars.length, CODE_LENGTH - 1);
    inputs.current[lastIdx]?.focus();
  }

  function handleKeyDown(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
      setDigit(i - 1, "");
      e.preventDefault();
    } else if (e.key === "ArrowLeft" && i > 0) {
      inputs.current[i - 1]?.focus();
    } else if (e.key === "ArrowRight" && i < CODE_LENGTH - 1) {
      inputs.current[i + 1]?.focus();
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!filled) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 700));
    setSubmitting(false);
    toast.success("Compte vérifié avec succès !");
    router.push("/profile");
  }

  function handleResend() {
    if (secondsLeft > 0) return;
    toast.success("Un nouveau code vous a été envoyé.");
    setDigits(Array(CODE_LENGTH).fill(""));
    setSecondsLeft(RESEND_DELAY);
    inputs.current[0]?.focus();
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <Link
        href="/auth/login"
        className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700"
      >
        <ArrowLeft size={15} />
        Retour
      </Link>

      <header>
        <div className="w-14 h-14 rounded-md bg-primary/10 flex items-center justify-center mb-4">
          <MailCheck size={26} className="text-primary" />
        </div>
        <h1 className="text-2xl font-bold text-gray-900">Vérifiez votre email</h1>
        <p className="mt-1.5 text-sm text-gray-500">
          Saisissez le code à 6 chiffres envoyé à
          <br />
          <span className="font-semibold text-gray-900">{email}</span>.
        </p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex justify-between gap-2" onPaste={(e) => {
          e.preventDefault();
          handleChange(0, e.clipboardData.getData("text"));
        }}>
          {digits.map((d, i) => (
            <Input
              key={i}
              ref={(el) => { inputs.current[i] = el; }}
              type="text"
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={CODE_LENGTH}
              value={d}
              onChange={(e) => handleChange(i, e.target.value)}
              onKeyDown={(e) => handleKeyDown(i, e)}
              onFocus={(e) => e.target.select()}
              className="h-14 text-center text-xl font-bold"
              aria-label={`Chiffre ${i + 1}`}
            />
          ))}
        </div>

        <Button
          type="submit"
          disabled={!filled || submitting}
          className="w-full h-11 rounded-md text-sm font-semibold"
        >
          {submitting ? (
            <>
              <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              Vérification…
            </>
          ) : (
            "Vérifier"
          )}
        </Button>
      </form>

      <div className="text-center text-sm">
        <p className="text-gray-500">
          Code non reçu ?{" "}
          {secondsLeft > 0 ? (
            <span className="text-gray-400">
              Renvoyer dans <span className="font-semibold tabular-nums">{secondsLeft}s</span>
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-primary hover:underline"
            >
              Renvoyer le code
            </button>
          )}
        </p>
      </div>
    </motion.div>
  );
}

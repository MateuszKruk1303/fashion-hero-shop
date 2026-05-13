"use client";

import { useState, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { getSellerById } from "@/data/sellers";
import { logCpcEvent } from "@/lib/cpc-analytics";

const GOAL_OPTIONS = [
  { value: "increase-orders", label: "Zwiększenie zamówień" },
  { value: "rebuild-visibility", label: "Odbudowa widoczności" },
  { value: "test-ads", label: "Test czy reklama działa w mojej kategorii" },
  { value: "beat-competition", label: "Wyprzedzenie konkurentów" },
  { value: "other", label: "Inne" },
];

const BUDGET_OPTIONS = [
  { value: "<500", label: "Poniżej 500 PLN" },
  { value: "500-1000", label: "500–1000 PLN" },
  { value: "1000-2500", label: "1000–2500 PLN" },
  { value: ">2500", label: "Powyżej 2500 PLN" },
];

function WaitlistForm() {
  const searchParams = useSearchParams();
  const sellerId = searchParams.get("seller") ?? "s1";
  const seller = getSellerById(sellerId);

  const [selectedGoals, setSelectedGoals] = useState<string[]>([]);
  const [selectedBudget, setSelectedBudget] = useState<string>("");
  const [submitted, setSubmitted] = useState(false);

  const toggleGoal = useCallback((value: string) => {
    setSelectedGoals((prev) =>
      prev.includes(value) ? prev.filter((g) => g !== value) : [...prev, value]
    );
  }, []);

  const canSubmit = selectedGoals.length > 0 && selectedBudget !== "";

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || !seller) return;

    logCpcEvent({
      event: "waitlist_submit",
      sellerId: seller.id,
      segment: seller.segment,
      answers: { goals: selectedGoals, budget: selectedBudget },
    });

    setSubmitted(true);
  }

  if (!seller) {
    return (
      <div className="max-w-lg mx-auto px-4 py-16 text-center">
        <p className="text-[13px] text-warm-gray">Nie znaleziono profilu sprzedawcy.</p>
        <Link href="/seller/dashboard" className="inline-block mt-4 text-[12px] underline text-charcoal">
          Wróć do panelu
        </Link>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="max-w-lg mx-auto px-4 py-20 text-center">
        <div className="flex justify-center mb-6">
          <CheckCircle2 className="size-14 text-charcoal" strokeWidth={1.5} />
        </div>
        <h1 className="text-2xl font-light text-charcoal mb-3">Dziękujemy!</h1>
        <p className="text-[14px] text-warm-gray leading-relaxed">
          Zapisaliśmy Cię na listę oczekujących. Damy Ci znać, gdy uruchomimy program darmowych
          kampanii CPC dla sprzedawców FashionHero.
        </p>
        <Link
          href="/seller/dashboard"
          className="inline-block mt-8 btn-cta-outline text-[12px]"
        >
          Wróć do panelu
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-lg mx-auto px-4 py-12">
      {/* Breadcrumb */}
      <nav className="text-[11px] text-warm-gray mb-8 tracking-wide">
        <Link href="/" className="hover:text-charcoal transition-colors">Home</Link>
        <span className="mx-1.5">/</span>
        <Link href="/seller/dashboard" className="hover:text-charcoal transition-colors">Panel sprzedawcy</Link>
        <span className="mx-1.5">/</span>
        <span className="text-charcoal">Darmowa kampania CPC</span>
      </nav>

      <div className="mb-2 inline-block rounded-full bg-charcoal px-3 py-1 text-[10px] uppercase tracking-[0.8px] text-white font-medium">
        7 dni bezpłatnie
      </div>

      <h1 className="text-2xl font-light text-charcoal mt-3 mb-2">
        Uruchom pierwszą kampanię za darmo
      </h1>
      <p className="text-[13px] text-warm-gray mb-8 leading-relaxed">
        Powiedz nam trochę o sobie — pomoże nam dopasować program do Twoich potrzeb.
        Odpowiedź zajmie mniej niż minutę.
      </p>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Question 1 */}
        <fieldset>
          <legend className="text-[13px] font-medium text-charcoal mb-3">
            1. Jaki byłby Twój główny cel uruchamiając pierwszą kampanię?
            <span className="text-warm-gray font-normal ml-1">(wybierz wszystkie pasujące)</span>
          </legend>
          <div className="space-y-2">
            {GOAL_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded border transition-colors ${
                    selectedGoals.includes(opt.value)
                      ? "bg-charcoal border-charcoal"
                      : "border-black/30 group-hover:border-charcoal"
                  }`}
                >
                  {selectedGoals.includes(opt.value) && (
                    <svg className="size-3 text-white" viewBox="0 0 12 12" fill="none">
                      <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}
                </span>
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={selectedGoals.includes(opt.value)}
                  onChange={() => toggleGoal(opt.value)}
                />
                <span className="text-[13px] text-charcoal">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        {/* Question 2 */}
        <fieldset>
          <legend className="text-[13px] font-medium text-charcoal mb-3">
            2. Jaki budżet testowy byłbyś skłonny przeznaczyć samodzielnie na pierwszy miesiąc?
          </legend>
          <div className="space-y-2">
            {BUDGET_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <span
                  className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition-colors ${
                    selectedBudget === opt.value
                      ? "border-charcoal"
                      : "border-black/30 group-hover:border-charcoal"
                  }`}
                >
                  {selectedBudget === opt.value && (
                    <span className="block h-2.5 w-2.5 rounded-full bg-charcoal" />
                  )}
                </span>
                <input
                  type="radio"
                  name="budget"
                  className="sr-only"
                  value={opt.value}
                  checked={selectedBudget === opt.value}
                  onChange={() => setSelectedBudget(opt.value)}
                />
                <span className="text-[13px] text-charcoal">{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <button
          type="submit"
          disabled={!canSubmit}
          className="btn-cta w-full disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Zapisz mnie
        </button>

        <p className="text-[11px] text-warm-gray text-center">
          Zapis na listę oczekujących nie jest zobowiązaniem ze strony FashionHero
          do uruchomienia kampanii ani przydzielenia budżetu.
        </p>
      </form>
    </div>
  );
}

export default function WaitlistPage() {
  return (
    <Suspense>
      <WaitlistForm />
    </Suspense>
  );
}

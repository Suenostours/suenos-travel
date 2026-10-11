import { PUBLIC_DESTINATIONS } from "@/lib/public-destinations";
import { QUOTE_ACTIVITIES, QUOTE_SERVICES, type QuoteAssistance } from "@/lib/quote-request";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Props = {
  locale: "en" | "fr";
  value: QuoteAssistance;
  onChange: (value: QuoteAssistance) => void;
  destinations: string[];
  contextDestination?: string;
  onDestinationsChange: (value: string[]) => void;
};

function toggle(values: string[], id: string) {
  return values.includes(id) ? values.filter((value) => value !== id) : [...values, id];
}

function ChoicePills({ title, options, selected, onChange, locked }: {
  title: string;
  options: { id: string; label: string }[];
  selected: string[];
  onChange: (value: string[]) => void;
  locked?: string;
}) {
  return (
    <fieldset className="space-y-3">
      <legend className="text-sm font-semibold text-[#1F2937]">{title}</legend>
      <div className="flex flex-wrap gap-2">
        {options.map((option) => (
          <label key={option.id} className={`flex min-h-11 cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${selected.includes(option.id) ? "border-[#A91D2D] bg-[#A91D2D]/5 text-[#8a1824]" : "border-gray-200 bg-white text-[#4B5563]"}`}>
            <input
              type="checkbox"
              checked={selected.includes(option.id)}
              disabled={option.id === locked}
              onChange={() => onChange(toggle(selected, option.id))}
              className="h-4 w-4 accent-[#A91D2D] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#A91D2D]"
            />
            {option.label}
          </label>
        ))}
      </div>
    </fieldset>
  );
}

export default function QuotePreferences({ locale, value, onChange, destinations, contextDestination, onDestinationsChange }: Props) {
  const isFr = locale === "fr";
  const selectedCount = destinations.length + value.services.length + value.activities.length;
  return (
    <div className="space-y-5">
      <fieldset>
        <legend className="mb-3 font-semibold text-[#1F2937]">{isFr ? "Comment pouvons-nous vous aider ?" : "How can we help?"}</legend>
        <div className="grid gap-3 sm:grid-cols-2">
          {([
            { id: "package", title: isFr ? "Proposez-nous un package au Maroc" : "Recommend a Morocco package", description: isFr ? "Vous n’avez pas encore de programme ? Notre équipe prépare un itinéraire et une proposition tarifaire adaptés à vos clients." : "No itinerary yet? Our team will prepare a programme and quotation tailored to your clients." },
            { id: "specific", title: isFr ? "Demandez un devis pour votre programme" : "Get a quote for your itinerary", description: isFr ? "Vous avez déjà un itinéraire ? Partagez-le avec nous pour recevoir notre devis et organiser les prestations sur place." : "Already have an itinerary? Share it with us for a quotation and local ground services." },
          ] as const).map((choice) => (
            <label key={choice.id} className={`cursor-pointer rounded-xl border p-4 ${value.requestKind === choice.id ? "border-[#A91D2D] bg-[#A91D2D]/5" : "border-gray-200"}`}>
              <span className="flex items-start gap-2">
                <input type="radio" name="request-kind" value={choice.id} checked={value.requestKind === choice.id} onChange={() => onChange({ ...value, requestKind: choice.id })} className="mt-1 h-4 w-4 shrink-0 accent-[#A91D2D]" />
                <span>
                  <span className="block text-sm font-semibold text-[#1F2937]">{choice.title}</span>
                  <span className="mt-1 block text-xs leading-relaxed text-[#6B7280]">{choice.description}</span>
                </span>
              </span>
            </label>
          ))}
        </div>
      </fieldset>

      {value.requestKind === "package" && (
        <div className="space-y-4 rounded-xl bg-[#F8F7F4] p-4">
          <p className="text-sm leading-relaxed text-[#4B5563]">
            {isFr
              ? "Pas besoin de connaître les villes, les dates ou le nombre de voyageurs. Indiquez ce que vous savez, ou laissez-nous vous conseiller. Notre équipe préparera une proposition et un devis net à valider avant votre mise en vente."
              : "No need to know the cities, dates or group size yet. Share what you know, or let us guide you. Our team will prepare a proposal and net-rate quotation to agree before you put the package on sale."}
          </p>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="source-market">{isFr ? "Votre marché (facultatif)" : "Your source market (optional)"}</Label>
              <Input id="source-market" className="mt-1 bg-white" maxLength={100} value={value.market} onChange={(e) => onChange({ ...value, market: e.target.value })} placeholder={isFr ? "Ex. France, Turquie…" : "e.g. France, Türkiye…"} />
            </div>
            <div>
              <Label htmlFor="client-profile">{isFr ? "Vos clients (facultatif)" : "Your clients (optional)"}</Label>
              <Input id="client-profile" className="mt-1 bg-white" maxLength={100} value={value.clientProfile} onChange={(e) => onChange({ ...value, clientProfile: e.target.value })} placeholder={isFr ? "Ex. familles, groupes, couples…" : "e.g. families, groups, couples…"} />
            </div>
          </div>
        </div>
      )}

      <label className="flex cursor-pointer items-start gap-3 text-sm text-[#4B5563]">
        <input type="checkbox" checked={value.helpMeChoose} onChange={(e) => onChange({ ...value, helpMeChoose: e.target.checked })} className="mt-0.5 h-4 w-4 shrink-0 accent-[#A91D2D]" />
        {value.requestKind === "package"
          ? (isFr ? "Aidez-moi à choisir le parcours et les expériences." : "Help me choose the route and experiences.")
          : (isFr ? "Vous pouvez proposer des ajustements à notre programme." : "You may suggest adjustments to our itinerary.")}
      </label>

      <details className="rounded-xl border border-gray-200">
        <summary className="cursor-pointer px-4 py-3 text-sm font-semibold text-[#1F2937]">
          {isFr ? "Villes, services et activités (facultatif)" : "Destinations, services & activities (optional)"}
          {selectedCount > 0 && <span className="ml-2 font-normal text-[#A91D2D]">({selectedCount})</span>}
        </summary>
        <div className="space-y-6 border-t border-gray-100 p-4">
          <p className="text-xs leading-relaxed text-[#6B7280]">{isFr ? "Choisissez uniquement ce qui vous intéresse. Ce sont des souhaits, pas des réservations : faisabilité et disponibilités seront confirmées dans le devis." : "Select only what interests you. These are preferences, not bookings: feasibility and availability will be confirmed in the quotation."}</p>
          <ChoicePills title={isFr ? "Villes et régions" : "Cities & regions"} options={PUBLIC_DESTINATIONS.map((d) => ({ id: d.slug, label: isFr ? d.nameFr : d.name }))} selected={destinations} onChange={onDestinationsChange} locked={contextDestination} />
          {contextDestination && <p className="text-xs text-[#6B7280]">{isFr ? "La destination de la page d’origine est déjà jointe à votre demande." : "The destination from your starting page is already included in your request."}</p>}
          <ChoicePills title={isFr ? "Services souhaités" : "Services needed"} options={QUOTE_SERVICES.map((s) => ({ id: s.id, label: s[locale] }))} selected={value.services} onChange={(services) => onChange({ ...value, services })} />
          <ChoicePills title={isFr ? "Activités qui vous intéressent" : "Experiences of interest"} options={QUOTE_ACTIVITIES.map((a) => ({ id: a.id, label: a[locale] }))} selected={value.activities} onChange={(activities) => onChange({ ...value, activities })} />
        </div>
      </details>
    </div>
  );
}

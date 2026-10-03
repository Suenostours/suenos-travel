type QuoteFormValues = {
  agencyName: string;
  contactPerson: string;
  email: string;
  whatsapp: string;
  dates: string;
  numberOfPax?: number;
  specialRequests: string;
};

type QuoteContexts = {
  preferredCircuit?: string;
  preferredDestinations?: string;
};

export function buildQuoteRequestInput(values: QuoteFormValues, contexts: QuoteContexts) {
  return {
    ...values,
    preferredDestinations: contexts.preferredDestinations,
    preferredCircuit: contexts.preferredCircuit,
  };
}

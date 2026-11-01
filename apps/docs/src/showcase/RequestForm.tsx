import { Send } from 'lucide-react';
import { useEffect, useState, type FormEvent } from 'react';
import {
  Alert,
  Breadcrumb,
  BreadcrumbItem,
  Button,
  Card,
  CardBody,
  Checkbox,
  CheckboxGroup,
  DatePicker,
  DescriptionList,
  Fieldset,
  FileUpload,
  Form,
  Grid,
  Heading,
  Inline,
  List,
  ListBoxItem,
  ListItem,
  NumberInput,
  Radio,
  RadioGroup,
  Select,
  Stack,
  Text,
  TextField,
  Textarea,
  getLocalTimeZone,
  isWeekend,
  today,
  useToast,
  type CalendarDate,
  type DateValue,
  type FileUploadItem,
  type Key,
} from '@devcommunityit/ui';
import { simulateLatency } from './data';

const categories = [
  { id: 'hardware', label: 'Hardware e dispositivi' },
  { id: 'software', label: 'Licenze software' },
  { id: 'servizi', label: 'Servizi professionali' },
  { id: 'arredi', label: 'Arredi per ufficio' },
] as const;
type Category = (typeof categories)[number]['id'];

const serviceOptions = [
  { id: 'installazione', label: 'Installazione in sede' },
  { id: 'formazione', label: 'Formazione del personale' },
  { id: 'assistenza', label: 'Assistenza estesa 36 mesi' },
] as const;

interface Values {
  company: string;
  vat: string;
  email: string;
  contact: string;
  phone: string;
  category: Category | null;
  quantity: number;
  delivery: CalendarDate | null;
  priority: string;
  services: string[];
  files: FileUploadItem[];
  notes: string;
  consent: boolean;
}

const empty: Values = {
  company: '',
  vat: '',
  email: '',
  contact: '',
  phone: '',
  category: null,
  quantity: 1,
  delivery: null,
  priority: 'normale',
  services: [],
  files: [],
  notes: '',
  consent: false,
};

type Errors = Partial<Record<keyof Values, string>>;

const labels: Record<keyof Values, string> = {
  company: 'Ragione sociale',
  vat: 'Partita IVA',
  email: 'Email aziendale',
  contact: 'Referente',
  phone: 'Telefono',
  category: 'Categoria',
  quantity: 'Quantità',
  delivery: 'Consegna richiesta',
  priority: 'Priorità',
  services: 'Servizi aggiuntivi',
  files: 'Allegati',
  notes: 'Note',
  consent: 'Consenso',
};

/** Client-side checks only improve the experience: the server must validate again. */
function validate(v: Values, minDelivery: CalendarDate): Errors {
  const e: Errors = {};
  if (!v.company.trim()) e.company = 'Inserisci la ragione sociale.';
  if (!/^\d{11}$/.test(v.vat.trim())) e.vat = 'La partita IVA deve contenere 11 cifre.';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.email.trim())) e.email = 'Inserisci un indirizzo email valido, ad esempio nome@azienda.it.';
  if (!v.contact.trim()) e.contact = 'Indica chi seguirà la richiesta.';
  if (v.phone.trim() && !/^\+?[\d\s]{6,16}$/.test(v.phone.trim())) e.phone = 'Usa solo cifre, spazi e un eventuale prefisso +.';
  if (!v.category) e.category = 'Scegli una categoria.';
  if (!Number.isFinite(v.quantity) || v.quantity < 1 || v.quantity > 500) e.quantity = 'La quantità deve essere tra 1 e 500.';
  if (!v.delivery) e.delivery = 'Scegli una data di consegna.';
  else if (v.delivery.compare(minDelivery) < 0) e.delivery = 'Servono almeno 5 giorni di preavviso.';
  else if (isWeekend(v.delivery, 'it-IT')) e.delivery = 'Le consegne avvengono solo nei giorni feriali.';
  if (!v.consent) e.consent = 'Il consenso è necessario per inviare la richiesta.';
  return e;
}

function focusField(name: string) {
  const el = document.querySelector<HTMLElement>(
    `[data-field="${name}"] :is(input:not([type="hidden"]), textarea, button, [role="spinbutton"], [tabindex="0"])`,
  );
  el?.focus();
}

export function RequestForm() {
  const toast = useToast();
  const [values, setValues] = useState<Values>(empty);
  const [errors, setErrors] = useState<Errors>({});
  const [submitted, setSubmitted] = useState<Values | null>(null);
  const [sending, setSending] = useState(false);
  // Incremented on each failed submit: the summary is focused after it has been rendered.
  const [summaryFocusRequest, setSummaryFocusRequest] = useState(0);
  const minDelivery = today(getLocalTimeZone()).add({ days: 5 });

  useEffect(() => {
    if (summaryFocusRequest > 0) document.getElementById('form-errors')?.focus();
  }, [summaryFocusRequest]);

  const set = <K extends keyof Values>(key: K, value: Values[K]) => {
    setValues((v) => ({ ...v, [key]: value }));
    if (errors[key]) setErrors((prev) => ({ ...prev, [key]: undefined }));
  };

  const onSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const found = validate(values, minDelivery);
    setErrors(found);
    const first = Object.keys(found)[0];
    if (first) {
      setSummaryFocusRequest((n) => n + 1);
      return;
    }
    setSending(true);
    void simulateLatency(900).then(() => {
      setSending(false);
      setSubmitted(values);
      toast.show({ title: 'Richiesta registrata', description: 'Simulazione: nessun dato è stato inviato.', tone: 'success' });
    });
  };

  const errorEntries = (Object.entries(errors) as Array<[keyof Values, string | undefined]>).filter((entry): entry is [keyof Values, string] => Boolean(entry[1]));
  const serverErrors = Object.fromEntries(errorEntries);

  if (submitted) {
    const category = categories.find((c) => c.id === submitted.category)?.label;
    return (
      <Stack gap={5} className="sc-narrow">
        <Heading level={1} size="headline-md">
          Richiesta registrata
        </Heading>
        <Alert tone="success" title="Simulazione completata">
          I dati sono rimasti nel browser. In un portale reale qui avverrebbe l’invio al server, che deve ripetere tutte le validazioni.
        </Alert>
        <Card variant="outlined">
          <CardBody>
            <DescriptionList
              layout="grid"
              emptyValue="—"
              items={[
                { id: 'company', term: labels.company, description: submitted.company },
                { id: 'vat', term: labels.vat, description: submitted.vat },
                { id: 'contact', term: labels.contact, description: `${submitted.contact} · ${submitted.email}` },
                { id: 'category', term: labels.category, description: category },
                { id: 'quantity', term: labels.quantity, description: submitted.quantity },
                { id: 'delivery', term: labels.delivery, description: submitted.delivery?.toString() },
                { id: 'services', term: labels.services, description: submitted.services.length ? submitted.services.join(', ') : null },
                { id: 'files', term: labels.files, description: submitted.files.length ? submitted.files.map((f) => f.file.name).join(', ') : null },
              ]}
            />
          </CardBody>
        </Card>
        <Inline gap={2}>
          <Button
            onPress={() => {
              setValues(empty);
              setErrors({});
              setSubmitted(null);
            }}
          >
            Nuova richiesta
          </Button>
          <Button variant="outline" onPress={() => setSubmitted(null)}>
            Modifica questa richiesta
          </Button>
        </Inline>
      </Stack>
    );
  }

  return (
    <Stack gap={5} className="sc-narrow">
      <Breadcrumb>
        <BreadcrumbItem href="/showcase/dashboard">Dashboard</BreadcrumbItem>
        <BreadcrumbItem>Nuova richiesta</BreadcrumbItem>
      </Breadcrumb>
      <Stack gap={1}>
        <Heading level={1} size="headline-md">
          Nuova richiesta di fornitura
        </Heading>
        <Text tone="secondary">I campi contrassegnati come obbligatori sono necessari per l’invio.</Text>
      </Stack>

      {errorEntries.length > 0 ? (
        <Alert id="form-errors" tabIndex={-1} tone="danger" title={`Correggi ${errorEntries.length === 1 ? '1 campo' : `${errorEntries.length} campi`} prima di inviare`}>
          <List>
            {errorEntries.map(([key, message]) => (
              <ListItem key={key}>
                <button type="button" className="sc-error-link" onClick={() => focusField(key)}>
                  {labels[key]}: {message}
                </button>
              </ListItem>
            ))}
          </List>
        </Alert>
      ) : null}

      <Form onSubmit={onSubmit} validationBehavior="aria" validationErrors={serverErrors}>
        <Stack gap={6}>
          <Fieldset legend="Azienda">
            <Grid columns={{ base: 1, md: 2 }} gap={4}>
              <div data-field="company">
                <TextField name="company" label={labels.company} isRequired value={values.company} onChange={(v) => set('company', v)} autoComplete="organization" />
              </div>
              <div data-field="vat">
                <TextField name="vat" label={labels.vat} description="11 cifre, senza prefisso IT" isRequired value={values.vat} onChange={(v) => set('vat', v)} inputMode="numeric" />
              </div>
            </Grid>
          </Fieldset>

          <Fieldset legend="Referente">
            <Grid columns={{ base: 1, md: 2 }} gap={4}>
              <div data-field="contact">
                <TextField name="contact" label={labels.contact} isRequired value={values.contact} onChange={(v) => set('contact', v)} autoComplete="name" />
              </div>
              <div data-field="email">
                <TextField name="email" type="email" label={labels.email} isRequired value={values.email} onChange={(v) => set('email', v)} autoComplete="email" />
              </div>
              <div data-field="phone">
                <TextField name="phone" type="tel" label={labels.phone} description="Facoltativo" value={values.phone} onChange={(v) => set('phone', v)} autoComplete="tel" />
              </div>
            </Grid>
          </Fieldset>

          <Fieldset legend="Fornitura">
            <Grid columns={{ base: 1, md: 2 }} gap={4}>
              <div data-field="category">
                <Select
                  name="category"
                  label={labels.category}
                  isRequired
                  placeholder="Scegli…"
                  selectedKey={values.category}
                  onSelectionChange={(key: Key | null) => set('category', categories.find((c) => c.id === key)?.id ?? null)}
                >
                  {categories.map((c) => (
                    <ListBoxItem key={c.id} id={c.id}>
                      {c.label}
                    </ListBoxItem>
                  ))}
                </Select>
              </div>
              <div data-field="quantity">
                <NumberInput name="quantity" label={labels.quantity} isRequired minValue={1} maxValue={500} value={values.quantity} onChange={(v) => set('quantity', v)} />
              </div>
              <div data-field="delivery">
                <DatePicker
                  name="delivery"
                  label={labels.delivery}
                  description="Giorni feriali, almeno 5 giorni da oggi"
                  isRequired
                  minValue={minDelivery}
                  isDateUnavailable={(d: DateValue) => isWeekend(d, 'it-IT')}
                  value={values.delivery}
                  onChange={(d) => set('delivery', d)}
                />
              </div>
              <div data-field="priority">
                <RadioGroup name="priority" label={labels.priority} value={values.priority} onChange={(v) => set('priority', v)} orientation="horizontal">
                  <Radio value="bassa">Bassa</Radio>
                  <Radio value="normale">Normale</Radio>
                  <Radio value="urgente">Urgente</Radio>
                </RadioGroup>
              </div>
            </Grid>
            <CheckboxGroup name="services" label={labels.services} value={values.services} onChange={(v) => set('services', v)}>
              {serviceOptions.map((s) => (
                <Checkbox key={s.id} value={s.label}>
                  {s.label}
                </Checkbox>
              ))}
            </CheckboxGroup>
          </Fieldset>

          <Fieldset legend="Dettagli">
            <Stack gap={4}>
              <FileUpload
                label={labels.files}
                description="PDF o immagini, massimo 3 file da 5 MB. I file restano nel browser."
                accept={['application/pdf', 'image/png', 'image/jpeg']}
                maxSize={5 * 1024 * 1024}
                maxFiles={3}
                allowsMultiple
                value={values.files}
                onChange={(files) => set('files', files)}
              />
              <Textarea name="notes" label={labels.notes} rows={4} showCount maxLength={500} value={values.notes} onChange={(v) => set('notes', v)} />
              <div data-field="consent">
                <Checkbox name="consent" isSelected={values.consent} onChange={(v) => set('consent', v)} isRequired>
                  Confermo che i dati inseriti sono corretti e acconsento al loro trattamento per gestire la richiesta.
                </Checkbox>
              </div>
            </Stack>
          </Fieldset>

          <Inline gap={2} justify="end">
            <Button
              variant="ghost"
              onPress={() => {
                setValues(empty);
                setErrors({});
              }}
            >
              Svuota il modulo
            </Button>
            <Button type="submit" startIcon={<Send />} isPending={sending}>
              Invia richiesta
            </Button>
          </Inline>
        </Stack>
      </Form>
    </Stack>
  );
}

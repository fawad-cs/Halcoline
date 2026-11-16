import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { Check } from 'lucide-react';
import PageShell from '../../components/layout/PageShell';
import Footer from '../../components/layout/Footer';
import LineReveal from '../../components/animations/LineReveal';
import Button from '../../components/ui/Button';
import { CONTACT_TOPICS, CONTACT_DETAILS } from '../../data/contact';
import { SOCIALS } from '../../data/socials';
import { validateField, validateContact, MESSAGE_MAX } from '../../utils/validation';
import submitContact from '../../utils/submitContact';
import { EASE_OUT } from '../../utils/easing';
import styles from './Contact.module.css';

const EMPTY = { name: '', email: '', topic: '', message: '', company: '' };
const FIELDS = ['name', 'email', 'topic', 'message'];

function Field({ id, label, error, children }) {
  return (
    <div className={`${styles.field} ${error ? styles.invalid : ''}`}>
      <label htmlFor={id} className="mono mono--xs">
        {label}
      </label>
      {children}
      <span className={styles.line} aria-hidden="true" />
      <AnimatePresence>
        {error && (
          <motion.p
            id={`${id}-error`}
            role="alert"
            className={styles.error}
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0, transition: { duration: 0.35, ease: EASE_OUT } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function Contact() {
  const [values, setValues] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [status, setStatus] = useState('idle'); // idle | sending | success | error
  const [simulated, setSimulated] = useState(false);

  const setError = (name, message) =>
    setErrors((prev) => {
      const next = { ...prev };
      if (message) next[name] = message;
      else delete next[name];
      return next;
    });

  const onChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    if (touched[name]) setError(name, validateField(name, value));
  };

  const onBlur = (e) => {
    const { name, value } = e.target;
    if (!FIELDS.includes(name)) return;
    setTouched((prev) => ({ ...prev, [name]: true }));
    setError(name, validateField(name, value));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    if (status === 'sending') return;

    const { errors: found, isValid } = validateContact(values);
    setErrors(found);
    setTouched({ name: true, email: true, topic: true, message: true });

    if (!isValid) {
      const first = FIELDS.find((f) => found[f]);
      document.getElementById(`contact-${first}`)?.focus();
      return;
    }

    // Honeypot: real people never fill this hidden field.
    if (values.company) {
      setStatus('success');
      return;
    }

    setStatus('sending');
    try {
      const result = await submitContact({
        name: values.name.trim(),
        email: values.email.trim(),
        topic: values.topic,
        message: values.message.trim(),
      });
      setSimulated(Boolean(result.simulated));
      setStatus('success');
    } catch {
      setStatus('error');
    }
  };

  const reset = () => {
    setValues(EMPTY);
    setErrors({});
    setTouched({});
    setStatus('idle');
  };

  const sending = status === 'sending';

  return (
    <PageShell title="Contact">
      <header className={styles.intro}>
        <p className="eyebrow">Contact</p>
        <LineReveal as="h1" className="display" text="Send a *signal.*" delay={0.6} />
      </header>

      <div className={styles.layout}>
        <aside className={styles.details}>
          <div>
            <p className="mono mono--xs">Email</p>
            <a className={styles.big} href={`mailto:${CONTACT_DETAILS.email}`}>
              {CONTACT_DETAILS.email}
            </a>
          </div>
          <div>
            <p className="mono mono--xs">Press</p>
            <a className={styles.link} href={`mailto:${CONTACT_DETAILS.press}`}>
              {CONTACT_DETAILS.press}
            </a>
          </div>
          <div>
            <p className="mono mono--xs">Base</p>
            <p className={styles.plain}>{CONTACT_DETAILS.base}</p>
          </div>
          <div>
            <p className="mono mono--xs">Response</p>
            <p className={styles.plain}>{CONTACT_DETAILS.response}</p>
          </div>
          <ul className={styles.socials}>
            {SOCIALS.map((s) => (
              <li key={s.label}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className={styles.link}>
                  {s.label}
                </a>
              </li>
            ))}
          </ul>
        </aside>

        <div className={styles.formWrap}>
          <AnimatePresence mode="wait">
            {status === 'success' ? (
              <motion.div
                key="done"
                className={styles.done}
                role="status"
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } }}
                exit={{ opacity: 0 }}
              >
                <span className={styles.tick} aria-hidden="true">
                  <Check size={28} strokeWidth={1.5} />
                </span>
                <h2 className="h2">
                  Signal <em>received.</em>
                </h2>
                <p className="body">
                  Thank you. We will reply within three working days.
                </p>
                {simulated && (
                  <p className={`${styles.demo} mono mono--xs`}>
                    Demo mode: this message was not actually sent. Add an endpoint in
                    utils/submitContact.js.
                  </p>
                )}
                <Button variant="ghost" onClick={reset} arrow={false}>
                  Send another
                </Button>
              </motion.div>
            ) : (
              <motion.form
                key="form"
                className={styles.form}
                onSubmit={onSubmit}
                noValidate
                initial={{ opacity: 0 }}
                animate={{ opacity: 1, transition: { duration: 0.5 } }}
                exit={{ opacity: 0, transition: { duration: 0.2 } }}
              >
                {/* Honeypot */}
                <div className={styles.trap} aria-hidden="true">
                  <label htmlFor="contact-company">Company</label>
                  <input
                    id="contact-company"
                    name="company"
                    tabIndex={-1}
                    autoComplete="off"
                    value={values.company}
                    onChange={onChange}
                  />
                </div>

                <Field id="contact-name" label="Your name" error={errors.name}>
                  <input
                    id="contact-name"
                    name="name"
                    type="text"
                    autoComplete="name"
                    className={styles.control}
                    value={values.name}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={Boolean(errors.name)}
                    aria-describedby={errors.name ? 'contact-name-error' : undefined}
                  />
                </Field>

                <Field id="contact-email" label="Email" error={errors.email}>
                  <input
                    id="contact-email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    className={styles.control}
                    value={values.email}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={Boolean(errors.email)}
                    aria-describedby={errors.email ? 'contact-email-error' : undefined}
                  />
                </Field>

                <Field id="contact-topic" label="Topic" error={errors.topic}>
                  <select
                    id="contact-topic"
                    name="topic"
                    className={styles.control}
                    value={values.topic}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={Boolean(errors.topic)}
                    aria-describedby={errors.topic ? 'contact-topic-error' : undefined}
                  >
                    <option value="">Choose a topic</option>
                    {CONTACT_TOPICS.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="contact-message" label="Message" error={errors.message}>
                  <textarea
                    id="contact-message"
                    name="message"
                    rows={5}
                    className={`${styles.control} ${styles.area}`}
                    value={values.message}
                    onChange={onChange}
                    onBlur={onBlur}
                    aria-invalid={Boolean(errors.message)}
                    aria-describedby={errors.message ? 'contact-message-error' : undefined}
                  />
                  <span className={`${styles.count} mono mono--xs tnum`} aria-hidden="true">
                    {values.message.length}/{MESSAGE_MAX}
                  </span>
                </Field>

                {status === 'error' && (
                  <p role="alert" className={styles.banner}>
                    Something went wrong and your message was not sent. Please try again.
                  </p>
                )}

                <div className={styles.submit}>
                  <Button type="submit" disabled={sending} magnetic={!sending}>
                    {sending ? 'Sending…' : 'Send signal'}
                  </Button>
                </div>
              </motion.form>
            )}
          </AnimatePresence>
        </div>
      </div>
      <Footer />
    </PageShell>
  );
}
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import Magnetic from './Magnetic';
import styles from './Button.module.css';

// One button for everything:
//   <Button to="/contact">      -> internal route (Link)
//   <Button href="https://..."> -> external link (new tab)
//   <Button onClick={fn}>       -> real <button>
// variant: 'solid' | 'ghost'
export default function Button({
  to,
  href,
  onClick,
  type = 'button',
  variant = 'solid',
  magnetic = true,
  arrow = true,
  disabled = false,
  className = '',
  children,
  ...rest
}) {
  const cls = `${styles.button} ${styles[variant]} ${className}`;

  const content = (
    <>
      <span className={styles.label}>{children}</span>
      {arrow && (
        <ArrowUpRight className={styles.arrow} size={16} strokeWidth={1.5} aria-hidden="true" />
      )}
    </>
  );

  let element;
  if (to) {
    element = (
      <Link to={to} className={cls} onClick={onClick} {...rest}>
        {content}
      </Link>
    );
  } else if (href) {
    const external = /^https?:/.test(href);
    element = (
      <a
        href={href}
        className={cls}
        onClick={onClick}
        {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
        {...rest}
      >
        {content}
      </a>
    );
  } else {
    element = (
      <button type={type} className={cls} onClick={onClick} disabled={disabled} {...rest}>
        {content}
      </button>
    );
  }

  return magnetic && !disabled ? <Magnetic>{element}</Magnetic> : element;
}
'use client';

import { useState } from 'react';
import { useAuth } from '../../hooks/useAuth';
import styles from './home.module.css';

type Props = {
  onClose: () => void;
};

export function AuthDialog({ onClose }: Props) {
  const { login, signup } = useAuth();
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (mode === 'signup') {
        await signup({ name, email, password });
      } else {
        await login({ email, password });
      }

      onClose();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : 'Unable to continue.');
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.modalBackdrop} onClick={onClose}>
      <div className={styles.modalCard} onClick={(event) => event.stopPropagation()}>
        <div className={styles.modalHeader}>
          <div>
            <p className={styles.sectionEyebrow}>Account</p>
            <h3>{mode === 'login' ? 'Login to your account' : 'Create your room finder account'}</h3>
          </div>
          <button type="button" className={styles.textAction} onClick={onClose}>
            Close
          </button>
        </div>

        <div className={styles.authTabs}>
          <button
            type="button"
            className={mode === 'login' ? styles.authTabActive : styles.authTab}
            onClick={() => setMode('login')}
          >
            Login
          </button>
          <button
            type="button"
            className={mode === 'signup' ? styles.authTabActive : styles.authTab}
            onClick={() => setMode('signup')}
          >
            Signup
          </button>
        </div>

        <form className={styles.authForm} onSubmit={handleSubmit}>
          {mode === 'signup' ? (
            <label>
              <span>Name</span>
              <input value={name} onChange={(event) => setName(event.target.value)} />
            </label>
          ) : null}
          <label>
            <span>Email</span>
            <input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </label>
          <label>
            <span>Password</span>
            <input
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </label>
          {error ? <p className={styles.bannerError}>{error}</p> : null}
          <button className={styles.primaryAction} type="submit" disabled={saving}>
            {saving ? 'Please wait...' : mode === 'login' ? 'Login' : 'Create account'}
          </button>
        </form>
      </div>
    </div>
  );
}

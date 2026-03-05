import { useState } from 'react';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '../firebase';

const styles = `
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    body {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
        background: #f2f2f7;
        -webkit-font-smoothing: antialiased;
    }

    @keyframes spin {
        to { transform: rotate(360deg); }
    }
    .spinner { animation: spin 0.75s linear infinite; }

    .google-btn {
        transition: background 0.15s ease, box-shadow 0.15s ease, transform 0.1s ease;
    }
    .google-btn:hover:not(:disabled) {
        background: #ececec !important;
        box-shadow: 0 2px 6px rgba(0,0,0,0.1);
    }
    .google-btn:active:not(:disabled) {
        transform: scale(0.985);
        background: #e4e4e4 !important;
    }
    .signout-btn {
        transition: background 0.15s ease;
    }
    .signout-btn:hover {
        background: #f5f5f5 !important;
    }
    .link { transition: color 0.15s ease; }
    .link:hover { color: #111 !important; text-decoration: underline; }
`;

export default function LoginPage() {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');
    const [user, setUser] = useState(null);

    const handleGoogleSignIn = async () => {
        setIsLoading(true);
        setError('');
        try {
            const result = await signInWithPopup(auth, googleProvider);
            setUser(result.user);
        } catch (err) {
            if (err.code === 'auth/popup-closed-by-user') {
                setError('Sign-in was cancelled. Please try again.');
            } else if (err.code === 'auth/network-request-failed') {
                setError('Network error. Please check your connection.');
            } else {
                setError('Something went wrong. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    const handleSignOut = async () => {
        await auth.signOut();
        setUser(null);
    };

    /* ── Shared page wrapper ── */
    const PageWrap = ({ children }) => (
        <>
            <style>{styles}</style>
            <div style={{
                minHeight: '100vh',
                background: '#f2f2f7',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '32px 20px',
            }}>
                <div style={{ width: '100%', maxWidth: '400px' }}>
                    {children}
                </div>
            </div>
        </>
    );

    /* ── Signed-in view ── */
    if (user) {
        return (
            <PageWrap>
                {/* Brand header */}
                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <LogoMark />
                    <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#111', letterSpacing: '-0.2px', marginTop: '14px' }}>
                        You&apos;re signed in
                    </h1>
                </div>

                {/* Profile card */}
                <div style={{
                    background: '#fff',
                    borderRadius: '16px',
                    border: '1px solid #e4e4e4',
                    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                    overflow: 'hidden',
                }}>
                    {/* Avatar + info */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '32px 28px 24px',
                        borderBottom: '1px solid #f0f0f0',
                    }}>
                        <img
                            src={user.photoURL}
                            alt={user.displayName}
                            style={{
                                width: '72px', height: '72px',
                                borderRadius: '50%',
                                border: '2px solid #e4e4e4',
                                marginBottom: '14px',
                            }}
                        />
                        <p style={{ fontSize: '16px', fontWeight: '600', color: '#111', marginBottom: '4px', textAlign: 'center' }}>
                            {user.displayName}
                        </p>
                        <p style={{ fontSize: '13px', color: '#888', marginBottom: '16px', textAlign: 'center' }}>
                            {user.email}
                        </p>
                        {/* Auth badge */}
                        <div style={{
                            display: 'inline-flex',
                            alignItems: 'center',
                            gap: '6px',
                            background: '#f0fdf4',
                            border: '1px solid #bbf7d0',
                            borderRadius: '20px',
                            padding: '5px 12px',
                        }}>
                            <svg width="12" height="12" fill="none" stroke="#16a34a" strokeWidth="2.5" viewBox="0 0 24 24">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                            <span style={{ fontSize: '12px', color: '#16a34a', fontWeight: '500' }}>
                                Authenticated with Google
                            </span>
                        </div>
                    </div>

                    {/* Sign out */}
                    <div style={{ padding: '16px 28px' }}>
                        <button
                            className="signout-btn"
                            onClick={handleSignOut}
                            style={{
                                width: '100%',
                                padding: '11px',
                                background: '#fff',
                                border: '1px solid #e4e4e4',
                                borderRadius: '10px',
                                fontSize: '14px',
                                fontWeight: '500',
                                color: '#444',
                                cursor: 'pointer',
                                fontFamily: 'inherit',
                                letterSpacing: '0.1px',
                            }}
                        >
                            Sign out
                        </button>
                    </div>
                </div>
            </PageWrap>
        );
    }

    /* ── Sign-in view ── */
    return (
        <PageWrap>
            {/* Brand header */}
            <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                <LogoMark />
                <h1 style={{
                    fontSize: '22px',
                    fontWeight: '600',
                    color: '#111',
                    letterSpacing: '-0.3px',
                    marginTop: '14px',
                    marginBottom: '6px',
                }}>
                    Sign in to App
                </h1>
                <p style={{ fontSize: '14px', color: '#6e6e73', lineHeight: '1.5' }}>
                    Use your Google account to continue
                </p>
            </div>

            {/* Card */}
            <div style={{
                background: '#fff',
                borderRadius: '16px',
                border: '1px solid #e4e4e4',
                boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
                padding: '28px',
            }}>
                {/* Error */}
                {error && (
                    <div style={{
                        display: 'flex',
                        alignItems: 'flex-start',
                        gap: '9px',
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        borderRadius: '10px',
                        padding: '11px 13px',
                        marginBottom: '18px',
                    }}>
                        <svg width="15" height="15" fill="none" stroke="#ef4444" strokeWidth="2" viewBox="0 0 24 24" style={{ marginTop: '1px', flexShrink: 0 }}>
                            <circle cx="12" cy="12" r="10" />
                            <line x1="12" y1="8" x2="12" y2="12" />
                            <line x1="12" y1="16" x2="12.01" y2="16" />
                        </svg>
                        <span style={{ fontSize: '13px', color: '#dc2626', lineHeight: '1.5' }}>{error}</span>
                    </div>
                )}

                {/* Google button */}
                <button
                    id="google-signin-btn"
                    className="google-btn"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading}
                    style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        padding: '12px 20px',
                        background: '#f7f7f7',
                        border: '1px solid #ddd',
                        borderRadius: '10px',
                        color: '#111',
                        fontSize: '14px',
                        fontWeight: '500',
                        cursor: isLoading ? 'not-allowed' : 'pointer',
                        opacity: isLoading ? 0.6 : 1,
                        fontFamily: 'inherit',
                        letterSpacing: '0.1px',
                    }}
                >
                    {isLoading ? (
                        <>
                            <svg className="spinner" width="18" height="18" viewBox="0 0 24 24" fill="none">
                                <circle cx="12" cy="12" r="10" stroke="#ddd" strokeWidth="3" />
                                <path d="M12 2a10 10 0 0110 10" stroke="#666" strokeWidth="3" strokeLinecap="round" />
                            </svg>
                            <span style={{ color: '#666' }}>Signing in…</span>
                        </>
                    ) : (
                        <>
                            <GoogleLogo />
                            <span>Continue with Google</span>
                        </>
                    )}
                </button>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '22px 0' }}>
                    <div style={{ flex: 1, height: '1px', background: '#efefef' }} />
                    <span style={{ fontSize: '11px', color: '#c0c0c0', letterSpacing: '0.3px', userSelect: 'none', whiteSpace: 'nowrap' }}>
                        SECURED BY GOOGLE
                    </span>
                    <div style={{ flex: 1, height: '1px', background: '#efefef' }} />
                </div>

                {/* Trust items */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {[
                        { Icon: LockIcon, label: 'Encrypted & secure login' },
                        { Icon: ShieldIcon, label: 'No passwords stored' },
                        { Icon: CheckIcon, label: 'One-click access' },
                    ].map(({ Icon, label }, i) => (
                        <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{
                                width: '30px', height: '30px',
                                flexShrink: 0,
                                borderRadius: '8px',
                                background: '#f7f7f7',
                                border: '1px solid #ebebeb',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                            }}>
                                <Icon />
                            </div>
                            <span style={{ fontSize: '13px', color: '#555', lineHeight: '1.4' }}>{label}</span>
                        </div>
                    ))}
                </div>
            </div>

            {/* Footer */}
            <p style={{
                textAlign: 'center',
                fontSize: '12px',
                color: '#b0b0b0',
                marginTop: '20px',
                lineHeight: '1.7',
            }}>
                By continuing, you agree to our{' '}
                <a href="#" className="link" style={{ color: '#666', textDecoration: 'none', fontWeight: '500' }}>Terms</a>
                {' '}and{' '}
                <a href="#" className="link" style={{ color: '#666', textDecoration: 'none', fontWeight: '500' }}>Privacy Policy</a>
            </p>
        </PageWrap>
    );
}

/* ─── Shared sub-components ─── */

function LogoMark() {
    return (
        <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '48px',
            height: '48px',
            background: '#111',
            borderRadius: '12px',
        }}>
            <svg width="22" height="22" fill="none" stroke="white" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
        </div>
    );
}

function GoogleLogo() {
    return (
        <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden="true">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

function LockIcon() {
    return (
        <svg width="13" height="13" fill="none" stroke="#999" strokeWidth="1.8" viewBox="0 0 24 24">
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0110 0v4" />
        </svg>
    );
}
function ShieldIcon() {
    return (
        <svg width="13" height="13" fill="none" stroke="#999" strokeWidth="1.8" viewBox="0 0 24 24">
            <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        </svg>
    );
}
function CheckIcon() {
    return (
        <svg width="13" height="13" fill="none" stroke="#999" strokeWidth="2.2" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12" />
        </svg>
    );
}

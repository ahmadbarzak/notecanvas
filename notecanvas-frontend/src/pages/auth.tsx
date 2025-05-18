import { useState } from 'react';
import { signUp, signIn, signOut, confirmSignUp, resendSignUpCode } from '@aws-amplify/auth';


export default function AuthPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmationCode, setConfirmationCode] = useState('');
  const [mode, setMode] = useState<'signup' | 'signin' | 'confirm'>('signup');

  const handleAuth = async () => {
    try {
      if (mode === 'signup') {
        const result = await signUp({
          username: email,
          password,
        });

        await signOut(); // ← clear session immediately

        alert('Check your email for a confirmation code.');
        console.log('Sign up result:', result);
        setMode('confirm'); // move to confirmation step
      } else if (mode === 'confirm') {
        await confirmSignUp({username: email, confirmationCode});
        alert('Account confirmed! You can now sign in.');
        setMode('signin');
      } else {
        const user = await signIn({ username: email, password });
        console.log(user.nextStep.signInStep)
        if (user.nextStep.signInStep === 'CONFIRM_SIGN_UP') {
            alert('Please confirm your account before signing in.');
            setMode('confirm');
            return;
        }
        alert('Signed in!');
        console.log('Sign in user:', user);
      }
    } catch (err: unknown) {
      if (err instanceof Error) {
        alert(err.message);
      } else {
        alert('An unexpected error occurred.');
      }
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>
        {mode === 'signup'
          ? 'Sign Up'
          : mode === 'signin'
          ? 'Sign In'
          : 'Confirm Account'}
      </h2>

      {(mode === 'signup' || mode === 'signin') && (
        <>
            <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
            />
            <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
            />
        </>
      )}

      {mode === 'confirm' && (
        <>
        <input
          type="text"
          placeholder="Confirmation Code"
          value={confirmationCode}
          onChange={(e) => setConfirmationCode(e.target.value)}
        />
        <button onClick={async () => {await resendSignUpCode({ username: email });}}>Reset Code</button>
        </>

      )}
      <br />
      <button onClick={handleAuth}>
        {mode === 'signup'
          ? 'Create Account'
          : mode === 'confirm'
          ? 'Confirm Account'
          : 'Log In'}
      </button>
      {mode !== 'confirm' && (
        <p onClick={() => setMode(mode === 'signup' ? 'signin' : 'signup')}>
          Switch to {mode === 'signup' ? 'Sign In' : 'Sign Up'}
        </p>
      )}
      <button onClick={() => {console.log("done"); signOut()}}>Log Out</button>
    </div>
  );
}

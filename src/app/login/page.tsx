import { loginAction } from '@/actions';

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form action={loginAction} className="card w-full max-w-md space-y-3">
        <h1 className="text-2xl font-semibold">Welcome to ClearPane</h1>
        <p className="text-sm text-slate-500">Sign in with owner@clearpane.app / password123</p>
        <input className="input" name="email" placeholder="Email" required />
        <input className="input" name="password" placeholder="Password" type="password" required />
        <button className="btn w-full">Sign in</button>
      </form>
    </div>
  );
}

// app/sign-in/page.js

import { SignIn } from '@clerk/nextjs';

export default function SignInPage() {
  return (
    <div>
      <h2>Sign In</h2>
      <p>Only specific email addresses are allowed to sign in.</p>
      <SignIn path="/sign-in" routing="path" />
    </div>
  );
}

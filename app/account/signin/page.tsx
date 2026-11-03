import { Suspense } from "react";
import AccountForm from "@/components/account-form";

export default function SignInPage() {
  return (
    <Suspense>
      <AccountForm mode="signin" />
    </Suspense>
  );
}

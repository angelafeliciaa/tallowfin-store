import { Suspense } from "react";
import AccountForm from "@/components/account-form";

export default function CreateAccountPage() {
  return (
    <Suspense>
      <AccountForm mode="signup" />
    </Suspense>
  );
}

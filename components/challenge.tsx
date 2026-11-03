"use client";

const VERIFIED_COOKIE = "tf_verified";

export default function Challenge() {
  const verify = () => {
    document.cookie = `${VERIFIED_COOKIE}=1; path=/; max-age=86400; SameSite=Lax`;
    window.location.reload();
  };

  return (
    <div className="gate">
      <h1>Checking your browser</h1>
      <p className="muted">Confirm you are a person to continue to Tallowfin.</p>
      <button type="button" className="btn" onClick={verify}>
        I&apos;m not a robot
      </button>
    </div>
  );
}

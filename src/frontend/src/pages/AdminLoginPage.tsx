import { Show, createSignal } from "solid-js";
import PageFrame from "../components/PageFrame";
import { ADMIN_LOGIN_URL } from "./PortfolioShared";

type AdminLoginResponse = {
  token?: string;
  message?: string;
  redirectUrl?: string;
};

export default function AdminLoginPage() {
  const [email, setEmail] = createSignal("");
  const [password, setPassword] = createSignal("");
  const [submitting, setSubmitting] = createSignal(false);
  const [errorMessage, setErrorMessage] = createSignal("");
  const [successMessage, setSuccessMessage] = createSignal("");

  const handleSubmit = async (event: SubmitEvent) => {
    event.preventDefault();

    if (!email().trim() || !password()) {
      setErrorMessage("Email and password are required.");
      return;
    }

    setSubmitting(true);
    setErrorMessage("");
    setSuccessMessage("");

    try {
      const res = await fetch(ADMIN_LOGIN_URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email().trim(),
          password: password(),
        }),
      });

      const data = (await res.json().catch(() => ({}))) as AdminLoginResponse;

      if (!res.ok) {
        setErrorMessage(data.message ?? "Login failed. Please check your credentials.");
        return;
      }

      if (data.token) {
        localStorage.setItem("adminAccessToken", data.token);
      }

      const redirectUrl = data.redirectUrl ?? "/gallery";
      setSuccessMessage("Login successful. Redirecting to management area...");
      window.setTimeout(() => {
        window.location.href = redirectUrl;
      }, 700);
    } catch (error) {
      console.error("Admin login failed:", error);
      setErrorMessage("Unable to reach backend login service.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <PageFrame
      title="Administrator"
      subtitle="Secure access for photo management and publishing controls."
    >
      <section class="admin-login-shell" aria-label="Administrator login">
        <article class="admin-login-card">
          <p class="admin-login-kicker">Backend Access</p>
          <h2>Admin Sign In</h2>
          <p class="admin-login-summary">
            Authenticate to manage portfolio photos, sequencing, and archive updates.
          </p>

          <form class="admin-login-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                value={email()}
                onInput={(event) => setEmail(event.currentTarget.value)}
                autocomplete="username"
                required
              />
            </label>

            <label>
              Password
              <input
                type="password"
                value={password()}
                onInput={(event) => setPassword(event.currentTarget.value)}
                autocomplete="current-password"
                required
              />
            </label>

            <button type="submit" disabled={submitting()}>
              {submitting() ? "Signing in..." : "Sign In"}
            </button>
          </form>

          <Show when={errorMessage()}>
            <p class="admin-login-feedback error" role="alert">
              {errorMessage()}
            </p>
          </Show>
          <Show when={successMessage()}>
            <p class="admin-login-feedback success">{successMessage()}</p>
          </Show>
        </article>
      </section>
    </PageFrame>
  );
}
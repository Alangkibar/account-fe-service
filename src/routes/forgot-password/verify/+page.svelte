<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { getOriginConfig } from "$lib/config/origins";
  import { theme } from "$lib/stores/theme";
  import { language, getTranslations } from "$lib/stores/language";
  import LanguageSelector from "$lib/components/LanguageSelector.svelte";
  import { enhance } from "$app/forms";
  import logo from "$lib/assets/logo.png";
  import { goto } from "$app/navigation";
  import Icon from "@iconify/svelte";
  import { getErrorMessages } from "$lib/utils/errorTranslation";
  import { createAuthSchemas } from "$lib/schemas/auth";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const config = getOriginConfig(data.origin as any);
  let t = $derived(getTranslations($language));
  let isSubmitting = $state(false);
  let showPassword = $state(false);
  let showConfirmPassword = $state(false);
  let timeRemaining = $state<string>("");
  let isExpired = $state(false);

  // Client-side validation errors
  let fieldErrors = $state<Record<string, string[]>>({});

  // Create reactive schemas based on current language
  let schemas = $derived(createAuthSchemas(t));

  // Clear error when user types
  function clearFieldError(field: string) {
    if (fieldErrors[field]) {
      fieldErrors = { ...fieldErrors, [field]: [] };
    }
  }

  // Scroll to first error field
  function scrollToError() {
    const errorField = document.querySelector('[data-error="true"]');
    if (errorField) {
      errorField.scrollIntoView({ behavior: "smooth", block: "center" });
      (errorField as HTMLElement).focus();
    }
  }

  // Watch for server-side errors
  $effect(() => {
    if (form?.fieldErrors) {
      fieldErrors = form.fieldErrors;
      setTimeout(scrollToError, 100);
    }
  });

  // Calculate time remaining until token expires
  $effect(() => {
    if (!data.expired_at) return;

    const updateTimeRemaining = () => {
      const expiryDate = new Date(data.expired_at);
      const now = new Date();
      const diff = expiryDate.getTime() - now.getTime();

      if (diff <= 0) {
        isExpired = true;
        timeRemaining = "";
        return;
      }

      const minutes = Math.floor(diff / 60000);
      const seconds = Math.floor((diff % 60000) / 1000);

      if (minutes > 0) {
        timeRemaining = `${minutes}m ${seconds}s`;
      } else {
        timeRemaining = `${seconds}s`;
      }
    };

    updateTimeRemaining();
    const interval = setInterval(updateTimeRemaining, 1000);

    return () => clearInterval(interval);
  });

  // Redirect to sign in after successful password reset
  $effect(() => {
    if (form?.success) {
      setTimeout(() => {
        const origin = data.origin || "localplace";
        goto(`/sign-in?origin=${origin}`);
      }, 3000);
    }
  });
</script>

<svelte:head>
  <title>Local Place Account - Reset Password</title>
</svelte:head>

<div
  class="min-h-screen flex flex-col items-center bg-white dark:bg-[#00262a] py-8 pb-16 px-4 pb-safe transition-colors"
>
  <!-- Language Selector and Theme Toggle -->
  <div class="relative flex items-start justify-between gap-2 max-w-md w-full">
    <div class="flex-1">
      <LanguageSelector />
    </div>

    <div class="flex-1 text-right">
      <button
        onclick={() => theme.toggle()}
        class="p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-[#003a3f] hover:bg-gray-200 dark:hover:bg-[#004a50] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2"
        style="focus:ring-color: {config.color}"
        aria-label="Toggle dark mode"
      >
        {#if $theme === "dark"}
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
        {:else}
          <svg
            class="w-5 h-5 sm:w-6 sm:h-6 text-[#37cca8]"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
            />
          </svg>
        {/if}
      </button>
    </div>
  </div>

  <div class="max-w-md w-full">
    <!-- LocalPlace Logo and Branding -->
    <div class="text-center">
      <div
        class="h-14 w-14 flex items-center justify-center mx-auto mb-4 bg-[#00262a] rounded-full overflow-hidden"
      >
        <img src={logo} alt="LocalPlace" class="h-12 mx-auto" />
      </div>
      <div
        class="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-[#003a3f] rounded-full text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-6"
      >
        <svg class="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
          <path
            fill-rule="evenodd"
            d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
            clip-rule="evenodd"
          />
        </svg>
        <span
          ><span style="color: {config.color}" class="font-semibold"
            >{config.name}</span
          >
          {t.common.ecosystem}</span
        >
      </div>
    </div>

    <div class="text-center mb-8 sm:mb-10">
      {#if !data.invalidToken}
        <a
          href="/sign-in?origin={data.origin}"
          class="inline-flex items-center gap-1 px-4 py-2 mb-6 rounded-full border border-gray-300 dark:border-[#005159] text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-[#003a3f] transition-colors"
        >
          <Icon icon="solar:alt-arrow-left-linear" font-size="18px" />
          {t.resetPassword?.backToSignIn || "Back to sign in"}
        </a>
      {/if}

      <h2 class="text-lg font-bold text-gray-900 dark:text-white mb-2">
        {data.invalidToken
          ? t.resetPassword?.invalidTokenTitle || "Link Expired or Invalid"
          : t.resetPassword?.title || "Create New Password"}
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        {data.invalidToken
          ? t.resetPassword?.invalidTokenMessage ||
            "This password reset link has expired or is no longer valid."
          : t.resetPassword?.subtitle || "Enter your new password"}
      </p>
    </div>

    {#if data.invalidToken}
      <!-- Invalid Token State -->
      <div class="space-y-6">
        <div
          class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-6 text-center"
        >
          <div
            class="mx-auto w-16 h-16 mb-4 flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30"
          >
            <svg
              class="w-8 h-8 text-red-600 dark:text-red-500"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>
        </div>

        <a
          href="/forgot-password?origin={data.origin}"
          class="w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950 active:scale-[0.98] text-sm sm:text-base flex items-center justify-center gap-2"
          style="background-color: {config.color}; --hover-color: {config.accentColor}; --focus-color: {config.color}"
        >
          {t.resetPassword?.invalidTokenButton || "Request New Reset Link"}
        </a>

        <div class="text-center">
          <a
            href="/sign-in?origin={data.origin}"
            class="inline-flex items-center gap-1 text-sm font-medium transition-colors"
            style="color: {config.color}"
          >
            <Icon icon="solar:alt-arrow-left-linear" font-size="16px" />
            {t.resetPassword?.backToSignIn || "Back to sign in"}
          </a>
        </div>
      </div>
    {:else}
      <!-- Normal Password Reset Form -->
      <form
        method="POST"
        use:enhance={() => {
          // Clear previous errors
          fieldErrors = {};

          // Client-side validation
          const formData = new FormData(document.querySelector("form")!);
          const password = formData.get("password")?.toString() || "";
          const password_confirmation =
            formData.get("password_confirmation")?.toString() || "";

          const validation = schemas.resetPasswordSchema.safeParse({
            password,
            password_confirmation,
          });

          if (!validation.success) {
            const errors: Record<string, string[]> = {};
            validation.error.issues.forEach((err) => {
              const field = err.path[0] as string;
              if (!errors[field]) {
                errors[field] = [];
              }
              errors[field].push(err.message);
            });

            fieldErrors = errors;
            setTimeout(scrollToError, 100);

            // Prevent form submission by returning early
            return () => {};
          }

          isSubmitting = true;
          return async ({ update }) => {
            await update({ reset: false, invalidateAll: false });
            isSubmitting = false;
          };
        }}
        class="space-y-4 sm:space-y-5"
      >
        {#if form?.errors || form?.error || form?.errorMessage}
          <div
            class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 sm:p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400 dark:text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800 dark:text-red-200">
                  {getErrorMessages(form, t)}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if isExpired}
          <div
            class="rounded-lg bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 p-3 sm:p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-red-400 dark:text-red-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-red-800 dark:text-red-200">
                  {t.error.tokenExpired || "Reset link has expired"}
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if timeRemaining && !isExpired}
          <div
            class="rounded-lg bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 p-3 sm:p-4"
          >
            <div class="flex items-center">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-blue-400 dark:text-blue-500"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-blue-800 dark:text-blue-200">
                  {t.resetPassword?.linkExpiresIn || "Link expires in"}:
                  <span class="font-semibold">{timeRemaining}</span>
                </p>
              </div>
            </div>
          </div>
        {/if}

        {#if form?.success}
          <div
            class="rounded-lg bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 p-3 sm:p-4"
          >
            <div class="flex">
              <div class="flex-shrink-0">
                <svg
                  class="h-5 w-5 text-green-400 dark:text-green-500"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fill-rule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clip-rule="evenodd"
                  />
                </svg>
              </div>
              <div class="ml-3">
                <p class="text-sm text-green-800 dark:text-green-200">
                  {form.message}
                </p>
                <p class="text-xs text-green-700 dark:text-green-300 mt-1">
                  {t.resetPassword?.redirecting || "Redirecting to sign in..."}
                </p>
              </div>
            </div>
          </div>
        {/if}

        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t.common.password}
          </label>
          <div class="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              autocomplete="new-password"
              data-error={fieldErrors.password?.length ? "true" : "false"}
              class="block w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base pr-10 {fieldErrors
                .password?.length
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-[#005159]'}"
              style="--focus-color: {config.color}"
              placeholder={t.resetPassword?.passwordPlaceholder ||
                "Enter new password"}
              disabled={isSubmitting || form?.success || isExpired}
              oninput={() => clearFieldError("password")}
            />
            <button
              type="button"
              onclick={() => (showPassword = !showPassword)}
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabindex="-1"
            >
              {#if showPassword}
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              {:else}
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              {/if}
            </button>
          </div>
          {#if fieldErrors.password?.length}
            <p class="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
              {fieldErrors.password[0]}
            </p>
          {/if}
        </div>

        <div>
          <label
            for="password_confirmation"
            class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
          >
            {t.common.confirmPassword}
          </label>
          <div class="relative">
            <input
              id="password_confirmation"
              name="password_confirmation"
              type={showConfirmPassword ? "text" : "password"}
              autocomplete="new-password"
              data-error={fieldErrors.password_confirmation?.length
                ? "true"
                : "false"}
              class="block w-full px-3 py-2.5 sm:px-4 sm:py-3 border rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base pr-10 {fieldErrors
                .password_confirmation?.length
                ? 'border-red-500 dark:border-red-500'
                : 'border-gray-300 dark:border-[#005159]'}"
              style="--focus-color: {config.color}"
              placeholder={t.resetPassword?.confirmPasswordPlaceholder ||
                "Confirm new password"}
              disabled={isSubmitting || form?.success || isExpired}
              oninput={() => clearFieldError("password_confirmation")}
            />
            <button
              type="button"
              onclick={() => (showConfirmPassword = !showConfirmPassword)}
              class="absolute inset-y-0 right-0 pr-3 flex items-center"
              tabindex="-1"
            >
              {#if showConfirmPassword}
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              {:else}
                <svg
                  class="h-5 w-5 text-gray-400"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              {/if}
            </button>
          </div>
          {#if fieldErrors.password_confirmation?.length}
            <p class="mt-1.5 text-xs sm:text-sm text-red-600 dark:text-red-400">
              {fieldErrors.password_confirmation[0]}
            </p>
          {/if}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || form?.success || isExpired}
          class="w-full py-2.5 sm:py-3 px-4 rounded-lg text-white font-medium transition-all focus:outline-none focus:ring-2 focus:ring-offset-2 dark:focus:ring-offset-gray-950 active:scale-[0.98] text-sm sm:text-base disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          style="background-color: {config.color}; --hover-color: {config.accentColor}; --focus-color: {config.color}"
        >
          {#if isSubmitting}
            <svg
              class="animate-spin h-5 w-5 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          {/if}
          {isSubmitting
            ? t.resetPassword?.submitting || "Resetting..."
            : t.resetPassword?.button || "Reset Password"}
        </button>
      </form>
    {/if}
  </div>
</div>

<style>
  input[type="password"]:focus {
    border-color: var(--focus-color);
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--focus-color) 10%, transparent);
  }

  button[type="submit"]:hover:not(:disabled) {
    background-color: var(--hover-color);
  }

  button[type="submit"]:focus {
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--focus-color) 20%, transparent);
  }

  /* Request new reset link button hover */
  a[href*="/forgot-password"]:hover {
    background-color: var(--hover-color);
  }

  /* Ensure dark mode class is applied */
  :global(html.dark) {
    color-scheme: dark;
  }
</style>

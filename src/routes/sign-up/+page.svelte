<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { getOriginConfig } from "$lib/config/origins";
  import { theme } from "$lib/stores/theme";
  import { language, getTranslations } from "$lib/stores/language";
  import LanguageSelector from "$lib/components/LanguageSelector.svelte";
  import { enhance } from "$app/forms";
  import logo from "$lib/assets/logo.png";
  import { PUBLIC_API_URL } from "$env/static/public";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const config = getOriginConfig(data.origin);
  let t = $derived(getTranslations($language));
  let isSubmitting = $state(false);

  // Username checker states
  let username = $state(form?.username ?? "");
  let usernameCheckTimeout: ReturnType<typeof setTimeout>;
  let usernameStatus = $state<
    "idle" | "checking" | "available" | "taken" | "invalid"
  >("idle");
  let usernameMessage = $state("");

  // Phone number state
  let phoneNumber = $state(form?.phone_number ?? "");

  async function checkUsername(value: string) {
    const translations = getTranslations($language);

    if (!value || value.length < 3) {
      usernameStatus = "invalid";
      usernameMessage = translations.signUp.usernameMinLength;
      return;
    }

    usernameStatus = "checking";
    usernameMessage = "";

    try {
      const API_URL = PUBLIC_API_URL || "http://localhost:3000";
      const response = await fetch(
        `${API_URL}/user/username/check?username=${encodeURIComponent(value)}`
      );
      const result = await response.json();

      if (result.success && result.data?.is_available) {
        usernameStatus = "available";
        usernameMessage = translations.signUp.usernameAvailable;
      } else {
        usernameStatus = "taken";
        usernameMessage = translations.signUp.usernameTaken;
      }
    } catch (error) {
      usernameStatus = "idle";
      usernameMessage = "";
    }
  }

  function handleUsernameInput(e: Event) {
    const input = e.target as HTMLInputElement;
    const value = input.value;
    const translations = getTranslations($language);

    // Only allow alphanumeric characters (a-z, A-Z, 0-9)
    const alphanumericValue = value.replace(/[^a-zA-Z0-9]/g, "");
    username = alphanumericValue;

    // Update input value to reflect the filtered value
    input.value = alphanumericValue;

    clearTimeout(usernameCheckTimeout);

    if (alphanumericValue.length === 0) {
      usernameStatus = "idle";
      usernameMessage = "";
      return;
    }

    if (alphanumericValue.length < 3) {
      usernameStatus = "invalid";
      usernameMessage = translations.signUp.usernameMinLength;
      return;
    }

    usernameCheckTimeout = setTimeout(() => {
      checkUsername(alphanumericValue);
    }, 500);
  }

  // Translate error codes from server
  function translateErrorCode(errorCode: string): string {
    switch (errorCode) {
      case 'PHONE_NUMBER_ALREADY_EXISTS':
        return t.error.phoneAlreadyRegistered;
      case 'EMAIL_ALREADY_EXISTS':
        return t.error.emailAlreadyRegistered;
      case 'USERNAME_ALREADY_EXISTS':
        return t.error.usernameAlreadyTaken;
      case 'REGISTRATION_FAILED':
        return t.error.registrationFailed;
      default:
        return errorCode;
    }
  }

  // Get all error messages (can be multiple)
  function getErrorMessages(): string {
    if (!form?.errors) {
      return form?.errorMessage || t.error.registrationFailed;
    }

    // If there are error codes, translate them
    if (Array.isArray(form.errors) && form.errors.length > 0) {
      const translatedErrors = form.errors.map(code => translateErrorCode(code));
      return translatedErrors.join(', ');
    }

    // Fallback to server message or generic error
    return form?.errorMessage || t.error.registrationFailed;
  }

  function handlePhoneInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    // Only allow numbers
    phoneNumber = value.replace(/\D/g, "");
  }
</script>

<svelte:head>
  <title>Local Place Account - Sign Up</title>
</svelte:head>

<div
  class="min-h-screen flex flex-col gap-6 items-center justify-center bg-white dark:bg-[#00262a] py-8 px-4 sm:py-12 sm:px-6 lg:px-8 transition-colors"
>
  <!-- Language Selector and Theme Toggle -->
  <div class="relative flex items-center justify-between gap-2 w-full">
    <LanguageSelector />
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

  <div class="max-w-md w-full">
    <!-- LocalPlace Logo and Branding -->
    <div class="text-center mb-6 sm:mb-8">
      <div
        class="h-16 w-16 flex items-center justify-center mx-auto mb-4 bg-[#00262a] rounded-full overflow-hidden"
      >
        <img src={logo} alt="LocalPlace" class="h-12 sm:h-16 mx-auto" />
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
      <h2
        class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2"
      >
        {t.signUp.title}
        <span style="color: {config.color}">{config.name}</span>
        {t.signUp.titleSuffix}
      </h2>
      <p class="text-gray-500 dark:text-gray-400 text-sm">
        {t.signUp.subtitle}
      </p>
    </div>

    <form
      method="POST"
      use:enhance={() => {
        isSubmitting = true;
        return async ({ update }) => {
          await update();
          isSubmitting = false;
        };
      }}
      class="space-y-4 sm:space-y-5"
    >
      {#if form?.errors || form?.errorMessage}
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
              <p class="text-sm text-red-800 dark:text-red-200">{getErrorMessages()}</p>
            </div>
          </div>
        </div>
      {/if}

      <div>
        <label
          for="name"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {t.common.fullName}
        </label>
        <input
          id="name"
          name="name"
          type="text"
          autocomplete="name"
          required
          class="block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-[#005159] rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base"
          style="--focus-color: {config.color}"
          placeholder={t.signUp.fullNamePlaceholder}
          value={form?.name ?? ""}
        />
      </div>

      <div>
        <label
          for="username"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {t.common.username}
        </label>
        <div class="relative">
          <input
            id="username"
            name="username"
            type="text"
            autocomplete="username"
            required
            class="block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-[#005159] rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base pr-10"
            style="--focus-color: {config.color}"
            placeholder={t.signUp.usernamePlaceholder}
            value={username}
            oninput={handleUsernameInput}
          />
          {#if usernameStatus === "checking"}
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                class="animate-spin h-5 w-5 text-gray-400"
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
            </div>
          {:else if usernameStatus === "available"}
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                class="h-5 w-5 text-green-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {:else if usernameStatus === "taken"}
            <div class="absolute right-3 top-1/2 -translate-y-1/2">
              <svg
                class="h-5 w-5 text-red-500"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fill-rule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
          {/if}
        </div>
        {#if usernameMessage}
          <p
            class="mt-1.5 text-xs sm:text-sm {usernameStatus === 'available'
              ? 'text-green-600 dark:text-green-400'
              : usernameStatus === 'taken' || usernameStatus === 'invalid'
                ? 'text-red-600 dark:text-red-400'
                : 'text-gray-500 dark:text-gray-400'}"
          >
            {usernameMessage}
          </p>
        {/if}
      </div>

      <div>
        <label
          for="email"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {t.common.email}
          <span class="text-gray-400 text-xs">({t.common.optional})</span>
        </label>
        <input
          id="email"
          name="email"
          type="email"
          autocomplete="email"
          class="block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-[#005159] rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base"
          style="--focus-color: {config.color}"
          placeholder={t.signUp.emailPlaceholder}
          value={form?.email ?? ""}
        />
      </div>

      <div>
        <label
          for="phone_number"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {t.common.phoneNumber}
        </label>
        <div class="relative">
          <div
            class="absolute left-3 sm:left-4 top-1/2 -translate-y-1/2 text-gray-700 dark:text-gray-300 text-sm sm:text-base pointer-events-none"
          >
            +62
          </div>
          <input
            id="phone_number"
            name="phone_number"
            type="tel"
            autocomplete="tel"
            required
            class="block w-full pl-14 sm:pl-16 pr-3 py-2.5 sm:pr-4 sm:py-3 border border-gray-300 dark:border-[#005159] rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base"
            style="--focus-color: {config.color}"
            placeholder="812345678"
            value={phoneNumber}
            oninput={handlePhoneInput}
          />
        </div>
        <p class="mt-1.5 text-xs text-gray-500 dark:text-gray-400">
          (e.g., 812345678)
        </p>
      </div>

      <div>
        <label
          for="password"
          class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
        >
          {t.common.password}
        </label>
        <input
          id="password"
          name="password"
          type="password"
          autocomplete="new-password"
          required
          class="block w-full px-3 py-2.5 sm:px-4 sm:py-3 border border-gray-300 dark:border-[#005159] rounded-lg text-gray-900 dark:text-white bg-white dark:bg-[#003a3f] placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-0 dark:focus:ring-offset-gray-950 transition-all text-sm sm:text-base"
          style="--focus-color: {config.color}"
          placeholder={t.signUp.passwordPlaceholder}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
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
        {t.signUp.button}
      </button>
    </form>

    <div
      class="mt-5 sm:mt-6 text-center text-sm text-gray-600 dark:text-gray-400"
    >
      {t.signUp.hasAccount}
      <a
        href="/sign-in?origin={data.origin}"
        class="font-medium hover:underline ml-1 transition-colors"
        style="color: {config.color}"
      >
        {t.signUp.signInLink}
      </a>
    </div>
  </div>
</div>

<style>
  input[type="text"]:focus,
  input[type="email"]:focus,
  input[type="tel"]:focus,
  input[type="password"]:focus {
    border-color: var(--focus-color);
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--focus-color) 10%, transparent);
  }

  button[type="submit"]:hover {
    background-color: var(--hover-color);
  }

  button[type="submit"]:focus {
    box-shadow: 0 0 0 3px
      color-mix(in srgb, var(--focus-color) 20%, transparent);
  }
</style>

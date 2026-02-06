<script lang="ts">
  import type { ActionData, PageData } from "./$types";
  import { getOriginConfig } from "$lib/config/origins";
  import { theme } from "$lib/stores/theme";
  import { language, getTranslations } from "$lib/stores/language";
  import LanguageSelector from "$lib/components/LanguageSelector.svelte";
  import { enhance } from "$app/forms";
  import logo from "$lib/assets/logo.svg";
  import Icon from "@iconify/svelte";
  import { createAuthSchemas } from "$lib/schemas/auth";
  import { getErrorMessages } from "$lib/utils/errorTranslation";

  let { data, form }: { data: PageData; form: ActionData } = $props();

  const config = getOriginConfig(data.origin);
  let t = $derived(getTranslations($language));
  let isSubmitting = $state(false);

  // Phone number state
  let phoneNumber = $state("");

  // Client-side validation errors
  let fieldErrors = $state<Record<string, string[]>>({});

  // Create reactive schemas based on current language
  let schemas = $derived(createAuthSchemas(t));

  function handlePhoneInput(e: Event) {
    const value = (e.target as HTMLInputElement).value;
    // Only allow numbers
    phoneNumber = value.replace(/\D/g, "");
    // Clear error when user types
    if (fieldErrors.phone_number) {
      fieldErrors = { ...fieldErrors, phone_number: [] };
    }
  }

  function handlePasswordInput() {
    // Clear error when user types
    if (fieldErrors.password) {
      fieldErrors = { ...fieldErrors, password: [] };
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
</script>

<svelte:head>
  <title>Local Place Account - Sign In</title>
</svelte:head>

<div class="min-h-screen bg-gray-50 dark:bg-gray-900">
  <!-- Header with Gradient Background - Similar to Fitly -->
  <div class="bg-gradient-to-r from-[#5776F3] to-[#FF99FF] px-4 pt-8 pb-20 rounded-b-[40px]">
    <!-- Language Selector and Theme Toggle -->
    <div class="flex items-center justify-between mb-8">
      <LanguageSelector />
      
      <button
        onclick={() => theme.toggle()}
        class="p-2.5 rounded-full bg-white/20 backdrop-blur-sm text-white hover:bg-white/30 transition-all"
        aria-label="Toggle dark mode"
      >
        {#if $theme === "dark"}
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
              clip-rule="evenodd"
            />
          </svg>
        {:else}
          <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
            <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
          </svg>
        {/if}
      </button>
    </div>

    <!-- Logo and Branding -->
    <div class="text-center">
      <div class="h-20 w-20 flex items-center justify-center mx-auto mb-4 bg-white rounded-3xl shadow-xl overflow-hidden">
        <img src={logo} alt="LocalPlace" class="h-16 mx-auto" />
      </div>

      <!-- Ecosystem Badge - More compact -->
      <div class="inline-flex flex-col items-center gap-1 px-5 py-2.5 bg-white/20 backdrop-blur-sm rounded-full mb-4">
        <div class="flex items-center gap-1.5">
          <svg class="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 20 20">
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-sm font-bold text-white">{config.name}</span>
        </div>
        <p class="text-xs text-white/90">is part of the Local Place ecosystem</p>
      </div>
    </div>
  </div>

  <!-- Main Content Card - Overlapping the gradient header -->
  <div class="px-4 -mt-18 pb-8">
    <div class="max-w-md mx-auto">
      <!-- White Card Container -->
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6">
        <!-- Sign Up Link -->
        <div class="text-center mb-6">
          <a
            href="/sign-up?origin={data.origin}"
            class="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5776F3] to-[#FF99FF] text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
          >
            {t.signIn.createNewAccount}
            <Icon icon="solar:alt-arrow-right-linear" font-size="18px" />
          </a>
        </div>

        <!-- Title -->
        <div class="text-center mb-8">
          <h2 class="text-2xl font-bold text-gray-900 mb-2 dark:text-white">
            {t.signIn.title}
            
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#5776F3] to-[#FF99FF]">{config.name}</span>
          </h2>
          <p class="text-gray-600 dark:text-gray-300 text-sm">
            {t.signIn.subtitle}
          </p>
        </div>

        <!-- Form -->
        <form
          method="POST"
          use:enhance={() => {
            // Clear previous errors
            fieldErrors = {};

            // Client-side validation
            const formData = new FormData(document.querySelector("form")!);
            let phone = formData.get("phone_number")?.toString() || "";
            const password = formData.get("password")?.toString() || "";

            // Format phone number for validation
            phone = phone.replace(/\D/g, "");

            const validation = schemas.signInSchema.safeParse({
              phone_number: phone,
              password,
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
              await update();
              isSubmitting = false;
            };
          }}
          class="space-y-5"
        >
          {#if form?.errors || form?.errorMessage}
            <div class="rounded-2xl bg-red-50 border border-red-200 p-4">
              <div class="flex">
                <div class="flex-shrink-0">
                  <svg class="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clip-rule="evenodd"
                    />
                  </svg>
                </div>
                <div class="ml-3">
                  <p class="text-sm text-red-800 font-medium">
                    {getErrorMessages(form, t, t.error.invalidPhoneOrPassword)}
                  </p>
                </div>
              </div>
            </div>
          {/if}

          <div>
            <label for="phone_number" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t.common.phoneNumber}
            </label>
            <div class="relative">
              <div class="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 dark:text-gray-400 text-base font-medium pointer-events-none z-10">
                +62
              </div>
              <input
                id="phone_number"
                name="phone_number"
                type="tel"
                autocomplete="tel"
                data-error={fieldErrors.phone_number?.length ? "true" : "false"}
                class="block w-full pl-14 pr-4 py-4 border-0 rounded-2xl text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5776F3] transition-all text-base {fieldErrors
                  .phone_number?.length
                  ? 'ring-2 ring-red-500 dark:ring-red-500'
                  : ''}"
                placeholder="87712345678"
                value={phoneNumber}
                oninput={handlePhoneInput}
              />
            </div>
            {#if fieldErrors.phone_number?.length}
              <p class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                {fieldErrors.phone_number[0]}
              </p>
            {:else}
              <p class="mt-2 text-xs text-gray-500 dark:text-gray-400">
                e.g., 87712345678
              </p>
            {/if}
          </div>

          <div>
            <label for="password" class="block text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">
              {t.common.password}
            </label>
            <input
              id="password"
              name="password"
              type="password"
              autocomplete="current-password"
              data-error={fieldErrors.password?.length ? "true" : "false"}
              class="block w-full px-4 py-4 border-0 rounded-2xl text-gray-900 dark:text-white bg-gray-50 dark:bg-slate-800 placeholder-gray-400 dark:placeholder-gray-500 shadow-sm focus:outline-none focus:ring-2 focus:ring-[#5776F3] transition-all text-base {fieldErrors
                .password?.length
                ? 'ring-2 ring-red-500 dark:ring-red-500'
                : ''}"
              placeholder={t.signIn.passwordPlaceholder}
              oninput={handlePasswordInput}
            />
            {#if fieldErrors.password?.length}
              <p class="mt-2 text-sm text-red-600 dark:text-red-400 font-medium">
                {fieldErrors.password[0]}
              </p>
            {/if}
          </div>

          <div class="text-center">
            <a
              href="/forgot-password?origin={data.origin}"
              class="text-sm font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 hover:underline transition-colors"
            >
              {t.common.forgotPassword}
            </a>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            class="w-full py-4 px-4 rounded-2xl bg-gradient-to-r from-[#5776F3] to-[#FF99FF] text-white font-semibold text-base shadow-lg hover:shadow-xl transition-all focus:outline-none focus:ring-4 focus:ring-[#5776F3]/30 active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {#if isSubmitting}
              <svg
                class="animate-spin h-5 w-5"
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
            {t.signIn.button}
          </button>
        </form>
      </div>


    </div>
  </div>
</div>

<style>
  /* Fitly-inspired clean styles */
  :global(html.dark) {
    color-scheme: dark;
  }

  /* Smooth transitions for all interactive elements */
  button,
  input,
  a {
    transition: all 0.2s ease;
  }

  /* Input focus states */
  input:focus {
    transform: translateY(-1px);
  }

  /* Button active states */
  button:active:not(:disabled) {
    transform: scale(0.98);
  }
</style>
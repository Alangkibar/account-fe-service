<script lang="ts">
  import { page } from "$app/stores";
  import { theme } from "$lib/stores/theme";
  import logo from "$lib/assets/logo.svg";
  import LanguageSelector from "$lib/components/LanguageSelector.svelte";
  import { getOriginConfig } from "$lib/config/origins";

  const config = getOriginConfig("localplace"); // Default origin for error page
</script>

<svelte:head>
  <title>Local Place Account - Error {$page.status}</title>
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
      <div class="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-6 text-center space-y-6">
        <div class="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-red-100 dark:bg-red-950/30">
          <svg
            class="h-10 w-10 text-red-600 dark:text-red-500"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
        </div>

        <div>
          <h1 class="text-5xl font-extrabold text-gray-900 dark:text-white mb-3">
            {$page.status}
          </h1>
          <h2 class="text-2xl font-bold text-gray-900 dark:text-white mb-3">
            You're Not Allowed
          </h2>
          <p class="text-base text-gray-600 dark:text-gray-300">
            {$page.error?.message || "Access to this page is restricted."}
          </p>
        </div>

        <div class="rounded-2xl bg-yellow-50 border border-yellow-200 p-4">
          <div class="flex">
            <div class="flex-shrink-0">
              <svg
                class="h-5 w-5 text-yellow-500"
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path
                  fill-rule="evenodd"
                  d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
                  clip-rule="evenodd"
                />
              </svg>
            </div>
            <div class="ml-3 text-left">
              <p class="text-sm text-yellow-800 dark:text-yellow-200 font-medium">
                This page requires a valid origin parameter. Please access this page
                through the proper channel.
              </p>
            </div>
          </div>
        </div>

        <a
          href="/"
          class="w-full inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-full bg-gradient-to-r from-[#5776F3] to-[#FF99FF] text-sm font-semibold text-white shadow-md hover:shadow-lg transition-all"
        >
          Go to Home
        </a>
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
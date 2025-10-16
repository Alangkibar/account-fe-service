<script lang="ts">
	import { page } from '$app/stores';
	import { theme } from '$lib/stores/theme';
	import logo from '$lib/assets/logo.png';
</script>

<svelte:head>
	<title>Local Place Account - Error {$page.status}</title>
</svelte:head>

<div class="min-h-screen flex items-center justify-center bg-white dark:bg-[#00262a] py-8 px-4 sm:py-12 sm:px-6 lg:px-8 transition-colors">
	<!-- Theme Toggle -->
	<button
		onclick={() => theme.toggle()}
		class="fixed top-4 right-4 sm:top-6 sm:right-6 p-2 sm:p-3 rounded-full bg-gray-100 dark:bg-[#003a3f] hover:bg-gray-200 dark:hover:bg-[#004a50] transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
		aria-label="Toggle dark mode"
	>
		{#if $theme === 'dark'}
			<svg class="w-5 h-5 sm:w-6 sm:h-6 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
				<path
					fill-rule="evenodd"
					d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
					clip-rule="evenodd"
				/>
			</svg>
		{:else}
			<svg class="w-5 h-5 sm:w-6 sm:h-6 text-[#37cca8]" fill="currentColor" viewBox="0 0 20 20">
				<path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
			</svg>
		{/if}
	</button>

	<div class="max-w-md w-full text-center space-y-6 sm:space-y-8">
		<!-- LocalPlace Logo -->
		<div class="mb-6">
			<img src={logo} alt="LocalPlace" class="h-12 sm:h-16 mx-auto" />
		</div>

		<div class="mx-auto flex items-center justify-center h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-red-100 dark:bg-red-900/30">
			<svg
				class="h-10 w-10 sm:h-12 sm:w-12 text-red-600 dark:text-red-500"
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
			<h1 class="text-5xl sm:text-6xl font-extrabold text-gray-900 dark:text-white mb-3 sm:mb-4">
				{$page.status}
			</h1>
			<h2 class="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-3 sm:mb-4">
				You're Not Allowed
			</h2>
			<p class="text-base sm:text-lg text-gray-600 dark:text-gray-400">
				{$page.error?.message || 'Access to this page is restricted.'}
			</p>
		</div>

		<div class="rounded-lg bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 p-3 sm:p-4">
			<div class="flex">
				<div class="flex-shrink-0">
					<svg
						class="h-5 w-5 text-yellow-400 dark:text-yellow-500"
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
					<p class="text-sm text-yellow-700 dark:text-yellow-200">
						This page requires a valid origin parameter. Please access this page through the proper
						channel.
					</p>
				</div>
			</div>
		</div>

		<a
			href="/"
			class="inline-flex items-center justify-center px-5 py-2.5 sm:px-6 sm:py-3 border border-transparent text-sm sm:text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-950 transition-colors"
		>
			Go to Home
		</a>
	</div>
</div>

<style>
	:global(html.dark) {
		color-scheme: dark;
	}
</style>

<script lang="ts">
    import { enhance } from "$app/forms";

    //TODO: Proper type here
    export let form: any;

    async function handleCopy() {
        const encryptedMessageValue = (<HTMLInputElement>document.getElementById(
            "encrypted-message",
        ))?.value as string;
        try {
            if (navigator.canShare()) {
                await navigator.share({ text: encryptedMessageValue });
            } else {
                await navigator.clipboard.writeText(encryptedMessageValue);
            }
        } catch (error) {
            console.error("Unable to copy. Error was: " + error);
        }
    }
</script>
<svelte:head>
    <title>Encrypt - Easy PGP</title> 
</svelte:head>

{#if form?.errorMessage}
    <div class="rounded-md bg-yellow-50 p-4">
        <div class="flex">
            <div class="ml-3 flex flex-row">
                <svg
                    class="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                >
                    <path
                        fill-rule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
                        clip-rule="evenodd"
                    />
                </svg>
                <h3 class="text-sm font-medium text-yellow-800">
                    Message encryption error
                </h3>
                <div class="mt-2 text-sm text-yellow-700">
                    <p>
                        {form?.errorMessage}
                    </p>
                </div>
            </div>
        </div>
    </div>
{/if}

{#if form?.success}
    <div class="rounded-md bg-green-50 p-4 flex place-content-center">
        <div class="ml-3">
            <div class="mt-2">
                <h2 class="text-base font-semibold leading-7 text-gray-900">
                    Encryption success
                </h2>
                <p class="mt-1 text-sm leading-6 text-gray-600">
                    Your message has been sucessfully encrypted for the
                    recipient.
                </p>
                <textarea
                    name="encrypted-message"
                    id="encrypted-message"
                    readonly
                    class="block w-full min-h-56 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                >
                    {form.encryptedMessage}
                </textarea>
            </div>
            <div class="mt-4">
                <div class="-mx-2 -my-1.5 flex">
                    <button
                        on:click={handleCopy}
                        type="button"
                        class="rounded-md bg-green-50 px-2 py-1.5 text-sm font-medium text-green-800 hover:bg-green-100 focus:outline-none focus:ring-2 focus:ring-green-600 focus:ring-offset-2 focus:ring-offset-green-50"
                        >Copy to clipboard</button
                    >
                </div>
            </div>
        </div>
    </div>
{:else}
    <form method="POST" use:enhance>
        <div class="flex flex-col space-y-12">
            <div class="border-b border-gray-900/10 pb-12 m-8">
                <div class="mt-10 flex place-content-center">
                    <div class="">
                        <h2
                            class="text-base font-semibold leading-7 text-gray-900"
                        >
                            Encrypt
                        </h2>
                        <p class="mt-1 text-sm leading-6 text-gray-600">
                            Use this tool to encrypt a message with the
                            recipient's public key.
                        </p>

                        <div class="mt-5 flex flex-col">
                            <div class="sm:col-span-3">
                                <label
                                    for="message"
                                    class="block text-sm font-medium leading-6 text-gray-900"
                                    >Your message</label
                                >
                                <div class="mt-2">
                                    <textarea
                                        name="message"
                                        id="message"
                                        class="block w-full min-h-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                        value={form?.message ?? ""}
                                    />
                                </div>
                            </div>

                            <div class="sm:col-span-3">
                                <label
                                    for="receipent-public-key"
                                    class="block text-sm font-medium leading-6 text-gray-900"
                                    >Recipient Public Key</label
                                >
                                <div class="mt-2">
                                    <textarea
                                        name="receipent-public-key"
                                        id="receipent-public-key"
                                        class="block w-full min-h-52 rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                                        required
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="mt-6 flex items-center justify-end gap-x-6">
                    <button
                        type="submit"
                        class="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
                        >Encrypt</button
                    >
                </div>
            </div>
        </div>
    </form>
{/if}

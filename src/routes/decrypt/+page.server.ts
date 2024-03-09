import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as openpgp from 'openpgp';


export const actions = {
    default: async ({ request }) => {
        const data: FormData = await request.formData();
        const messageInput: string = data.get('message') as string;
        const receipentPrivateKeyInput: string = data.get('receipent-private-key') as string

        if (!messageInput) {
            return fail(400, { errorMessage: "Message input must be present" });
        }

        if (!receipentPrivateKeyInput) {
            return fail(400, { errorMessage: "Receipent private key must be present" });
        }
        try {
            const decryptedMessage = await openpgp.decrypt({
                message: await openpgp.readMessage({ armoredMessage: messageInput }),
                decryptionKeys: await openpgp.readPrivateKey({ armoredKey: receipentPrivateKeyInput }),
            });
    
            return {
                success: true,
                decryptedMessage: decryptedMessage.data
            }
        } catch (e) {
            console.log("Error occured: " + e)
            return fail(400, { errorMessage: "Error decrypting your message" });
        }
        
    },
} satisfies Actions;
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as openpgp from 'openpgp';


export const actions = {
    default: async ({ request }) => {
        const data = await request.formData();
        const messageInput = data.get('message') as string;
        const receipentPublicKeyInput = data.get('receipent-public-key') as string

        if (!messageInput) {
            return fail(400, { errorMessage: "Message input must be present" });
        }

        if (!receipentPublicKeyInput) {
            return fail(400, { errorMessage: "Receipent public key must be present" });
        }
        try {
            const receipentPublicKey = await openpgp.readKey({ armoredKey: receipentPublicKeyInput })
            const encryptedMessage = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: messageInput }), // input as Message object
                encryptionKeys: receipentPublicKey,
            });
    
            return {
                success: true,
                encryptedMessage
            }
        } catch (e) {
            console.log("Error occured: " + e)
            fail(400, { errorMessage: "Error encrypting your message" });
        }
        
    },
} satisfies Actions;
import { fail } from '@sveltejs/kit';
import type { Actions } from './$types';
import * as openpgp from 'openpgp';


export const actions = {
    default: async ({ request }) => {
        const data: FormData = await request.formData();
        const messageInput: string = data.get('message') as string;
        const receipentPublicKeyInput: string = data.get('receipent-public-key') as string

        if (!messageInput) {
            return fail(400, { errorMessage: "Message input must be present" });
        }

        if (!receipentPublicKeyInput) {
            return fail(400, { errorMessage: "Receipent public key must be present" });
        }
        try {
            const encryptedMessage = await openpgp.encrypt({
                message: await openpgp.createMessage({ text: messageInput }), 
                encryptionKeys: await openpgp.readKey({ armoredKey: receipentPublicKeyInput }),
            }) as string;
    
            return {
                success: true,
                encryptedMessage
            }
        } catch (e) {
            console.log("Error occured: " + e)
            return fail(400, { errorMessage: "Error encrypting your message" });
        }
        
    },
} satisfies Actions;
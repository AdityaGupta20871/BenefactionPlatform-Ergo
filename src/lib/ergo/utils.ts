import { ErgoAddress, SByte, SColl, SConstant, SGroupElement } from "@fleet-sdk/core";
import { stringToBytes } from "@scure/base";
import { connected } from "../common/store";
import { get } from "svelte/store";

export function serializedToRendered(serializedValue: string): string {
    // Assuming the serialized value always starts with a pattern to strip (e.g., '0e')
    const patternToStrip = '0e';
    if (serializedValue.startsWith(patternToStrip)) {
        // Remove the pattern and return the hex string
        return serializedValue.substring(patternToStrip.length).substring(2);
    } else {
        // If the pattern does not exist at the start, return the original string
        return serializedValue.substring(2);
    }
}

export function hexToUtf8(hexString: string): string | null {
    try {
        if (hexString.length % 2 !== 0) {
            return null;
        }
    
        // Convierte la cadena hexadecimal a un array de bytes
        const byteArray = new Uint8Array(hexString.match(/.{1,2}/g)!.map(byte => parseInt(byte, 16)));
    
        // Crea un nuevo TextDecoder para convertir el array de bytes a una cadena UTF-8
        const decoder = new TextDecoder('utf-8');
        const utf8String = decoder.decode(byteArray);
    
        return utf8String;
    } catch {
        return null;
    }
  }

export function generate_pk_proposition(wallet_pk: string): string {
    const pk = ErgoAddress.fromBase58(wallet_pk).getPublicKeys()[0];
    const encodedProp = SGroupElement(pk);
    return encodedProp.toHex();
}

export function SString(value: string): string {
    return SConstant(SColl(SByte, stringToBytes('utf8', value)));
}

export function stringToRendered(value: string): string {
    return serializedToRendered(SString(value));
}

export async function is_local_addr(value: string): Promise<boolean> {
    if (!get(connected)) return false;
    return stringToRendered(generate_pk_proposition((await ergo.get_change_address()))).substring(4,) === stringToRendered(value);
}

export function uint8ArrayToHex(array: Uint8Array): string { 
    return [...new Uint8Array(array)]
        .map(x => x.toString(16).padStart(2, '0'))
        .join('');
  }
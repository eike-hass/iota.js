// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable unicorn/no-nested-ternary */
import { Converter } from "@iota/util.js";
import { MAX_INDEXATION_KEY_LENGTH, MIN_INDEXATION_KEY_LENGTH } from "../binary/payload.mjs";
import { SingleNodeClient } from "../clients/singleNodeClient.mjs";
import { INDEXATION_PAYLOAD_TYPE } from "../models/IIndexationPayload.mjs";
/**
 * Send a data message.
 * @param client The client or node endpoint to send the data with.
 * @param indexationKey The index name.
 * @param indexationData The index data as either UTF8 text or Uint8Array bytes.
 * @returns The id of the message created and the message.
 */
export async function sendData(client, indexationKey, indexationData) {
    const localClient = typeof client === "string" ? new SingleNodeClient(client) : client;
    if (!indexationKey) {
        throw new Error("indexationKey must not be empty");
    }
    const localIndexationKeyHex = typeof indexationKey === "string" ? Converter.utf8ToHex(indexationKey) : Converter.bytesToHex(indexationKey);
    if (localIndexationKeyHex.length / 2 < MIN_INDEXATION_KEY_LENGTH) {
        throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which is below the minimum size of ${MIN_INDEXATION_KEY_LENGTH}`);
    }
    if (localIndexationKeyHex.length / 2 > MAX_INDEXATION_KEY_LENGTH) {
        throw new Error(`The indexation key length is ${localIndexationKeyHex.length / 2}, which exceeds the maximum size of ${MAX_INDEXATION_KEY_LENGTH}`);
    }
    const indexationPayload = {
        type: INDEXATION_PAYLOAD_TYPE,
        index: localIndexationKeyHex,
        data: indexationData
            ? typeof indexationData === "string"
                ? Converter.utf8ToHex(indexationData)
                : Converter.bytesToHex(indexationData)
            : undefined
    };
    const message = {
        payload: indexationPayload
    };
    const messageId = await localClient.messageSubmit(message);
    return {
        message,
        messageId
    };
}

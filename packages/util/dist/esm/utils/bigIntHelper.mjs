// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/* eslint-disable newline-per-chained-call */
/* eslint-disable no-mixed-operators */
import bigInt from "big-integer";
import { RandomHelper } from "./randomHelper.mjs";
/**
 * Helper methods for bigints.
 */
export class BigIntHelper {
    /**
     * Load 3 bytes from array as bigint.
     * @param data The input array.
     * @param byteOffset The start index to read from.
     * @returns The bigint.
     */
    static read3(data, byteOffset) {
        const v0 = (data[byteOffset + 0] + (data[byteOffset + 1] << 8) + (data[byteOffset + 2] << 16)) >>> 0;
        return bigInt(v0);
    }
    /**
     * Load 4 bytes from array as bigint.
     * @param data The input array.
     * @param byteOffset The start index to read from.
     * @returns The bigint.
     */
    static read4(data, byteOffset) {
        const v0 = (data[byteOffset + 0] +
            (data[byteOffset + 1] << 8) +
            (data[byteOffset + 2] << 16) +
            (data[byteOffset + 3] << 24)) >>>
            0;
        return bigInt(v0);
    }
    /**
     * Load 8 bytes from array as bigint.
     * @param data The data to read from.
     * @param byteOffset The start index to read from.
     * @returns The bigint.
     */
    static read8(data, byteOffset) {
        const v0 = (data[byteOffset + 0] +
            (data[byteOffset + 1] << 8) +
            (data[byteOffset + 2] << 16) +
            (data[byteOffset + 3] << 24)) >>>
            0;
        const v1 = (data[byteOffset + 4] +
            (data[byteOffset + 5] << 8) +
            (data[byteOffset + 6] << 16) +
            (data[byteOffset + 7] << 24)) >>>
            0;
        return bigInt(v1).shiftLeft(BigIntHelper.BIG_32).or(v0);
    }
    /**
     * Convert a big int to bytes.
     * @param value The bigint.
     * @param data The buffer to write into.
     * @param byteOffset The start index to write from.
     */
    static write8(value, data, byteOffset) {
        const v0 = Number(value.and(BigIntHelper.BIG_32_MASK));
        const v1 = Number(value.shiftRight(BigIntHelper.BIG_32).and(BigIntHelper.BIG_32_MASK));
        data[byteOffset] = v0 & 0xff;
        data[byteOffset + 1] = (v0 >> 8) & 0xff;
        data[byteOffset + 2] = (v0 >> 16) & 0xff;
        data[byteOffset + 3] = (v0 >> 24) & 0xff;
        data[byteOffset + 4] = v1 & 0xff;
        data[byteOffset + 5] = (v1 >> 8) & 0xff;
        data[byteOffset + 6] = (v1 >> 16) & 0xff;
        data[byteOffset + 7] = (v1 >> 24) & 0xff;
    }
    /**
     * Generate a random bigint.
     * @returns The bitint.
     */
    static random() {
        return BigIntHelper.read8(RandomHelper.generate(8), 0);
    }
}
// @internal
BigIntHelper.BIG_32 = bigInt(32);
// @internal
BigIntHelper.BIG_32_MASK = bigInt(0xffffffff);

// Copyright 2020 IOTA Stiftung
// SPDX-License-Identifier: Apache-2.0
/* eslint-disable no-bitwise */
/**
 * This is a port of the Go code from https://github.com/hdevalence/ed25519consensus
 * which is an extension of https://github.com/golang/crypto/tree/master/ed25519
 * which in a port of the “ref10” implementation of ed25519 from SUPERCOP.
 */
import { CONST_BASE } from "./const";
import { FieldElement } from "./fieldElement";
/**
 * Group elements are members of the elliptic curve -x^2 + y^2 = 1 + d * x^2 *
 * y^2 where d = -121665/121666.
 * PreComputedGroupElement: (y+x,y-x,2dxy).
 */
export class PreComputedGroupElement {
    /**
     * Create a new instance of PreComputedGroupElement.
     * @param yPlusX Y + X Element.
     * @param yMinusX Y - X Element.
     * @param xy2d XY2d Element.
     */
    constructor(yPlusX, yMinusX, xy2d) {
        this.yPlusX = yPlusX !== null && yPlusX !== void 0 ? yPlusX : new FieldElement();
        this.yMinusX = yMinusX !== null && yMinusX !== void 0 ? yMinusX : new FieldElement();
        this.xy2d = xy2d !== null && xy2d !== void 0 ? xy2d : new FieldElement();
    }
    /**
     * Set the elements to zero.
     */
    zero() {
        this.yPlusX.one();
        this.yMinusX.one();
        this.xy2d.zero();
    }
    /**
     * CMove the pre computed element.
     * @param u The u.
     * @param b The b.
     */
    cMove(u, b) {
        this.yPlusX.cMove(u.yPlusX, b);
        this.yMinusX.cMove(u.yMinusX, b);
        this.xy2d.cMove(u.xy2d, b);
    }
    /**
     * Select point.
     * @param pos The position.
     * @param b The index.
     */
    selectPoint(pos, b) {
        const minusT = new PreComputedGroupElement();
        const bNegative = this.negative(b);
        const bAbs = b - ((-bNegative & b) << 1);
        this.zero();
        for (let i = 0; i < 8; i++) {
            this.cMove(CONST_BASE[pos][i], this.equal(bAbs, i + 1));
        }
        minusT.yPlusX = this.yMinusX.clone();
        minusT.yMinusX = this.yPlusX.clone();
        minusT.xy2d = this.xy2d.clone();
        minusT.xy2d.neg();
        this.cMove(minusT, bNegative);
    }
    /**
     * Negative returns 1 if b < 0 and 0 otherwise.
     * @param b The b.
     * @returns 1 if b < 0 and 0.
     */
    negative(b) {
        return (b >> 31) & 1;
    }
    /**
     * Equal returns 1 if b == c and 0 otherwise, assuming that b and c are
     * non-negative.
     * @param b The b.
     * @param c The c.
     * @returns 1 if b == c and 0.
     */
    equal(b, c) {
        let x = (b ^ c) & 0xffffffff;
        x--;
        return Math.abs(x >> 31);
    }
}
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoicHJlQ29tcHV0ZWRHcm91cEVsZW1lbnQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlcyI6WyIuLi8uLi8uLi9zcmMvc2lnbmF0dXJlcy9lZHdhcmRzMjU1MTkvcHJlQ29tcHV0ZWRHcm91cEVsZW1lbnQudHMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUEsK0JBQStCO0FBQy9CLHNDQUFzQztBQUN0QywrQkFBK0I7QUFDL0I7Ozs7R0FJRztBQUNILE9BQU8sRUFBRSxVQUFVLEVBQUUsTUFBTSxTQUFTLENBQUM7QUFDckMsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLGdCQUFnQixDQUFDO0FBRTlDOzs7O0dBSUc7QUFDSCxNQUFNLE9BQU8sdUJBQXVCO0lBZ0JoQzs7Ozs7T0FLRztJQUNILFlBQVksTUFBcUIsRUFBRSxPQUFzQixFQUFFLElBQW1CO1FBQzFFLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxhQUFOLE1BQU0sY0FBTixNQUFNLEdBQUksSUFBSSxZQUFZLEVBQUUsQ0FBQztRQUMzQyxJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sYUFBUCxPQUFPLGNBQVAsT0FBTyxHQUFJLElBQUksWUFBWSxFQUFFLENBQUM7UUFDN0MsSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLGFBQUosSUFBSSxjQUFKLElBQUksR0FBSSxJQUFJLFlBQVksRUFBRSxDQUFDO0lBQzNDLENBQUM7SUFFRDs7T0FFRztJQUNJLElBQUk7UUFDUCxJQUFJLENBQUMsTUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO1FBQ2xCLElBQUksQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLENBQUM7UUFDbkIsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLEVBQUUsQ0FBQztJQUNyQixDQUFDO0lBRUQ7Ozs7T0FJRztJQUNJLEtBQUssQ0FBQyxDQUEwQixFQUFFLENBQVM7UUFDOUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsQ0FBQztRQUMvQixJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsT0FBTyxFQUFFLENBQUMsQ0FBQyxDQUFDO1FBQ2pDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQyxDQUFDLENBQUM7SUFDL0IsQ0FBQztJQUVEOzs7O09BSUc7SUFDSSxXQUFXLENBQUMsR0FBVyxFQUFFLENBQVM7UUFDckMsTUFBTSxNQUFNLEdBQUcsSUFBSSx1QkFBdUIsRUFBRSxDQUFDO1FBQzdDLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDbkMsTUFBTSxJQUFJLEdBQUcsQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLFNBQVMsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztRQUV6QyxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsRUFBRSxFQUFFO1lBQ3hCLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxFQUFFLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDO1NBQzNEO1FBRUQsTUFBTSxDQUFDLE1BQU0sR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLEtBQUssRUFBRSxDQUFDO1FBQ3JDLE1BQU0sQ0FBQyxPQUFPLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNyQyxNQUFNLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxFQUFFLENBQUM7UUFDaEMsTUFBTSxDQUFDLElBQUksQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUVsQixJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sRUFBRSxTQUFTLENBQUMsQ0FBQztJQUNsQyxDQUFDO0lBRUQ7Ozs7T0FJRztJQUNLLFFBQVEsQ0FBQyxDQUFTO1FBQ3RCLE9BQU8sQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0lBQ3pCLENBQUM7SUFFRDs7Ozs7O09BTUc7SUFDSyxLQUFLLENBQUMsQ0FBUyxFQUFFLENBQVM7UUFDOUIsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsQ0FBQyxDQUFDLEdBQUcsVUFBVSxDQUFDO1FBQzdCLENBQUMsRUFBRSxDQUFDO1FBQ0osT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLENBQUMsQ0FBQztJQUM3QixDQUFDO0NBQ0oifQ==
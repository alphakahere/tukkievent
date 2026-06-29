/**
 * Deterministic faux-barcode generator.
 *
 * The real machine-readable code on a ticket is the QR (check-in scans the QR).
 * The barcode strip is decorative — it just needs to look like a barcode and be
 * stable for a given ticket. We derive bar widths from a seed string so the same
 * ticket always renders the same pattern, on screen and in the PDF.
 *
 * Returns alternating bar widths starting with a dark bar (index 0 = dark,
 * 1 = light, 2 = dark, …). Widths are small integers (1–3 "units").
 */
export function barcodeBars(seed: string, count = 48): number[] {
	let h = 2166136261 >>> 0;
	for (let i = 0; i < seed.length; i++) {
		h ^= seed.charCodeAt(i);
		h = Math.imul(h, 16777619) >>> 0;
	}
	const bars: number[] = [];
	for (let i = 0; i < count; i++) {
		h = (Math.imul(h, 1103515245) + 12345) >>> 0;
		bars.push((h % 3) + 1);
	}
	return bars;
}

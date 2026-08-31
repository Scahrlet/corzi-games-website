"""
Verify the generated QR codes actually decode back to the right URL.

    py -m pip install opencv-python-headless numpy
    py tools/verify_qr.py

This rebuilds the exact matrices make_qr.py draws -- including the square
punched out for the centre logo -- and runs them through a real decoder.
Worth doing before you spend money at a print shop.
"""

import cv2
import numpy as np

from make_qr import URL, BORDER, matrix, logo_hole


def decode(grid, size, scale=12, invert=False):
    """Render the module grid to a bitmap and decode it."""
    a = np.array(grid, dtype=np.uint8)
    img = np.where(a == 1, 0, 255).astype(np.uint8)   # 1 = dark module
    if invert:
        img = 255 - img
    img = np.kron(img, np.ones((scale, scale), dtype=np.uint8))
    ok, decoded, *_ = cv2.QRCodeDetector().detectAndDecode(img)
    return ok if isinstance(ok, str) else decoded


def check(label, with_logo=False, invert=False):
    grid, size = matrix(URL)

    covered = 0
    if with_logo:
        lo, hi = logo_hole(size)
        for y in range(lo, hi):
            for x in range(lo, hi):
                covered += grid[y][x]
                grid[y][x] = 0                        # logo blanks these modules

    got = decode(grid, size, invert=invert)
    ok = (got == URL)

    note = ""
    if with_logo:
        total = sum(sum(r) for r in grid) + covered
        note = f"  [logo covers {covered} dark modules, {covered / total:.1%} of them]"

    print(f"  {'PASS' if ok else 'FAIL'}  {label}{note}")
    if not ok:
        print(f"        expected {URL!r}")
        print(f"        got      {got!r}")
    return ok


if __name__ == "__main__":
    print(f"Verifying QR codes decode to {URL}\n")

    print("PRINTABLE -- these must all pass:")
    results = [
        check("corzi-qr-print.svg  (plain, dark-on-light)"),
        check("corzi-qr-card.svg   (logo,  dark-on-light)", with_logo=True),
    ]

    print()
    if all(results):
        print("All printable codes decoded correctly.")
    else:
        print("A printable code FAILED -- do NOT send it to print.")

    # The screen-only variant is expected to fail here. That is not data
    # corruption: the same matrix passes when read the right way round (see
    # below). It fails because OpenCV -- like a chunk of scanner apps -- will
    # not read a light-on-dark code. Kept as a standing reminder of why that
    # file is screen-only.
    print("\nSCREEN-ONLY -- expected to fail inverted, and that's the point:")
    check("corzi-qr-screen-dark.svg  (logo, light-on-dark)", with_logo=True, invert=True)
    check("  ...same matrix, read normally", with_logo=True)

    print("\nNote: a software decoder is a floor, not a guarantee. Still scan the")
    print("printed proof with a real phone before approving the full run.")

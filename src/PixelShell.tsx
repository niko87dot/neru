import { useEffect, useRef } from "react";

interface PixelShellProps {
  children: React.ReactNode;
}

export default function PixelShell({ children }: PixelShellProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = canvas.width;
    const H = canvas.height;

    // Colors
    const C = {
      black:   "#000000",
      outline: "#0a1208",
      darkest: "#0d1a0d",
      dark:    "#1a3320",
      mid:     "#1e3d22",
      base:    "#2d5535",
      light:   "#3d6b2f",
    };

    ctx.clearRect(0, 0, W, H);

    // Helper — draw a pixel block (1 unit = 1px on internal canvas)
    function dot(x: number, y: number, color: string) {
      ctx!.fillStyle = color;
      ctx!.fillRect(x, y, 1, 1);
    }

    // Draw egg shape pixel by pixel
    // Internal canvas is 46 wide x 74 tall
    // Egg defined as a series of row spans [xStart, xEnd]
    const eggRows: [number, number][] = [
      [16, 29], // row 0
      [12, 33], // row 1
      [10, 35], // row 2
      [8,  37], // row 3
      [7,  38], // row 4
      [6,  39], // row 5
      [5,  40], // row 6
      [4,  41], // row 7
      [4,  41], // row 8
      [3,  42], // row 9
      [3,  42], // row 10
      [3,  42], // row 11
      [3,  42], // row 12
      [3,  42], // row 13
      [3,  42], // row 14
      [3,  42], // row 15
      [3,  42], // row 16
      [3,  42], // row 17
      [3,  42], // row 18
      [3,  42], // row 19
      [3,  42], // row 20
      [3,  42], // row 21
      [3,  42], // row 22
      [3,  42], // row 23
      [3,  42], // row 24
      [3,  42], // row 25
      [3,  42], // row 26
      [4,  41], // row 27
      [4,  41], // row 28
      [5,  40], // row 29
      [6,  39], // row 30
      [7,  38], // row 31
      [8,  37], // row 32
      [9,  36], // row 33
      [11, 34], // row 34
      [13, 32], // row 35
      [15, 30], // row 36
      [17, 28], // row 37
      [19, 26], // row 38
      [20, 25], // row 39
      [21, 24], // row 40
      [21, 24], // row 41
      [22, 23], // row 42
    ];

    // Draw egg base zones (pixel shading)
    eggRows.forEach(([x0, x1], y) => {
      for (let x = x0; x <= x1; x++) {
        // Zone logic: highlight top-left, shadow bottom-right
        let color = C.dark;
        // Outline
        if (x === x0 || x === x1) { color = C.outline; }
        else if (y < 3) { color = C.outline; }
        // Highlight zone top-left
        else if (y < 12 && x < x0 + (x1 - x0) * 0.45) { color = C.light; }
        else if (y < 20 && x < x0 + (x1 - x0) * 0.35) { color = C.base; }
        // Shadow zone bottom-right
        else if (y > 30 && x > x0 + (x1 - x0) * 0.55) { color = C.darkest; }
        else if (y > 25 && x > x0 + (x1 - x0) * 0.65) { color = C.darkest; }
        else { color = C.mid; }
        dot(x, y, color);
      }
    });

    // Oese (loop at top)
    for (let x = 20; x <= 25; x++) dot(x, 0, C.outline);
    for (let x = 21; x <= 24; x++) dot(x, 1, C.base);

    // Screen border (pixel outline)
    const sx = 7, sy = 5, sw = 32, sh = 24;
    // Outer outline
    for (let x = sx - 1; x <= sx + sw; x++) {
      dot(x, sy - 1, C.outline);
      dot(x, sy + sh, C.outline);
    }
    for (let y = sy - 1; y <= sy + sh; y++) {
      dot(sx - 1, y, C.outline);
      dot(sx + sw, y, C.outline);
    }
    // Inner screen bg
    for (let y = sy; y < sy + sh; y++) {
      for (let x = sx; x < sx + sw; x++) {
        dot(x, y, "#0f1a0f");
      }
    }

    // Decorative dot row (speaker grille)
    const dotY = 37;
    [18, 21, 24, 27].forEach(x => dot(x, dotY, C.base));

    // Button outlines (3 pixel buttons)
    [[13, 41], [22, 41], [31, 41]].forEach(([bx, by]) => {
      // Shadow
      for (let x = bx; x <= bx + 4; x++) dot(x, by + 4, C.darkest);
      for (let y = by; y <= by + 4; y++) dot(bx + 4, y, C.darkest);
      // Base
      for (let y = by; y <= by + 3; y++) {
        for (let x = bx; x <= bx + 3; x++) {
          dot(x, y, C.mid);
        }
      }
      // Highlight
      dot(bx, by, C.light);
      dot(bx + 1, by, C.light);
      dot(bx, by + 1, C.light);
      // Outline
      for (let x = bx - 1; x <= bx + 4; x++) dot(x, by - 1, C.outline);
      for (let x = bx - 1; x <= bx + 4; x++) dot(x, by + 4, C.outline);
      for (let y = by - 1; y <= by + 4; y++) dot(bx - 1, y, C.outline);
      for (let y = by - 1; y <= by + 4; y++) dot(bx + 4, y, C.outline);
    });

  }, []);

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      {/* Pixel canvas shell */}
      <canvas
        ref={canvasRef}
        width={46}
        height={74}
        style={{
          width: "460px",
          height: "740px",
          imageRendering: "pixelated",
          display: "block",
        }}
      />
      {/* Screen content overlay */}
      <div
        style={{
          position: "absolute",
          top: "50px",   // sy/74 * 740 ≈ 50px
          left: "70px",  // sx/46 * 460 ≈ 70px
          width: "320px", // sw/46 * 460 ≈ 320px
          height: "240px", // sh/74 * 740 ≈ 240px
          overflow: "hidden",
          background: "#0f1a0f",
        }}
      >
        {children}
      </div>
    </div>
  );
}

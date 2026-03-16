import { PixelFrame } from '../types';

// Room palette
const B = '#222222'; // outline
const W = '#FFFFFF'; // white
const F = '#D4A574'; // floor wood
const Fd = '#C49464'; // floor wood dark
const Wl = '#E8DDD0'; // wall
const Wd = '#D8CDB0'; // wall shadow
const Br = '#8B6040'; // bed brown
const Bd = '#6B4420'; // bed dark
const R = '#CC5555'; // red blanket
const Rd = '#AA3333'; // red dark
const G = '#5A9A5A'; // green plant
const Gd = '#3A7A3A'; // green dark
const P = '#8B6040'; // pot brown
const Sk = '#87CEEB'; // sky blue (day)
const Gl = '#D4D4D4'; // glass
const N = '#C49464'; // nightstand

// 48x32 Room — Day version
export const bedroomDay: PixelFrame = buildRoom(Sk, '#FFEE88');
export const bedroomEvening: PixelFrame = buildRoom('#FF8844', '#FFaa44');
export const bedroomNight: PixelFrame = buildRoom('#223355', '#334466');

function buildRoom(skyColor: string, skyAccent: string): PixelFrame {
  const _ = null;
  const rows: PixelFrame = [];

  // Rows 0-1: ceiling/wall top
  for (let r = 0; r < 2; r++) {
    const row = new Array(48).fill(Wl);
    rows.push(row);
  }

  // Rows 2-13: wall with window and decorations
  for (let r = 2; r < 14; r++) {
    const row = new Array(48).fill(Wl);

    // Window frame (columns 4-15, rows 2-13)
    if (r === 2) {
      for (let c = 4; c <= 15; c++) row[c] = B;
    } else if (r === 13) {
      for (let c = 4; c <= 15; c++) row[c] = B;
    } else {
      row[4] = B;
      row[15] = B;
      // Sky inside window
      for (let c = 5; c <= 14; c++) {
        if (r < 8) row[c] = skyColor;
        else row[c] = skyAccent;
      }
      // Window cross bars
      if (r === 7) {
        for (let c = 5; c <= 14; c++) row[c] = B;
      }
      row[9] = B; // vertical bar
      row[10] = B;

      // Stars at night
      if (skyColor === '#223355') {
        if (r === 4 && [6, 12].includes(0)) row[6] = W;
        if (r === 5) { row[7] = W; row[13] = W; }
        if (r === 3) { row[11] = W; }
        if (r === 10) { row[6] = W; row[12] = W; }
      }
    }

    // Nightstand (columns 34-39, rows 8-13)
    if (r >= 8 && r <= 13) {
      for (let c = 34; c <= 39; c++) {
        if (r === 8) row[c] = B;
        else if (c === 34 || c === 39) row[c] = B;
        else row[c] = N;
      }
    }

    // Bed (columns 20-33, rows 6-13)
    if (r >= 6 && r <= 13) {
      if (r === 6) {
        // Bed headboard top
        for (let c = 20; c <= 23; c++) row[c] = B;
      } else if (r >= 7 && r <= 9) {
        row[20] = B; row[23] = B;
        row[21] = Br; row[22] = Br;
      } else if (r === 10) {
        for (let c = 20; c <= 33; c++) row[c] = B;
      } else if (r >= 11 && r <= 12) {
        row[20] = B; row[33] = B;
        for (let c = 21; c <= 24; c++) row[c] = W; // pillow
        for (let c = 25; c <= 32; c++) row[c] = r === 11 ? R : Rd; // blanket
      } else if (r === 13) {
        for (let c = 20; c <= 33; c++) row[c] = B;
      }
    }

    // Plant pot (columns 42-46, rows 9-13)
    if (r >= 5 && r <= 13) {
      if (r >= 5 && r <= 8) {
        // Leaves
        const leafCols = r === 5 ? [43,44] : r === 6 ? [42,43,44,45] : r === 7 ? [41,42,43,44,45,46] : [42,43,44,45];
        for (const c of leafCols) {
          if (c >= 0 && c < 48) row[c] = (c % 2 === 0) ? G : Gd;
        }
      }
      if (r >= 9 && r <= 11) {
        // Stem
        row[43] = G; row[44] = G;
      }
      if (r >= 11 && r <= 13) {
        // Pot
        const potStart = r === 11 ? 41 : r === 12 ? 42 : 42;
        const potEnd = r === 11 ? 46 : r === 12 ? 45 : 45;
        for (let c = potStart; c <= potEnd; c++) {
          if (c >= 0 && c < 48) row[c] = (c === potStart || c === potEnd) ? B : P;
        }
      }
    }

    rows.push(row);
  }

  // Rows 14-15: baseboard
  for (let r = 14; r < 16; r++) {
    const row = new Array(48).fill(Wd);
    rows.push(row);
  }

  // Rows 16-31: floor
  for (let r = 16; r < 32; r++) {
    const row: (string | null)[] = [];
    for (let c = 0; c < 48; c++) {
      row.push(((c + r) % 4 < 2) ? F : Fd);
    }
    rows.push(row);
  }

  return rows;
}

// Thought bubble icons (6x6)
export const foodIcon: PixelFrame = [
  [null,null,'#222','#222',null,null],
  [null,'#222','#FFF','#FFF','#222',null],
  ['#222','#FFF','#FFF','#222','#FFF','#222'],
  ['#222','#FFF','#222','#222','#FFF','#222'],
  [null,'#222','#FFF','#FFF','#222',null],
  [null,null,'#222','#222',null,null],
];

export const waterIcon: PixelFrame = [
  [null,null,'#4488CC',null,null,null],
  [null,'#4488CC','#4488CC','#4488CC',null,null],
  ['#4488CC','#4488CC','#88BBEE','#4488CC','#4488CC',null],
  ['#4488CC','#88BBEE','#88BBEE','#4488CC','#4488CC',null],
  [null,'#4488CC','#4488CC','#4488CC',null,null],
  [null,null,'#4488CC',null,null,null],
];

export const heartIcon: PixelFrame = [
  [null,'#CC5555',null,'#CC5555',null,null],
  ['#CC5555','#FF8888','#CC5555','#FF8888','#CC5555',null],
  ['#CC5555','#FF8888','#FF8888','#FF8888','#CC5555',null],
  [null,'#CC5555','#FF8888','#CC5555',null,null],
  [null,null,'#CC5555',null,null,null],
  [null,null,null,null,null,null],
];

export const sleepIcon: PixelFrame = [
  [null,null,null,null,null,null],
  ['#888','#888','#888',null,null,null],
  [null,null,'#888',null,null,null],
  [null,'#888',null,null,null,null],
  ['#888','#888','#888',null,null,null],
  [null,null,null,null,null,null],
];

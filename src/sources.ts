import { v, createSource, A_BIT, A_LOT, Weight, Intensity, Soul, Gravity } from './create-source';
export const videos = v;

import * as minecraft from './minecraft';
import * as enya from './enya';
import * as blizzard from './blizzard';
import * as subnautica from './subnautica';
import * as vgm from './video-game';
import * as electronic from './electronic';
import * as rock from './rock';
import * as other from './other';
export const sourceByGenre = {
    minecraft, enya, blizzard, subnautica, vgm, electronic, rock, other,
};
export const sources = {
    ...minecraft,
    ...enya,
    ...blizzard,
    ...subnautica,
    ...vgm,
    ...electronic,
    ...rock,
    ...other,
};

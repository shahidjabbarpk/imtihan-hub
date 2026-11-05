import { EXPL_1 } from './expl-1';
import { EXPL_2 } from './expl-2';
import { EXPL_3 } from './expl-3';
import { EXPL_4 } from './expl-4';

/** Explanations for MCQs whose tuple has none, keyed by MCQ id ("bio.cell.1"). */
export const EXPL: Record<string, string> = { ...EXPL_1, ...EXPL_2, ...EXPL_3, ...EXPL_4 };

import { Nos } from '../@types';
import { Keyed } from './general';
export interface PastEventFilterOptions {
    filter?: Keyed;
    fromBlock?: Nos;
    toBlock?: Nos;
    topics?: Nos[];
}

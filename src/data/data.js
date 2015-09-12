import coinbase from './feed/coinbase';
import financial from './random/financial';
import walk from './random/walk';

export default {
	feed: {
		coinbase: coinbase
	},
	random: {
		financial: financial,
		walk: walk
	}
};
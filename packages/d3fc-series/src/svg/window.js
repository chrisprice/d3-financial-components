import { rebindAll } from '@d3fc/d3fc-rebind';
import windowBase from '../windowBase';
import multi from './multi';

export default () => {
    const base = windowBase(multi());
    let context = null;

    const window = (data) => {
        const filteredData = base(data);

        const series = base.series();

        series.context(context);

        series(filteredData);
    };

    rebindAll(window, base);

    window.context = (...args) => {
        if (!args.length) {
            return context;
        }
        context = args[0];
        return window;
    };

    return window;
};

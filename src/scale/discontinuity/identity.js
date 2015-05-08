import * as fn from '../../utilities/fn';

export default function() {

    var identity = {};

    identity.distance = function(startDate, endDate) {
        return endDate.getTime() - startDate.getTime();
    };

    identity.offset = function(startDate, ms) {
        return new Date(startDate.getTime() + ms);
    };

    identity.clampUp = fn.identity;

    identity.clampDown = fn.identity;

    identity.copy = function() { return identity; };

    return identity;
}

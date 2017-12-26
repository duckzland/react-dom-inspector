import { merge, get, isArray, isObject } from 'lodash';

/**
 * Class for managing apps wide configuration
 *
 * @author jason.xie@victheme.com
 */
export default class Config {

    static storage = {};

    constructor(config = {}) {
       this.insert(config);
    };

    insert(config) {
        merge(Config.storage, config);
    }

    get(key, defaultValue) {
        let storedValue = get(Config.storage, key, '###nothing_found###');

        if (isObject(storedValue)) {
            storedValue = Object.assign({}, storedValue);
        }

        if ((isObject(storedValue) && isObject(defaultValue))
            || (isArray(storedValue) && isArray(defaultValue))) {
            storedValue = merge(defaultValue, storedValue);
        }

        if (storedValue === '###nothing_found###' && defaultValue ) {
            storedValue = defaultValue;
        }

        return storedValue;
    }

}
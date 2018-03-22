/**
 * Class for parsing CSS styles into object
 *
 * @author jason.xie@victheme.com
 */
export default class Parser {

    constructor(style) {
        return style ? this.parseCSS(style) : '';
    }

    parseCSS = (source) => {

        const arr = (new RegExp('((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})', 'gi')).exec(source);
        const selector = arr && arr[2] ? arr[2] : arr && arr[5] ? arr[5] : false;
        const rules = arr && arr[6] ? arr[6] : false;

        return selector && rules ? [{
            selector: selector.split('\r\n').join('\n').trim().replace(/\n+/, "\n"),
            rules: this.parseRules(rules)
        }] : [];
    };

    parseRules = (styles) => {

        const rules = styles.split('\r\n').join('\n').split(';');
        let ret = [];

        for (let i = 0; i < rules.length; i++) {

            let line = rules[i].trim();

            if (line.indexOf(':') !== -1) {
                line = line.split(':');
                let cssDirective = line[0] ? line[0].trim() : '';
                let cssValue = line[1] ? line[1].trim() : '';

                cssDirective !== ''
                    && cssValue !== ''
                    && ret.push({
                        directive: cssDirective,
                        value: cssValue
                    });

            }

            else if (line.substr(0, 7) === 'base64,') {
                ret[ret.length - 1].value += line;
            }

            else if (line.length > 0) {
                ret.push({
                    directive: '',
                    value: line,
                    defective: true
                });
            }
        }

        return ret;
    }
}
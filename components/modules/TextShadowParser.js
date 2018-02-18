/**
 * Class for parsing CSS Text Shadow Rule
 *
 * @author jason.xie@victheme.com
 */
export default class TextShadowParser {

    tokens = {
        color: /^(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/i
    };
    
    constructor(rule) {
        return this.parseGradient(rule);
    }

    parseGradient = (rules) => {
        const { tokens } = this;
        const color = rules.trim().match(tokens['color']);

        let values = {
            hshadow: '',
            vshadow: '',
            blur: '',
            color: color[1] ? color[1] : ''
        };

        rules
            .replace(values['color'], '')
            .trim()
            .split(' ')
            .map((text, index) => {
                const rule = text.trim();
                if (rule.length > 0) {
                    switch (index) {
                        case 0 :
                            values['hshadow'] = rule;
                            break;
                        case 1 :
                            values['vshadow'] = rule;
                            break;
                        case 2 :
                            values['blur'] = rule;
                            break;
                    }
                }
            });

        return values;
    };

}
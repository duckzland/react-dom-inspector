/**
 * Class for parsing CSS Gradient rule
 *
 * @author jason.xie@victheme.com
 */
export default class GradientParser {

    tokens = {
        shape: /(closest\-side|closest\-corner|farthest\-side|farthest\-corner|contain|cover|circle|ellipse)/i,
        mode: /(linear|radial)/i,
        repeat: /(repeating)/i,
        position: /at (.*?),/i,
        angle: /\((.*)deg/i,
        size: /\((.*),/i,
        sizeWithPosition: /\((.*) at/i,
        color: /^(#[0-9a-f]{6}|#[0-9a-f]{3}|#(?:[0-9a-f]{2}){2,4}|(rgb|hsl)a?\((-?\d+%?[,\s]+){2,3}\s*[\d\.]+%?\))/i,
        stops: /, (?![^(]*\))(?![^"']*["'](?:[^"']*["'][^"']*["'])*[^"']*$)/i
    };

    constructor(rule) {
        return this.parseGradient(rule);
    }

    parseGradient = (rule) => {
        const { tokens } = this;
        const angle = rule.match(tokens['angle']);
        const shape = rule.match(tokens['shape']);
        const position = rule.match(tokens['position']);
        const size = rule.match(tokens['size']);
        const sizeWithPosition = rule.match(tokens['sizeWithPosition']);
        const stops = rule.substring(rule.indexOf('(') + 1, rule.lastIndexOf(')')).split(tokens['stops']);
        const mode = rule.match(tokens['mode']);
        const repeat = rule.match(tokens['repeat']);
      
        const results = {
            mode: mode && mode[1] ? mode[1] : '',
            repeat: repeat && repeat[1] ? 'repeat' : 'none',
            rotate: angle && angle[1] ? parseInt(angle[1]) : 0,
            shape: shape && shape[1] ? shape[1] : 'custom-size',
            position: position && position[1] ? position[1] : '',
            size: position && position[1]
                ? (sizeWithPosition && sizeWithPosition[1] ? sizeWithPosition[1] : '')
                : (size && size[1] ? size[1] : ''),
            stops: []
        };
        
        stops && forEach(stops, (stop) => {
            let color = stop.trim().match(tokens['color']);
            color && color[1] && results.stops.push({
                color: color[1],
                position: parseInt(stop.replace(color[1], '').replace('%', '').trim())
            });
        });

        return results;
    }

}
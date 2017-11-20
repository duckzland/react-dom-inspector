

class Parser {

    constructor(style) {
        return this.parseCSS(style);
    }

    parseCSS = (source) => {
        this.styles = [];
        this.combinedCSSRegex = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'; //to match css & media queries together
        var arr;
        var unified = new RegExp(this.combinedCSSRegex, 'gi');

        let { styles } = this;
        arr = unified.exec(source);
        if (arr === null) {
            return;
        }
        var selector = '';
        if (typeof arr[2] === 'undefined') {
            selector = arr[5].split('\r\n').join('\n').trim();
        } else {
            selector = arr[2].split('\r\n').join('\n').trim();
        }

        selector = selector.replace(/\n+/, "\n");

        //we have standard css
        var rules = this.parseRules(arr[6]);
        var style = {
            selector: selector,
            rules: rules
        };
        if (selector === '@font-face') {
            style.type = 'font-face';
        }

        styles.push(style);

        return styles;
    };

    parseRules = (rules) => {
        //convert all windows style line endings to unix style line endings
        rules = rules.split('\r\n').join('\n');
        var ret = [];

        rules = rules.split(';');

        //proccess rules line by line
        for (var i = 0; i < rules.length; i++) {
            var line = rules[i];

            //determine if line is a valid css directive, ie color:white;
            line = line.trim();
            if (line.indexOf(':') !== -1) {
                //line contains :
                line = line.split(':');
                var cssDirective = line[0].trim();
                var cssValue = line.slice(1).join(':').trim();

                //more checks
                if (cssDirective.length < 1 || cssValue.length < 1) {
                    continue; //there is no css directive or value that is of length 1 or 0
                    // PLAIN WRONG WHAT ABOUT margin:0; ?
                }

                //push rule
                ret.push({
                    directive: cssDirective,
                    value: cssValue
                });
            } else {
                //if there is no ':', but what if it was mis splitted value which starts with base64
                if (line.trim().substr(0, 7) === 'base64,') { //hack :)
                    ret[ret.length - 1].value += line.trim();
                } else {
                    //add rule, even if it is defective
                    if (line.length > 0) {
                        ret.push({
                            directive: '',
                            value: line,
                            defective: true
                        });
                    }
                }
            }
        }

        return ret; //we are done!
    }
}

export default Parser;
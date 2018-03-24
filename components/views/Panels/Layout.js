import BasePanel from '../Panel';

/**
 * Class for generating the positioning panel inside the editor markup
 * This class is extending the BasePanel class
 *
 * @author jason.xie@victheme.com
 */
export default class Layout extends BasePanel {
    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config.insert({
            type: 'layout',
            empty: null
        });

        const { polyglot } = props.mainRoot;

        this.fields = [
            {
                key: 'layout',
                title: polyglot.t('Layout'),
                type: 'group',
                elements: [
                    { title: polyglot.t('Display'), target: 'display', type: 'element', field: 'select', options: {
                        block: polyglot.t('Block'),
                        flex: polyglot.t('Flex'),
                        inline: polyglot.t('Inline'),
                        'inline-block': polyglot.t('Inline Block'),
                        'inline-flex': polyglot.t('Inline Flex'),
                        'inline-table': polyglot.t('Inline Table'),
                        'list-item': polyglot.t('List Item'),
                        none: polyglot.t('None'),
                        table: polyglot.t('Table'),
                        'table-caption': polyglot.t('Table Caption'),
                        'table-cell': polyglot.t('Table Cell'),
                        'table-column': polyglot.t('Table Column'),
                        'table-column-group': polyglot.t('Table Column Group'),
                        'table-footer-group': polyglot.t('Table Footer Group'),
                        'table-header-group': polyglot.t('Table Header Group'),
                        'table-row': polyglot.t('Table Row'),
                        'table-row-group': polyglot.t('Table Row Group')
                    }, default: '', inline: false},
                    { title: polyglot.t('Position'), target: 'position', type: 'element', field: 'select', options: {
                        static: polyglot.t('Static'),
                        absolute: polyglot.t('Absolute'),
                        fixed: polyglot.t('Fixed'),
                        relative: polyglot.t('Relative'),
                        sticky: polyglot.t('Sticky')
                    }, default: '', inline: false},
                    { title: polyglot.t('Float'), target: 'float', type: 'element', field: 'select', options: {
                        left: polyglot.t('Left'),
                        right: polyglot.t('Right'),
                        none: polyglot.t('None')
                    }, default: '', inline: false},
                    { title: polyglot.t('Overflow'), target: 'overflow', type: 'element', field: 'select', options: {
                        visible: polyglot.t('Visible'),
                        hidden: polyglot.t('Hidden'),
                        auto: polyglot.t('Auto')
                    }, default: '', inline: false},
                    { title: polyglot.t('Box Sizing'), target: 'box-sizing', type: 'element', field: 'select', options: {
                        'content-box': polyglot.t('Content Box'),
                        'border-box': polyglot.t('Border Box')
                    }, default: '', inline: false}

                ]
            },
            {
                key: 'position',
                title: polyglot.t('Position'),
                type: 'group',
                elements: [
                    {title: polyglot.t('Top'), target: 'top', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Left'), target: 'left', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Right'), target: 'right', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Bottom'), target: 'top', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Z-Index'), target: 'z-index', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'flex',
                title: polyglot.t('Flex'),
                type: 'group',
                elements: [
                    {title: polyglot.t('Basis'), target: 'flex-basis', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Grow'), target: 'flex-grow', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Shrink'), target: 'flex-shrink', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Order'), target: 'order', type: 'element', field: 'text', default: '', inline: false},
                    {title: polyglot.t('Direction'), target: 'flex-direction', type: 'element', field: 'select', options: {
                        row: polyglot.t('Row'),
                        'row-reverse': polyglot.t('Row Reverse'),
                        column: polyglot.t('Column'),
                        'column-reverse': polyglot.t('Column Reverse'),
                    }, default: '', inline: false},
                    {title: polyglot.t('Wrap'), target: 'flex-wrap', type: 'element', field: 'select', options: {
                        nowrap: polyglot.t('No Wrap'),
                        wrap: polyglot.t('Wrap'),
                        'wrap-reverse': polyglot.t('Wrap Reverse')
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'flex-alignment',
                title: polyglot.t('Flex Alignment'),
                type: 'group',
                elements: [
                    {title: polyglot.t('Content'), target: 'align-content', type: 'element', field: 'select', options: {
                        stretch: polyglot.t('Stretch'),
                        center: polyglot.t('Center'),
                        'flex-start': polyglot.t('Flex Start'),
                        'flex-end': polyglot.t('Flex End'),
                        'space-between': polyglot.t('Space Between'),
                        'space-around': polyglot.t('Space Around')
                    }, default: '', inline: false},
                    {title: polyglot.t('Items'), target: 'align-items', type: 'element', field: 'select', options: {
                        stretch: polyglot.t('Stretch'),
                        center: polyglot.t('Center'),
                        'flex-start': polyglot.t('Flex Start'),
                        'flex-end': polyglot.t('Flex End'),
                        'baseline': polyglot.t('Baseline')
                    }, default: '', inline: false},
                    {title: polyglot.t('Self'), target: 'align-self', type: 'element', field: 'select', options: {
                        auto: polyglot.t('Auto'),
                        stretch: polyglot.t('Stretch'),
                        center: polyglot.t('Center'),
                        'flex-start': polyglot.t('Flex Start'),
                        'flex-end': polyglot.t('Flex End'),
                        'baseline': polyglot.t('Baseline')
                    }, default: '', inline: false},
                    {title: polyglot.t('Justify Content'), target: 'justify-content', type: 'element', field: 'select', options: {
                        'flex-start': polyglot.t('Flex Start'),
                        'flex-end': polyglot.t('Flex End'),
                        center: polyglot.t('Center'),
                        'space-between': polyglot.t('Space Between'),
                        'space-around': polyglot.t('Space Around')
                    }, default: '', inline: false}
                ]
            }
        ];

        this.initialize(props);
    }
}
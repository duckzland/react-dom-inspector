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

        this.fields = [
            {
                key: 'layout',
                title: 'Layout',
                type: 'group',
                elements: [
                    { title: 'Display', target: 'display', type: 'element', field: 'select', options: {
                        block: 'Block',
                        flex: 'Flex',
                        inline: 'Inline',
                        'inline-block': 'Inline Block',
                        'inline-flex': 'Inline Flex',
                        'inline-table': 'Inline Table',
                        'list-item': 'List Item',
                        none: 'None',
                        table: 'Table',
                        'table-caption': 'Table Caption',
                        'table-cell': 'Table Cell',
                        'table-column': 'Table Column',
                        'table-column-group': 'Table Column Group',
                        'table-footer-group': 'Table Footer Group',
                        'table-header-group': 'Table Header Group',
                        'table-row': 'Table Row',
                        'table-row-group': 'Table Row Group'
                    }, default: '', inline: false},
                    { title: 'Position', target: 'position', type: 'element', field: 'select', options: {
                        static: 'Static',
                        absolute: 'Absolute',
                        fixed: 'Fixed',
                        relative: 'Relative',
                        sticky: 'Sticky'
                    }, default: '', inline: false},
                    { title: 'Float', target: 'float', type: 'element', field: 'select', options: {
                        left: 'Left',
                        right: 'Right',
                        none: 'None'
                    }, default: '', inline: false},
                    { title: 'Overflow', target: 'overflow', type: 'element', field: 'select', options: {
                        visible: 'Visible',
                        hidden: 'Hidden',
                        auto: 'Auto'
                    }, default: '', inline: false},
                    { title: 'Box Sizing', target: 'box-sizing', type: 'element', field: 'select', options: {
                        'content-box': 'Content Box',
                        'border-box': 'Border Box'
                    }, default: '', inline: false}

                ]
            },
            {
                key: 'position',
                title: 'Position',
                type: 'group',
                elements: [
                    {title: 'Top', target: 'top', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Left', target: 'left', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Right', target: 'right', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Bottom', target: 'top', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Z-Index', target: 'z-index', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'flex',
                title: 'Flex',
                type: 'group',
                elements: [
                    {title: 'Basis', target: 'flex-basis', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Grow', target: 'flex-grow', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Shrink', target: 'flex-shrink', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Order', target: 'order', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'Direction', target: 'flex-direction', type: 'element', field: 'select', options: {
                        row: 'Row',
                        'row-reverse': 'Row Reverse',
                        column: 'Column',
                        'column-reverse': 'Column Reverse',
                    }, default: '', inline: false},
                    {title: 'Wrap', target: 'flex-wrap', type: 'element', field: 'select', options: {
                        nowrap: 'No Wrap',
                        wrap: 'Wrap',
                        'wrap-reverse': 'Wrap Reverse'
                    }, default: '', inline: false}
                ]
            },
            {
                key: 'flex-alignment',
                title: 'Flex Alignment',
                type: 'group',
                elements: [
                    {title: 'Content', target: 'align-content', type: 'element', field: 'select', options: {
                        stretch: 'Stretch',
                        center: 'Center',
                        'flex-start': 'Flex Start',
                        'flex-end': 'Flex End',
                        'space-between': 'Space Between',
                        'space-around': 'Space Around'
                    }, default: '', inline: false},
                    {title: 'Items', target: 'align-items', type: 'element', field: 'select', options: {
                        stretch: 'Stretch',
                        center: 'Center',
                        'flex-start': 'Flex Start',
                        'flex-end': 'Flex End',
                        'baseline': 'Baseline'
                    }, default: '', inline: false},
                    {title: 'Self', target: 'align-self', type: 'element', field: 'select', options: {
                        auto: 'Auto',
                        stretch: 'Stretch',
                        center: 'Center',
                        'flex-start': 'Flex Start',
                        'flex-end': 'Flex End',
                        'baseline': 'Baseline'
                    }, default: '', inline: false},
                    {title: 'Justify Content', target: 'justify-content', type: 'element', field: 'select', options: {
                        'flex-start': 'Flex Start',
                        'flex-end': 'Flex End',
                        center: 'Center',
                        'space-between': 'Space Between',
                        'space-around': 'Space Around'
                    }, default: '', inline: false}
                ]
            }
        ];

        this.initialize(props);
    }
}
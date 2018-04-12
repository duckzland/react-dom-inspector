import BasePanel from '../Panel';
import { get, forEach, isEmpty } from 'lodash';

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
            node: 'node' in props ? props.node : false,
            errors: {},
            values: {}
        };

        props.config.insert({
            type: 'layout',
            empty: null
        });

        this.buildFields();
        this.initialize(props);
    }

    checkRules = (cssRule, values, parent = false, allowEmpty = false) => {
        const value = get(this, (parent ? 'state.node.parent.styles' : 'state.node.styles') + '.' + cssRule, false);
        return !allowEmpty
            ? !isEmpty(value) && (values.indexOf(value) !== -1)
            : (isEmpty(value) || (values.indexOf(value) !== -1));
    };

    buildFields = () => {
        this.fields = [];
        this.generateLayoutFields();
        this.generatePositionFields();
        this.generateFlexFields();
        this.generateFlexAlignmentFields();
    };

    generateLayoutFields = () => {
        const { props, checkRules, fields } = this;
        const { polyglot } = props.mainRoot;
        const field = {
            key: 'layout',
            title: polyglot.t('Layout'),
            type: 'group',
            elements: []
        };

        field.elements.push({
            title: polyglot.t('Display'),
            target: 'display',
            type: 'element',
            field: 'select',
            default: '',
            inline: false,
            options: {
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
            }
        });

        field.elements.push({
            title: polyglot.t('Position'),
            target: 'position',
            type: 'element',
            field: 'select',
            default: '',
            inline: false,
            options: {
                static: polyglot.t('Static'),
                absolute: polyglot.t('Absolute'),
                fixed: polyglot.t('Fixed'),
                relative: polyglot.t('Relative'),
                sticky: polyglot.t('Sticky')
            }
        });

        // Only allow float for static and relative elements
        if (checkRules('position', ['static', 'relative'], false, true)) {
            if (!checkRules('display', ['flex'])) {
                if (!checkRules('display', ['flex'], true)) {
                    field.elements.push({
                        title: polyglot.t('Float'),
                        target: 'float',
                        type: 'element',
                        field: 'select',
                        default: '',
                        inline: false,
                        options: {
                            left: polyglot.t('Left'),
                            right: polyglot.t('Right'),
                            none: polyglot.t('None')
                        }
                    });
                }
            }
        }

        field.elements.push({
            title: polyglot.t('Overflow'),
            target: 'overflow',
            type: 'element',
            field: 'select',
            default: '',
            inline: false,
            options: {
                visible: polyglot.t('Visible'),
                hidden: polyglot.t('Hidden'),
                auto: polyglot.t('Auto')
            }
        });

        fields.push(field);
    };

    generatePositionFields = () => {
        const { props, checkRules, fields } = this;
        const { polyglot } = props.mainRoot;
        const field = {
            key: 'position',
            title: polyglot.t('Position'),
            type: 'group',
            elements: []
        };
        
        // Only allow positioning for relative, absolute, fixed and sticky position
        if (checkRules('position', ['relative', 'absolute', 'fixed', 'sticky'])) {
            field.elements.push({
                title: polyglot.t('Top'),
                target: 'top',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });

            field.elements.push({
                title: polyglot.t('Left'),
                target: 'left',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });
            
            field.elements.push({
                title: polyglot.t('Right'),
                target: 'right',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });
            
            field.elements.push({
                title: polyglot.t('Bottom'),
                target: 'bottom',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });
        }

        field.elements.push(                    {
            title: polyglot.t('Z-Index'),
            target: 'z-index',
            type: 'element',
            field: 'text',
            default: '',
            inline: false
        });
        
        fields.push(field);
    };

    generateFlexFields = () => {
        const { props, checkRules, fields } = this;

        if (!checkRules('display', ['flex'])
            && !checkRules('display', ['flex'], true)) {
            return;
        }

        const { polyglot } = props.mainRoot;
        const field = {
            key: 'flex',
            title: polyglot.t('Flex'),
            type: 'group',
            elements: []
        };

        if (checkRules('display', ['flex'])) {
            field.elements.push({
                title: polyglot.t('Direction'),
                target: 'flex-direction',
                type: 'element',
                field: 'select',
                default: '',
                inline: false,
                options: {
                    row: polyglot.t('Row'),
                    'row-reverse': polyglot.t('Row Reverse'),
                    column: polyglot.t('Column'),
                    'column-reverse': polyglot.t('Column Reverse')
                }
            });

            field.elements.push({
                title: polyglot.t('Wrap'),
                target: 'flex-wrap',
                type: 'element',
                field: 'select',
                default: '',
                inline: false,
                options: {
                    nowrap: polyglot.t('No Wrap'),
                    wrap: polyglot.t('Wrap'),
                    'wrap-reverse': polyglot.t('Wrap Reverse')
                }
            });
        }

        if (checkRules('display', ['flex'], true)) {
            field.elements.push({
                title: polyglot.t('Basis'),
                target: 'flex-basis',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });

            field.elements.push({
                title: polyglot.t('Grow'),
                target: 'flex-grow',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });

            field.elements.push({
                title: polyglot.t('Shrink'),
                target: 'flex-shrink',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });

            field.elements.push({
                title: polyglot.t('Order'),
                target: 'order',
                type: 'element',
                field: 'text',
                default: '',
                inline: false
            });
        }

        fields.push(field);
    };

    generateFlexAlignmentFields = () => {
        const { props, checkRules, fields } = this;

        if (!checkRules('display', ['flex'])
            && !checkRules('display', ['flex'], true)) {
            return;
        }

        const { polyglot } = props.mainRoot;
        const field = {
            key: 'flex-alignment',
            title: polyglot.t('Flex Alignment'),
            type: 'group',
            elements: []
        };

        if (checkRules('display', ['flex'])) {
            field.elements.push({
                title: polyglot.t('Content'),
                target: 'align-content',
                type: 'element',
                field: 'select',
                options: {
                    stretch: polyglot.t('Stretch'),
                    center: polyglot.t('Center'),
                    'flex-start': polyglot.t('Flex Start'),
                    'flex-end': polyglot.t('Flex End'),
                    'space-between': polyglot.t('Space Between'),
                    'space-around': polyglot.t('Space Around')
                },
                default: '',
                inline: false
            });

            field.elements.push({
                title: polyglot.t('Items'),
                target: 'align-items',
                type: 'element',
                field: 'select',
                default: '',
                inline: false,
                options: {
                    stretch: polyglot.t('Stretch'),
                    center: polyglot.t('Center'),
                    'flex-start': polyglot.t('Flex Start'),
                    'flex-end': polyglot.t('Flex End'),
                    'baseline': polyglot.t('Baseline')
                }
            });

            field.elements.push({
                title: polyglot.t('Justify Content'),
                target: 'justify-content',
                type: 'element',
                field: 'select',
                options: {
                    'flex-start': polyglot.t('Flex Start'),
                    'flex-end': polyglot.t('Flex End'),
                    center: polyglot.t('Center'),
                    'space-between': polyglot.t('Space Between'),
                    'space-around': polyglot.t('Space Around')
                },
                default: '',
                inline: false
            });
        }

        if (checkRules('display', ['flex'], true)) {
            field.elements.push({
                title: polyglot.t('Align Self'),
                target: 'align-self',
                type: 'element',
                field: 'select',
                options: {
                    auto: polyglot.t('Auto'),
                    stretch: polyglot.t('Stretch'),
                    center: polyglot.t('Center'),
                    'flex-start': polyglot.t('Flex Start'),
                    'flex-end': polyglot.t('Flex End'),
                    'baseline': polyglot.t('Baseline')
                },
                default: '',
                inline: false
            });

        }

        fields.push(field);
    };

    onSubmit = (e) => {
        this.submit(e);
        this.buildFields();
    };
}
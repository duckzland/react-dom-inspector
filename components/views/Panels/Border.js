import BasePanel from '../Panel';

class Border extends BasePanel {

    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {}
        };

        this.config = {
            type: 'border',
            empty: null
        };
        this.fields = [
            {
                key: 'border-top',
                title: 'Border Top',
                type: 'group',
                elements: [
                    {title: 'color', target: 'border-top-color', type: 'element', field: 'color', default: '', inline: false },
                    {title: 'width', target: 'border-top-width', type: 'element', field: 'text', default: '', inline: false },
                    {title: 'style', target: 'border-top-style', type: 'element', field: 'select', options: {
                        none: 'None',
                        hidden: 'Hidden',
                        dotted: 'Dotted',
                        dashed: 'Dashed',
                        solid: 'Solid',
                        double: 'Double',
                        groove: 'Groove',
                        ridge: 'Ridge',
                        inset: 'Inset',
                        outset: 'Outset'
                    }, default: '', inline: false },
                ]
            },
            {
                key: 'border-left',
                title: 'Border Left',
                type: 'group',
                elements: [
                    {title: 'color', target: 'border-left-color', type: 'element', field: 'color', default: '', inline: false },
                    {title: 'width', target: 'border-left-width', type: 'element', field: 'text', default: '', inline: false },
                    {title: 'style', target: 'border-left-style', type: 'element', field: 'select', options: {
                        none: 'None',
                        hidden: 'Hidden',
                        dotted: 'Dotted',
                        dashed: 'Dashed',
                        solid: 'Solid',
                        double: 'Double',
                        groove: 'Groove',
                        ridge: 'Ridge',
                        inset: 'Inset',
                        outset: 'Outset'
                    }, default: '', inline: false },
                ]
            },
            {
                key: 'border-right',
                title: 'Border Right',
                type: 'group',
                elements: [
                    {title: 'color', target: 'border-right-color', type: 'element', field: 'color', default: '', inline: false },
                    {title: 'width', target: 'border-right-width', type: 'element', field: 'text', default: '', inline: false },
                    {title: 'style', target: 'border-right-style', type: 'element', field: 'select', options: {
                        none: 'None',
                        hidden: 'Hidden',
                        dotted: 'Dotted',
                        dashed: 'Dashed',
                        solid: 'Solid',
                        double: 'Double',
                        groove: 'Groove',
                        ridge: 'Ridge',
                        inset: 'Inset',
                        outset: 'Outset'
                    }, default: '', inline: false },
                ]
            },
            {
                key: 'border-bottom',
                title: 'Border Bottom',
                type: 'group',
                elements: [
                    {title: 'color', target: 'border-bottom-color', type: 'element', field: 'color', default: '', inline: false },
                    {title: 'width', target: 'border-bottom-width', type: 'element', field: 'text', default: '', inline: false },
                    {title: 'style', target: 'border-bottom-style', type: 'element', field: 'select', options: {
                        none: 'None',
                        hidden: 'Hidden',
                        dotted: 'Dotted',
                        dashed: 'Dashed',
                        solid: 'Solid',
                        double: 'Double',
                        groove: 'Groove',
                        ridge: 'Ridge',
                        inset: 'Inset',
                        outset: 'Outset'
                    }, default: '', inline: false },
                ]
            },
            {
                key: 'radius',
                title: 'Border Radius',
                type: 'group',
                elements: [
                    {title: 'top left', target: 'border-top-left-radius', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'top right', target: 'border-top-right-radius', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'bottom left', target: 'border-bottom-left-radius', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'bottom right', target: 'border-bottom-right-radius', type: 'element', field: 'text', default: '', inline: false}
                ]
            },
            {
                key: 'outline',
                title: 'Outline',
                type: 'group',
                elements: [
                    {title: 'color', target: 'outline-color', type: 'element', field: 'color', default: '', inline: false},
                    {title: 'width', target: 'outline-width', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'offset', target: 'outline-offset', type: 'element', field: 'text', default: '', inline: false},
                    {title: 'style', target: 'outline-style', type: 'element', field: 'select', options: {
                        none: 'None',
                        hidden: 'Hidden',
                        dotted: 'Dotted',
                        dashed: 'Dashed',
                        solid: 'Solid',
                        double: 'Double',
                        groove: 'Groove',
                        ridge: 'Ridge',
                        inset: 'Inset',
                        outset: 'Outset'
                    }, default: '', inline: false}
                ]
            },
        ];
        this.initialize(props);
    }
}


export default Border;
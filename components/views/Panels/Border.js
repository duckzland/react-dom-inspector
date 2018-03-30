import React from 'react';
import BasePanel from '../Panel';
import { get, forEach } from 'lodash';

/**
 * Class for generating the border panel inside the editor markup
 * This class is extending the BasePanel class
 *
 * @author jason.xie@victheme.com
 */
export default class Border extends BasePanel {

    polyglot = false;

    constructor(props) {
        super(props);
        this.state = {
            node: false,
            errors: {},
            values: {},
            grouped: {
                border: true,
                radius: true
            }
        };

        this.polyglot = props.mainRoot.polyglot;
        const { polyglot } = this;

        props.config.insert({
            type: 'border',
            empty: null,
            borderOptions: {
                none : polyglot.t('None'),
                hidden : polyglot.t('Hidden'),
                dotted : polyglot.t('Dotted'),
                dashed : polyglot.t('Dashed'),
                solid : polyglot.t('Solid'),
                double : polyglot.t('Double'),
                groove : polyglot.t('Groove'),
                ridge : polyglot.t('Ridge'),
                inset : polyglot.t('Inset'),
                outset : polyglot.t('Outset')
            }
        });

        this.fields = [];
        this.state.grouped.border = this.detectBorderGroup(get(props, 'node.styles', {}));
        this.state.grouped.radius = this.detectRadiusGroup(get(props, 'node.styles', {}));

        this.generateBorderFields(this.state.grouped.border);
        this.generateRadiusFields(this.state.grouped.radius);
        this.generateOutlineFields();

        this.initialize(props);
    }

    detectBorderGroup = (Rules) => {
        let Grouped = true;
        forEach(['border-top', 'border-left', 'border-right', 'border-bottom'], (key) => {
            forEach(['width', 'color', 'style'], (subkey) => {
                if (Rules[key + '-' + subkey]) {
                    Grouped = false;
                    return false;
                }
            });

            if (!Grouped) {
                return false;
            }
        });
        return Grouped;
    };

    detectRadiusGroup = (Rules) => {
        let Grouped = true;
        forEach(['border-top-left-radius', 'border-top-right-radius', 'border-bottom-left-radius', 'border-bottom-right-radius'], (key) => {
            if (Rules[key]) {
                Grouped = false;
                return false;
            }
        });
        return Grouped;
    };

    generateBorderFields = (Grouped = false) => {
        const { fields, polyglot, props } = this;
        const { config } = props;

        fields.map((field, delta) => {
            switch (field.key) {
                case 'border-top' :
                case 'border-bottom' :
                case 'border-left' :
                case 'border-right' :
                case 'border' :
                    delete fields[delta];
                    break;
            }
        });

        Grouped
            ? fields.push({
                key: 'border',
                title: polyglot.t('Border'),
                type: 'group',
                toggle: 'off',
                elements: [
                    { title: polyglot.t('color'), target: 'border-color', type: 'element', field: 'color', default: '', inline: false },
                    { title: polyglot.t('width'), target: 'border-width', type: 'element', field: 'text', default: '', inline: false },
                    { title: polyglot.t('style'), target: 'border-style', type: 'element', field: 'select', options: config.get('borderOptions'), default: '', inline: false }
                ]
             })
            : forEach({
                'border-top' : polyglot.t('Border Top'),
                'border-left' : polyglot.t('Border Left'),
                'border-right' : polyglot.t('Border Right'),
                'border-bottom' : polyglot.t('Border Bottom')
            }, (Title, Key) => {
                fields.push({
                    key: Key,
                    title: Title,
                    type: 'group',
                    toggle: 'on',
                    elements: [
                        { title: polyglot.t('color'), target:  Key + '-color', type: 'element', field: 'color', default: '', inline: false },
                        { title: polyglot.t('width'), target: Key + '-width', type: 'element', field: 'text', default: '', inline: false },
                        { title: polyglot.t('style'), target: Key + '-style', type: 'element', field: 'select', options: config.get('borderOptions'), default: '', inline: false }
                    ]
                })
            });
    };

    generateRadiusFields = (Grouped = false) => {
        const { fields, polyglot } = this;
        fields.map((field, delta) => {
            field.key === 'radius'
                ? delete fields[delta]
                : null;
        });

        fields.push({
            key: 'radius',
            title: polyglot.t('Border Radius'),
            type: 'group',
            toggle: Grouped ? 'off' : 'on',
            elements: Grouped
                ? [ { title: polyglot.t('radius'), target: 'border-radius', type: 'element', field: 'text', default: '', inline: false } ]
                : [
                    { title: polyglot.t('top left'), target: 'border-top-left-radius', type: 'element', field: 'text', default: '', inline: false },
                    { title: polyglot.t('top right'), target: 'border-top-right-radius', type: 'element', field: 'text', default: '', inline: false },
                    { title: polyglot.t('bottom left'), target: 'border-bottom-left-radius', type: 'element', field: 'text', default: '', inline: false },
                    { title: polyglot.t('bottom right'), target: 'border-bottom-right-radius', type: 'element', field: 'text', default: '', inline: false }
                ]
        });
    };

    generateOutlineFields = () => {
        const { fields, props, polyglot } = this;
        const { config } = props;

        fields.map((field, delta) => {
            field.key === 'outline'
                ? delete fields[delta]
                : null;
        });

        fields.push(            {
            key: 'outline',
            title: polyglot.t('Outline'),
            type: 'group',
            elements: [
                {title: polyglot.t('color'), target: 'outline-color', type: 'element', field: 'color', default: '', inline: false},
                {title: polyglot.t('width'), target: 'outline-width', type: 'element', field: 'text', default: '', inline: false},
                {title: polyglot.t('offset'), target: 'outline-offset', type: 'element', field: 'text', default: '', inline: false},
                {title: polyglot.t('style'), target: 'outline-style', type: 'element', field: 'select', options: config.get('borderOptions'), default: '', inline: false }
            ]
        });
    };

    convertBorderValues = (Grouped = false) => {
        const { state } = this;
        const { values, node } = state;
        const { removeStyle } = node;

        if (!values) {
            return false;
        }

        if (Grouped) {

            values['border-color'] = '';
            values['border-width'] = '';
            values['border-style'] = '';

            forEach([
                'border-top',
                'border-left',
                'border-right',
                'border-bottom'
            ], (key) => {
                forEach([
                    'width',
                    'color',
                    'style'
                ], (subkey) => {
                    if (!values['border-' + subkey] && values[key + '-' + subkey]) {
                        values['border-' + subkey] = values[key + '-' + subkey];
                    }
                    delete values[key + '-' + subkey];
                    node && removeStyle(key + '-' + subkey);
                });
            });
        }
        else {
            forEach([
                'border-top',
                'border-left',
                'border-right',
                'border-bottom'
            ], (key) => {
                forEach([
                    'width',
                    'color',
                    'style'
                ], (subkey) => {
                    values[key + '-' + subkey] = values['border-' + subkey] ? values['border-' + subkey] : '';
                });
            });

            forEach([
                'border-width',
                'border-color',
                'border-style'
            ], (key) => {
                delete values[key];
                node && removeStyle(key);
            });
        }
    };

    convertRadiusValues = (Grouped = false) => {
        const { state } = this;
        const { values, node } = state;
        const { removeStyle, storeStyle } = node;

        if (!values) {
            return false;
        }

        if (Grouped) {
            const radius = [];
            forEach([
                'border-top-left-radius',
                'border-top-right-radius',
                'border-bottom-right-radius',
                'border-bottom-left-radius'
            ], (key) => {
                values[key] && radius.push(values[key]);
                delete values[key];
                node && removeStyle(key);
            });

            values['border-radius'] = radius.join(' ');
            node && storeStyle('border-radius', radius.join(' '))
        }
        else {
            const value = get(values, 'border-radius', '').split(' ');
            if (value) {
                values['border-top-left-radius'] = value[0] ? value[0] : '';
                values['border-top-right-radius'] = value[1] ? value[1] : value[0] ? value[0] : '';
                values['border-bottom-right-radius'] = value[2] ? value[2] : value[1] ? value[1] : value[0] ? value[0] : '';
                values['border-bottom-left-radius'] = value[3] ? value[3] : value[0] ? value[0] : '';
            }

            delete values['border-radius'];
            node && removeStyle('border-radius');
        }
    };

    refreshElements = () => {
        const { state, onSubmit } = this;
        const { values } = state;

        if (!values) {
            return false;
        }

        forEach(values, (value, name) => {
            onSubmit({
                target: {
                    name: name,
                    value: value
                }
            });
        });
    };

    onToggleLock = (element) => {
        const { state, convertBorderValues, convertRadiusValues, generateBorderFields, generateRadiusFields, generateOutlineFields, refreshElements } = this;
        const { grouped } = state;

        switch(element.key) {
            case 'border-top' :
            case 'border-left' :
            case 'border-right' :
            case 'border-bottom' :
            case 'border' :
                grouped.border = !grouped.border;
                convertBorderValues(grouped.border);
                break;
            case 'radius' :
                grouped.radius = !grouped.radius;
                convertRadiusValues(grouped.radius);
                break;
        }

        generateBorderFields(grouped.border);
        generateRadiusFields(grouped.radius);
        generateOutlineFields();
        refreshElements();
    };
}
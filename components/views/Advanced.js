import React from 'react';
import DOMHelper from '../modules/DOMHelper';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import Configurator from '../modules/Config';
import Parser from '../modules/Parser';
import {UnControlled as CodeMirror} from 'react-codemirror2'
import cssBeautify from 'cssbeautify';
import { forEach } from 'lodash';

require('codemirror/mode/css/css');

/**
 * Class for generating the Advanced Editor element markup
 *
 * @author jason.xie@victheme.com
 */
export default class AdvancedPanel extends React.Component {

    state = {
        root: false,
        errors: {}
    };

    parser = false;
    styleElement = false;
    config = false;

    constructor(props) {
        super(props);

        this.config = 'config' in props ? props.config : new Configurator();

        if ('root' in props) {
            this.state.root = props.root;
        }

        this.styleElement = (new DOMHelper(props.document)).styleSheet({id: props.stylizerID}, 'style');
        this.parser = new Parser(false);
    };

    componentWillReceiveProps(nextProps) {
        if ('refresh' in nextProps && nextProps.refresh) {
            this.styleElement = (new DOMHelper(nextProps.document)).styleSheet({id: nextProps.root.getStyleSourceID()}, 'style');
        }
    };

    convertCSS = (cssText) => {
        const storage = this.props.document.createElement('style');
              storage.innerHTML = cssText;

        this.props.document.body.appendChild(storage);
        const sheet = storage.sheet ? storage.sheet : storage.styleSheet;
        this.props.document.body.removeChild(storage);

        return sheet.cssRules ? sheet.cssRules : false;
    };

    convertData = () => {
        const { styleElement } = this;
        let rules = [];
        forEach(styleElement.cssRules, (rule) => {
            rules.push(rule.cssText);
        });

        return cssBeautify(rules.join("\n"), {
            indent: '  ',
            openbrace: 'end-of-line',
            autosemicolon: true
        });
    };

    onChangeValue = (editor, data, value) => {

        const { styleElement } = this;
        const newRules = this.convertCSS(value);

        for (var i = styleElement.cssRules.length - 1; i >= 0; i--) {
            styleElement.deleteRule(i);
        }

        newRules && forEach(newRules, (rule, i) => {
            styleElement.insertRule(rule.cssText, i);
        });
    };

    render() {

        const { onChangeValue, props, config } = this;
        const { root } = props;;
        const { polyglot } = root;

        const editorProps = config.get('advancedEditor.props.element', {
            key: 'stylizer-editor-panel',
            className: 'stylizer-panels stylizer-editor-panel'
        });

        const headerProps = config.get('advancedEditor.props.header', {
            key: 'stylizer-editor-header',
            className: 'stylizer-header'
        });

        const headerTextProps = config.get('advancedEditor.props.headerText', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('advancedEditor.props.headerAction', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const hamburgerIconProps = config.get('advancedEditor.props.hamburgerIcon', {
            size: 16,
            onClick: () => root.toggleMinimize()
        });

        const hamburgerIconLabel = config.get('advancedEditor.props.headerIconLabel', {
            title: polyglot.t('Minimize Editor')
        });

        const advancedPanelWrapperProps = config.get('advancedEditor.props.panelWrapper', {
            key: 'stylizer-advanced-panel-wrapper',
            className: 'stylizer-advanced-panel-wrapper'
        });

        const advancedPanelCodeMirrorProps = config.get('advancedEditor.props.codeMirror', {
            key: 'stylizer-advanced-panel-codemirror',
            className: 'stylizer-advanced-panel-codemirror',
            value: this.convertData(),
            options: {
                mode: 'css',
                theme: 'stylizer',
                lineNumbers: true
            },
            onChange: (editor, data, value) => onChangeValue(editor, data, value)
        });

        return (
            <div { ...editorProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>
                        { polyglot.t('Advanced Editor') }
                    </span>
                    <span { ...headerActionProps }>
                        <span { ...hamburgerIconLabel }><HamburgerIcon { ...hamburgerIconProps } /></span>
                    </span>
                </h3>

                <div { ...advancedPanelWrapperProps }>
                    <CodeMirror { ...advancedPanelCodeMirrorProps } />
                </div>
            </div>
        )
    };
}
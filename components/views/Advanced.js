import React from 'react';
import DOMHelper from '../modules/DOMHelper';
import HamburgerIcon from '../../node_modules/react-icons/lib/io/navicon-round';
import Configurator from '../modules/Config';
import Parser from '../modules/Parser';
import {UnControlled as CodeMirror} from 'react-codemirror2'
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

        this.config = new Configurator({
            stylizerID: props.stylizerID,
            AdvancedEditorHeaderText: 'Advanced Editor'
        });

        if ('config' in props) {
            this.config.insert(props.config);
        }

        if ('root' in props) {
            this.state.root = props.root;
        }

        this.styleElement = (new DOMHelper(props.document)).styleSheet({id: this.config.get('stylizerID')}, 'style');
        this.parser = new Parser(false);
    };

    componentWillReceiveProps(nextProps) {
        if ('refresh' in nextProps && nextProps.refresh) {
            this.config.stylizerID = nextProps.root.getStyleSourceID();
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

        return rules.join("\n");
    };

    onChangeValue = (editor, data, value) => {

        const { styleElement } = this;
        const newRules = this.convertCSS(value);

        for (var i = 0; i < styleElement.cssRules.length; i++) {
            styleElement.deleteRule(i);
        }

        newRules && forEach(newRules, (rule, i) => {
            styleElement.insertRule(rule.cssText);
        });
    };

    render() {

        const { onChangeValue, props, config } = this;
        const { root } = props;

        const editorProps = config.get('AdvancedEditorEditorProps', {
            key: 'stylizer-editor-panel',
            className: 'stylizer-panels stylizer-editor-panel'
        });

        const headerProps = config.get('AdvancedEditorHeaderProps', {
            key: 'stylizer-editor-header',
            className: 'stylizer-header'
        });

        const headerTextProps = config.get('AdvancedEditorHeaderTextProps', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('AdvancedEditorHeaderActionProps', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const hamburgerIconProps = config.get('AdvancedEditorHamburgerIconProps', {
            size: 16,
            onClick: () => root.toggleMinimize()
        });

        const hamburgerIconLabel = config.get('AdvancedEditorHamburgerIconLabel', {
            title: 'Minimize Editor'
        });

        const advancedPanelWrapperProps = config.get('AdvancedEditorAdvancedPanelWrapperProps', {
            key: 'stylizer-advanced-panel-wrapper',
            className: 'stylizer-advanced-panel-wrapper'
        });

        const advancedPanelCodeMirrorProps = config.get('AdvancedEditorAdvancedPanelCodeMirrorProps', {
            key: 'stylizer-advanced-panel-codemirror',
            className: 'stylizer-advanced-panel-codemirror',
            value: this.convertData(),
            options: {
                mode: 'css',
                theme: 'dracula',
                lineNumbers: true
            },
            onChange: (editor, data, value) => onChangeValue(editor, data, value)
        });

        return (
            <div { ...editorProps }>
                <h3 { ...headerProps }>
                    <span { ...headerTextProps }>
                        { config.get('AdvancedEditorHeaderText') }
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
    }

;
}
import React from 'react';
import { get } from 'lodash';
import HoverIcon from '../../node_modules/react-icons/lib/io/compose';
import DeleteIcon from '../../node_modules/react-icons/lib/io/trash-b';
import RevertIcon from '../../node_modules/react-icons/lib/fa/refresh';
import CloseIcon from '../../node_modules/react-icons/lib/io/close';
import SaveIcon from '../../node_modules/react-icons/lib/fa/floppy-o';
import LayoutIcon from '../../node_modules/react-icons/lib/io/code-working';
import DesktopIcon from '../../node_modules/react-icons/lib/fa/desktop';
import TabletIcon from '../../node_modules/react-icons/lib/fa/tablet';
import MobileIcon from '../../node_modules/react-icons/lib/fa/mobile';
import AdvancedIcon from '../../node_modules/react-icons/lib/fa/terminal';
import Configurator from '../modules/Config';

/**
 * Class for generating the Control Bar element markup
 *
 * @author jason.xie@victheme.com
 */
export default class ControlBar extends React.Component {

    state = {
        root: false,
        errors: {}
    };

    config = false;

    constructor(props) {
        super(props);
        
        this.config = new Configurator({
            LogoText: 'VicTheme Stylizer'
        });

        if ('root' in props) {
            this.state.root = props.root;
        }
    };

    render() {

        const { props, state, config } = this;
        const { root } = props;

        const headerProps = config.get('ControlBarHeaderProps', {
            key: 'stylizer-controlbar',
            className: 'stylizer-controlbar'
        });

        const headerTextProps = config.get('ControlBarHeaderTextProps', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('ControlBarHeaderActionProps', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const headerViewModeProps = config.get('ControlBarHeaderViewModeProps', {
            key: 'stylizer-editor-header-view-mode',
            className: 'stylizer-header-view-mode'
        });

        const layoutIconProps = config.get('ControlBarLayoutIconProps', {
            size: 16,
            transform: root.state.vertical === false ? 'rotate(90)' : '',
            onClick: () => root.toggleLayout()
        });

        const hoverIconProps = config.get('ControlBarHoverIconProps', {
            size: 16,
            color: root.state.hover ? '#13a6d9' : '',
            onClick: () => root.toggleHoverInspector()
        });

        const revertIconProps = config.get('ControlBarRevertIconProps', {
            size: 16,
            onClick: () => root.revertData()
        });

        const deleteIconProps = config.get('ControlBarDeleteIconProps', {
            size: 16,
            onClick: () => root.wipeData()
        });

        const saveIconProps = config.get('ControlBarSaveIconProps', {
            size: 16,
            onClick: () => root.saveData()
        });

        const closeIconProps = config.get('ControlBarCloseIconProps', {
            size: 16,
            onClick: () => root.killApp()
        });

        const desktopIconProps = config.get('ControlBarDesktopIconProps', {
            size: 16,
            transform: root.state.viewmode === 'desktop' ? 'scale(1.2)' : '',
            onClick: () => root.toggleViewMode('desktop')
        });

        const tabletIconProps = config.get('ControlBarTabletIconProps', {
            size: 16,
            transform: root.state.viewmode === 'tablet' ? 'scale(1.2)' : '',
            onClick: () => root.toggleViewMode('tablet')
        });

        const mobileIconProps = config.get('ControlBarMobileIconProps', {
            size: 16,
            transform: root.state.viewmode === 'mobile' ? 'scale(1.2)' : '',
            onClick: () => root.toggleViewMode('mobile')
        });

        const advancedIconProps = config.get('EditorPanelAdvancedIconProps', {
            size: 16,
            onClick: () => root.toggleEditorMode()
        });

        const layoutIconLabel = config.get('ControlBarLayoutIconLabel', {
            title: 'Change the inspector orientation'
        });

        const hoverIconLabel = config.get('ControlBarHoverIconLabel', {
            title: 'Enable mouse hover DOM selector'
        });

        const revertIconLabel = config.get('ControlBarRevertIconLabel', {
            title: 'Reset unsaved changes'
        });

        const deleteIconLabel = config.get('ControlBarDeleteIconLabel', {
            title: 'Delete both saved and unsaved changes'
        });

        const saveIconLabel = config.get('ControlBarSaveIconLabel', {
            title: 'Save changes'
        });

        const closeIconLabel = config.get('ControlBarCloseIconLabel', {
            title: 'Close Editor'
        });

        const desktopIconLabel = config.get('ControlBarDesktopIconLabel', {
            title: 'Change to desktop view mode'
        });

        const tabletIconLabel = config.get('ControlBarTabletIconLabel', {
            title: 'Change to tablet view mode'
        });

        const mobileIconLabel = config.get('ControlBarMobileIconLabel', {
            title: 'Change to mobile view mode'
        });

        const advancedIconLabel = config.get('EditorPanelAdvancedIconLabel', {
            title: !root.state.advanced ? 'Switch Editor Mode to advanced mode' : 'Switch Editor Mode to normal mode'
        });

        return (
            <div { ...headerProps }>
                <span { ...headerTextProps }>
                    { config.get('LogoText') }
                </span>
                <span { ...headerViewModeProps }>
                    { <span { ...desktopIconLabel }><DesktopIcon { ...desktopIconProps } /></span> }
                    { <span { ...tabletIconLabel }><TabletIcon { ...tabletIconProps } /></span> }
                    { <span { ...mobileIconLabel }><MobileIcon { ...mobileIconProps } /></span> }
                </span>
                <span { ...headerActionProps }>
                    { <span { ...layoutIconLabel }><LayoutIcon { ...layoutIconProps } /></span> }
                    { <span { ...advancedIconLabel }><AdvancedIcon { ...advancedIconProps } /></span> }
                    { <span { ...hoverIconLabel }><HoverIcon { ...hoverIconProps } /></span> }
                    { <span { ...revertIconLabel }><RevertIcon { ...revertIconProps } /></span> }
                    { <span { ...deleteIconLabel }><DeleteIcon { ...deleteIconProps } /></span> }
                    { <span { ...saveIconLabel }><SaveIcon { ...saveIconProps } /></span> }
                    { <span { ...closeIconLabel }><CloseIcon { ...closeIconProps } /></span> }
                </span>
            </div>
        )
    };
}
import React from 'react';
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
import RotatorIcon from '../../node_modules/react-icons/lib/fa/rotate-left';

/**
 * Class for generating the Control Bar element markup
 *
 * @author jason.xie@victheme.com
 */
export default class ControlBar extends React.Component {

    render() {
        const { root } = this.props;
        const { config, polyglot, toggleViewMode, toggleLayout, toggleHoverInspector, toggleEditorMode, revertData, saveData, wipeData, killApp } = root;
        const { vertical, hover, viewmode, advanced } = root.state;

        const headerProps = config.get('controlBar.props.header', {
            key: 'stylizer-controlbar',
            className: 'stylizer-controlbar'
        });

        const headerTextProps = config.get('controlBar.props.headerText', {
            key: 'stylizer-editor-header-text',
            className: 'stylizer-header-text'
        });

        const headerActionProps = config.get('controlBar.props.headerAction', {
            key: 'stylizer-editor-header-actions',
            className: 'stylizer-header-actions'
        });

        const headerRotateProps = config.get('controlBar.props.headerRotate', {
            key: 'stylizer-editor-header-rotate',
            className: 'stylizer-header-rotate'
        });

        const headerViewModeProps = config.get('controlBar.props.headerViewMode', {
            key: 'stylizer-editor-header-view-mode',
            className: 'stylizer-header-view-mode'
        });

        const layoutIconProps = config.get('controlBar.props.layoutIcon', {
            size: 16,
            transform: !vertical ? 'rotate(90)' : '',
            onClick: () => toggleLayout()
        });

        const hoverIconProps = config.get('controlBar.props.hoverIcon', {
            size: 16,
            color: hover ? '#13a6d9' : '',
            onClick: () => toggleHoverInspector()
        });

        const revertIconProps = config.get('controlBar.props.revertIcon', {
            size: 16,
            onClick: () => revertData()
        });

        const deleteIconProps = config.get('controlBar.props.deleteIcon', {
            size: 16,
            onClick: () => wipeData()
        });

        const saveIconProps = config.get('controlBar.props.saveIcon', {
            size: 16,
            onClick: () => saveData()
        });

        const closeIconProps = config.get('controlBar.props.closeIcon', {
            size: 16,
            onClick: () => killApp()
        });

        const desktopIconProps = config.get('controlBar.props.desktopIcon', {
            size: 16,
            transform: viewmode === 'desktop' ? 'scale(1.2)' : '',
            onClick: () => toggleViewMode('desktop')
        });

        const tabletIconProps = config.get('controlBar.props.tabletIcon', {
            size: 16,
            transform: viewmode === 'tablet' ? 'scale(1.2)' : '',
            onClick: () => toggleViewMode('tablet-vertical')
        });

        const mobileIconProps = config.get('controlBar.props.mobileIcon', {
            size: 16,
            transform: viewmode === 'mobile' ? 'scale(1.2)' : '',
            onClick: () => toggleViewMode('mobile-vertical')
        });

        const rotateIconProps = config.get('controlBar.props.rotateIcon', {
            size: 16,
            transform: viewmode.indexOf('horizontal') !== -1 ? 'scale(1.2)' : '',
            onClick: () => {
                (viewmode.indexOf('horizontal') !== -1 && toggleViewMode(viewmode.replace('horizontal', 'vertical')))
                || (viewmode.indexOf('vertical') !== -1 && toggleViewMode(viewmode.replace('vertical', 'horizontal')));
            }
        });

        const advancedIconProps = config.get('controlBar.props.advancedIcon', {
            size: 16,
            onClick: () => toggleEditorMode()
        });

        const layoutIconLabel = config.get('controlBar.props.layoutIconLabel', {
            title: polyglot.t('Change the inspector orientation')
        });

        const hoverIconLabel = config.get('controlBar.props.hoverIconLabel', {
            title: polyglot.t('Enable mouse hover DOM selector')
        });

        const revertIconLabel = config.get('controlBar.props.revertIconLabel', {
            title: polyglot.t('Reset unsaved changes')
        });

        const deleteIconLabel = config.get('controlBar.props.deleteIconLabel', {
            title: polyglot.t('Delete both saved and unsaved changes')
        });

        const saveIconLabel = config.get('controlBar.props.saveIconLabel', {
            title: polyglot.t('Save changes')
        });

        const closeIconLabel = config.get('controlBar.props.closeIconLabel', {
            title: polyglot.t('Close Editor')
        });

        const desktopIconLabel = config.get('controlBar.props.desktopIconLabel', {
            title: polyglot.t('Change to desktop view mode')
        });

        const tabletIconLabel = config.get('controlBar.props.tabletIconLabel', {
            title: polyglot.t('Change to tablet view mode')
        });

        const mobileIconLabel = config.get('controlBar.props.mobileIconLabel', {
            title: polyglot.t('Change to mobile view mode')
        });

        const advancedIconLabel = config.get('controlBar.props.advancedIconLabel', {
            title: !advanced
                ? polyglot.t('Switch Editor Mode to advanced mode')
                : polyglot.t('Switch Editor Mode to normal mode')
        });

        const rotateIconLabel = config.get('controlBar.props.rotateIconLabel', {
            title: polyglot.t('Rotate this layout')
        });

        return (
            <div { ...headerProps }>
                <span { ...headerTextProps }>
                    { polyglot.t('Victheme Stylizer') }
                </span>
                { viewmode.match(/horizontal|vertical/) && <span { ...headerRotateProps }>
                    <span { ...rotateIconLabel }><RotatorIcon { ...rotateIconProps } /></span>
                </span> }
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
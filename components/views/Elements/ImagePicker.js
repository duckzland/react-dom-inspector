import React from 'react';
import ScrollArea from 'react-scrollbar';
import ImageLoader from '../../modules/ImageLoader';
import Configurator from '../../modules/Config';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import { get, set, forEach, size } from 'lodash';

/**
 * Class for building the Editor ImagePicker elements
 *
 * @author jason.xie@victheme.com
 */
export default class ImagePicker extends React.Component {
    state = {
        id: '',
        value: '',
        search: '',
        error: false,
        progress: false,
        removing: false,
        images: [],
        showCount: 0
    };

    config = false;
    loader = null;

    progressElement = null;
    imagesElement = null;

    delayedState = null;

    constructor(props) {
        super(props);

        const { error, refresh } = this;

        if ('value' in props) {
            this.state.value = props.value;
        }

        this.config = new Configurator({
            imageLoader: {
                upload: {
                    onError: () => { error('Error when uploading file') },
                    onFailed: () => { error('Failed uploading File') },
                    onComplete: () => { refresh() }
                },
                fetch: {
                    onError: () => { error('Error when retrieving file') },
                    onFailed: () => { error('Failed retrieving file') },
                    onComplete: () => { refresh() }
                },
                remove: {
                    onError: () => { error('Error removing File') },
                    onFailed:  () => { error('Failed when removing file') },
                    onComplete: () => { refresh() }
                }
                
            }
        });

        if ('config' in props)  {
            this.config.insert(props.config);
        }

        if ('root' in props) {
            this.state.root = props.root;
        }

        this.loader = props.imageLoaderObject 
            ? props.imageLoaderObject 
            : new ImageLoader(
                this.config.get('imageLoader', {}),
                this.config.get('imageLibrary', false)
        );

        const maybeImage = this.loader.find(this.state.value.replace('url(', '').replace(')', '').split('/').pop().split('#')[0].split('?')[0]);
        if (maybeImage && maybeImage.id) {
            this.state.id = maybeImage.id;
        }

        this.state.images = this.loader.extract();
    };

    generateImages = () => {
        const { state, loader } = this;
        this.setState({
            images: state.search ? loader.filter(state.search) : loader.extract()
        });
    };

    onSelect = (e, id) => {
        const { loader, props, state } = this;
        const image = loader.get(id);

        state.id = id;
        state.value = 'url(' + image.url + ')';

        props.onChange && props.onChange({
            target: {
                skipValidation: true,
                name: 'background-image',
                value: state.value
            }
        });
    };

    onSearch = (e) => {
        this.state.search = e.target.value;
        this.refresh();
    };

    onUpload = (e) => {
        this.setState({
            removing: false,
            error: false,
            progress: true
        });

        this.loader.upload(e.target.files[0], this.progressElement);

    };

    onRemove = (e, id) => {
        e.preventDefault();
        e.stopPropagation();
        this.setState({
            removing: id,
            error: false,
            progress: false
        });
        this.loader.remove(id);
    };

    onScroll = (value) => {

        if (this.state.images.length === this.state.showCount) {
            return false;
        }

        const leftPosition = value.leftPosition ? value.leftPosition : 0;
        const singleWidth = value.realWidth / size(this.state.images);
        let showCount = Math.ceil((leftPosition + value.containerWidth) / singleWidth);

        if (showCount > this.state.images.length) {
            showCount = this.state.images.length;
        }
        if (showCount < this.state.showCount) {
            return false;
        }

        this.delayedState = setTimeout(() => {
            this.setState({ showCount: showCount });
        }, 2);
    };

    error = (message) => {
        this.setState({
            removing: false,
            progress: false,
            error: message
        });
    };

    refresh = () => {
        this.state.removing = false;
        this.state.error = false;
        this.state.progress = false;
        this.generateImages();
    };

    render() {
        const { props, state, config, loader, onSelect, onRemove, onSearch, onUpload, onScroll } = this;
        const mainAreaProps = config.get('ElementImagePickerMainProps', {
            className: props.className + ' stylizer-image-picker-element'
        });

        const elementProps = config.get('ElementImagePickerElementProps', {
            className: 'stylizer-form-item'
        });

        const errorProps = config.get('ElementImagePickerErrorProps', {
            className: 'stylizer-error-bag'
        });

        const progressProps = config.get('ElementImagePickerProgressProps', {
            className: 'stylizer-progress-bar',
            ref: (element) => { this.progressElement = element }
        });

        const boxProps = config.get('ElementImagePickerBoxProps', {
            className: 'stylizer-form-search-upload'
        });

        const searchInputProps = config.get('ElementImagePickerSearchInputProps', {
            type: 'text',
            className: 'stylizer-form-input',
            name: 'search',
            placeholder: 'Search image by filename...',
            value: state.search,
            onChange: onSearch
        });

        const uploadElementProps = config.get('ElementImagePickerUploadElementProps', {
            className: 'stylizer-form-input-file stylizer-form-button'
        });

        const uploadInputProps = config.get('ElementImagePickerUploadInputProps', {
            type: 'file',
            className: 'stylizer-form-input',
            accept: 'image/*',
            name: 'file',
            onChange: onUpload
        });

        const scrollAreaProps = config.get('ElementImagePickerScrollAreaProps', {
            speed: 0.8,
            contentClassName: "content",
            onScroll: (value) => { onScroll(value) },
            horizontal: true,
            vertical: false
        });

        const scrollAreaContentProps = config.get('ElementImagePickerScrollAreaContentProps', {
            className: 'stylizer-image-picker-images',
            ref: (element) => { this.imagesElement = element }
        });

        let Images = [];
        forEach(state.images, (image, delta) => {
            const thumbnailProps = config.get('ElementImagePickerThumbnailProps', {
                key: 'image-picker-' + delta,
                className: ['stylizer-image-picker-thumbnail',
                    (state.id === image.id ? 'active' : ''),
                    (state.removing === image.id ? 'removing' : '')].join(' '),
                onClick: (e) => { onSelect(e, image.id) }
            });

            const thumbnailCloseProps = config.get('ElementImagePickerThumbnailCloseProps', {
                className: 'stylizer-image-picker-thumbnail-close',
                onClick: (e) => { onRemove(e, image.id) }
            });

            const closeIconProps = config.get('ElementImagePickerCloseIconProps', {
                size: 16
            });

            const thumbnailImageProps = config.get('ElementImagePickerThumbnailImageProps', {
                src: (delta < this.state.showCount) ? loader.thumbnail(image) : ''
            });

            Images.push(
                <div { ...thumbnailProps }>
                    <span { ...thumbnailCloseProps}>
                        <CloseIcon { ...closeIconProps }/>
                    </span>
                    <img { ...thumbnailImageProps } />
                </div>
            )
        });

        return (
            <div { ...mainAreaProps }>
                <div { ...boxProps }>
                    <div { ...elementProps }>
                        <input { ...searchInputProps } />
                    </div>
                    <div { ...elementProps }>
                        <label { ...uploadElementProps }>
                            <input { ...uploadInputProps } />
                            Upload
                        </label>
                    </div>
                    { state.progress && <div { ...elementProps }><progress { ...progressProps }></progress></div> }
                    { state.error && <div { ...elementProps }><div { ...errorProps }>{ state.error }</div></div> }
                </div>
                { Images.length > 0
                    ? <ScrollArea { ...scrollAreaProps }><div { ...scrollAreaContentProps } >{ Images }</div></ScrollArea>
                    : <div { ...elementProps }>No Image found</div>
                }
            </div>
        )
    }
}
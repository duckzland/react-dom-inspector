import React from 'react';
import ScrollArea from 'react-scrollbar';
import ImageLoader from '../../modules/ImageLoader';
import CloseIcon from '../../../node_modules/react-icons/lib/io/close-circled';
import { get, set, forEach } from 'lodash';

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

    config = {};
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

        if ('config' in props)  {
            Object.assign(this.config, props.config);

            set(this, 'config.imageLoader.upload.onComplete', () => { refresh() });
            set(this, 'config.imageLoader.fetch.onComplete', () => { refresh() });
            set(this, 'config.imageLoader.remove.onComplete', () => { refresh() });

            set(this, 'config.imageLoader.upload.onFailed', () => { error('Failed uploading File') });
            set(this, 'config.imageLoader.upload.onError', () => { error('Error when uploading file') });
            set(this, 'config.imageLoader.fetch.onFailed', () => { error('Failed retrieving file') });
            set(this, 'config.imageLoader.fetch.onError', () => { error('Error when retrieving file') });
            set(this, 'config.imageLoader.remove.onFailed', () => { error('Failed uploading File') });
            set(this, 'config.imageLoader.remove.onError', () => { error('Error when removing file') });
        }

        if ('root' in props) {
            this.state.root = props.root;
        }

        this.loader = props.imageLoaderObject ? props.imageLoaderObject : new ImageLoader(
            get(this.config, 'imageLoader', {}),
            get(this.config, 'imageLibrary', false)
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
        forEach(e.target.files, (file) => {
            this.loader.upload(file, this.progressElement);
        });
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
        const singleWidth = value.realWidth / this.state.images.length;
        let showCount = Math.ceil((leftPosition + value.containerWidth) / singleWidth);

        if (showCount > this.state.images.length) {
            showCount = this.state.images.length;
        }
        if (showCount < this.state.showCount) {
            return false;
        }

        this.delayedState = setTimeout(() => {
            this.setState({showCount: showCount });
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
        const mainAreaProps = get(config, 'ElementImagePickerMainProps', {
            className: props.className + ' stylizer-image-picker-element'
        });

        const elementProps = get(config, 'ElementImagePickerElementProps', {
            className: 'stylizer-form-item'
        });

        const errorProps = get(config, 'ElementImagePickerErrorProps', {
            className: 'stylizer-error-bag'
        });

        const progressProps = get(config, 'ElementImagePickerProgressProps', {
            className: 'stylizer-progress-bar',
            ref: (element) => { this.progressElement = element }
        });

        const boxProps = get(config, 'ElementImagePickerBoxProps', {
            className: 'stylizer-form-search-upload'
        });

        const searchInputProps = get(config, 'ElementImagePickerSearchInputProps', {
            type: 'text',
            className: 'stylizer-form-input',
            name: 'search',
            placeholder: 'Search image by filename...',
            value: state.search,
            onChange: onSearch
        });

        const uploadElementProps = get(config, 'ElementImagePickerUploadElementProps', {
            className: 'stylizer-form-input-file stylizer-form-button'
        });

        const uploadInputProps = get(config, 'ElementImagePickerUploadInputProps', {
            type: 'file',
            className: 'stylizer-form-input',
            accept: 'image/*',
            name: 'file',
            onChange: onUpload
        });

        const scrollAreaProps = get(config, 'ElementImagePickerScrollAreaProps', {
            speed: 0.8,
            contentClassName: "content",
            onScroll: (value) => { onScroll(value) },
            horizontal: true,
            vertical: false
        });

        const scrollAreaContentProps = get(config, 'ElementImagePickerScrollAreaContentProps', {
            className: 'stylizer-image-picker-images',
            ref: (element) => { this.imagesElement = element }
        });

        let Images = [];
        forEach(state.images, (image, delta) => {
            const thumbnailProps = get(config, 'ElementImagePickerThumbnailProps', {
                key: 'image-picker-' + delta,
                className: ['stylizer-image-picker-thumbnail',
                    (state.id === image.id ? 'active' : ''),
                    (state.removing === image.id ? 'removing' : '')].join(' '),
                onClick: (e) => { onSelect(e, image.id) }
            });

            const thumbnailCloseProps = get(config, 'ElementImagePickerThumbnailCloseProps', {
                className: 'stylizer-image-picker-thumbnail-close',
                onClick: (e) => { onRemove(e, image.id) }
            });

            const closeIconProps = get(config, 'ElementImagePickerCloseIconProps', {
                size: 16
            });

            const thumbnailImageProps = get(config, 'ElementImagePickerThumbnailImageProps', {
                src: (delta < state.showCount) ? loader.thumbnail(image) : ''
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
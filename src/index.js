import FrameClient from './client';
import FrameModalParent from './modal';
import {isInIframe} from './utils';

/**
 *
 * Export
 *
 */

let bridge = FrameModalParent;
if (isInIframe()) {
    bridge = FrameClient;
}

try {
    window['FrameBridge'] = bridge;
} catch(e){}






import { decreaseZoom, increaseZoom } from '@client/types';
import { Dynalist } from '../dynalist';

Dynalist.onCreate(instance => {
    instance.events.when.key({
        key: '0',
        modifiers: {
            ctrl: true
        } 
    }, () => {
        const { x, y } = instance.camera;
        instance.camera = {
            x,
            y,
            zoom: 1
        };
        instance.markDirty();
    });

    const zoomout = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const { x, y, zoom } = instance.camera;
        instance.camera = {
            x,
            y,
            zoom: decreaseZoom(zoom)
        };
        instance.markDirty();
    }

    const zoomin = (e: { preventDefault: () => void }) => {
        e.preventDefault();
        const { x, y, zoom } = instance.camera;
        instance.camera = {
            x,
            y,
            zoom: increaseZoom(zoom)
        };
        instance.markDirty();
    };

    instance.events.when.key({
        key: '-',
        // modifiers: {
        //     ctrl: true
        // }
    }, zoomout);
    instance.events.when.key({
        key: '-',
        // modifiers: {
        //     ctrl: true
        // }
    }, zoomin);

    instance.events.on('wheel', e => {
        if(e.deltaY > 0) zoomout(e)
        else zoomin(e)
    }, false)
});
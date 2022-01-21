import { Dynalist } from '../dynalist';

Dynalist.onCreate(instance => {
    let panning = false;

    instance.when.key({
        key: ' '
    }, () => {
        panning = false;
        instance.cursor = 'default';
        instance.markDirty();
    });
    
    instance.when.keydown({
        key: ' '
    }, () => {
        panning = true;
        instance.cursor = 'grabbing';
        instance.markDirty();
    });

    instance.when.move(null, ({ dx, dy }) => {
        if(panning) {
            const { x, y, zoom } = instance.camera;
            
            instance.camera = {
                x: x - dx,
                y: y - dy,
                zoom
            };

            instance.markDirty();
        }
    });
});
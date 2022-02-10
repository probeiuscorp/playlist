import { magmin, setImmediateInterval } from '@client/util';
import { Dynalist } from '../dynalist';
import { arrows } from './node-commands';

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

    type Vector = [number, number];
    let movement: Vector = [0, 0];
    let acceleration: Vector = [0, 0];
    const jerk = 2;
    let movementInterval: number | null;
    
    function addMovement(dx: number, dy: number) {
        const [ x, y ] = movement;
        movement = [ x + dx, y + dy ];

        if(!movementInterval) {
            acceleration = [1, 1];
            movementInterval = setImmediateInterval(() => {
                const dx = magmin(movement[0], acceleration[0]);
                const dy = magmin(movement[1], acceleration[1]);
                
                const { x, y, zoom } = instance.camera;
                instance.camera = {
                    x: x + dx,
                    y: y + dy,
                    zoom
                };

                movement[0] -= dx;
                movement[1] -= dy;
                acceleration[0] += jerk;
                acceleration[1] += jerk;

                if(!movement[0] && !movement[1]) {
                    movementInterval && clearInterval(movementInterval);
                    movementInterval = null;
                }

                instance.markDirty();
            }, 30);
        }
    }

    for(const [ key, dx, dy ] of arrows) {
        instance.when.keydown({
            key
        }, () => {
            if(Object.keys(instance.selected.nodes).length === 0) {
                addMovement(dx * 15, dy * 15);
            }
        });

        instance.when.keydown({
            key,
            modifiers: { ctrl: true }
        }, () => {
            if(Object.keys(instance.selected.nodes).length === 0) {
                addMovement(dx * 75, dy * 75);
            }
        })
    }
});
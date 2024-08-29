import * as u from './urls';
import { Graph } from './graph';

const mainGraph = new Graph<song, number>();
const { connect } = mainGraph;

connect(u.heavensDevils).to(u.echoesInRain, 144);
export { mainGraph };

import Cursor from '../cursor';
import ButtonCtrl from './buttonCtrl';

// initialize custom cursor
const cursor = new Cursor(document.querySelector('.cursor'));
const button = new ButtonCtrl(document.querySelector('.button'));

button.on('enter', () => cursor.enter());
button.on('leave', () => cursor.leave());
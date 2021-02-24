import { gsap } from 'gsap';
import { EventEmitter } from 'events';
import { lerp, getMousePos, calcWinsize, distance } from '../utils';

// Calculate the viewport size
let winsize = calcWinsize();
window.addEventListener('resize', () => winsize = calcWinsize());

// Track the mouse position
let mousepos = {x: 0, y: 0};
window.addEventListener('mousemove', ev => mousepos = getMousePos(ev));

export default class ButtonCtrl extends EventEmitter {
    constructor(el) {
        super();
        // DOM elements
        // el: main button
        // text: inner text element
        this.DOM = {el: el};
        this.DOM.text = this.DOM.el.querySelector('.button__text');
        this.DOM.textinner = this.DOM.el.querySelector('.button__text-inner');
        this.DOM.deco = this.DOM.el.querySelector('.button__deco');
        // amounts the button will translate
        this.renderedStyles = {
            tx: {previous: 0, current: 0, amt: 0.1},
            ty: {previous: 0, current: 0, amt: 0.1},
            rx: {previous: 0, current: 0, amt: 0.1},
            ry: {previous: 0, current: 0, amt: 0.1}
        };
        // button state (hover)
        this.state = {
            hover: false
        };
        // calculate size/position
        this.calculateSizePosition();
        // init events
        this.initEvents();
        // loop fn
        requestAnimationFrame(() => this.render());
    }
    calculateSizePosition() {
        // size/position
        this.rect = this.DOM.el.getBoundingClientRect();
        // the movement will take place when the distance from the mouse to the center of the button is lower than this value
        this.distanceToTrigger = this.rect.width*0.8;
    }
    initEvents() {
        this.onResize = () => this.calculateSizePosition();
        window.addEventListener('resize', this.onResize);
    }
    render() {
        // calculate the distance from the mouse to the center of the button
        const distanceMouseButton = distance(mousepos.x+window.scrollX, mousepos.y+window.scrollY, this.rect.left + this.rect.width/2, this.rect.top + this.rect.height/2);
        // new values for the translations
        let x = 0;
        let y = 0;
        let rx = 0;
        let ry = 0;

        if ( distanceMouseButton < this.distanceToTrigger ) {
            if ( !this.state.hover ) {
                this.enter();
            }
            x = (mousepos.x + window.scrollX - (this.rect.left + this.rect.width/2))*.2;
            y = (mousepos.y + window.scrollY - (this.rect.top + this.rect.height/2))*.2;
            rx = (mousepos.y + window.scrollY - (this.rect.top + this.rect.height/2))*.07;
            ry = (mousepos.x + window.scrollX - (this.rect.left + this.rect.width/2))*.09;
        }
        else if ( this.state.hover ) {
            this.leave();
        }

        this.renderedStyles['tx'].current = x;
        this.renderedStyles['ty'].current = y;
        this.renderedStyles['rx'].current = rx;
        this.renderedStyles['ry'].current = ry;
        
        for (const key in this.renderedStyles ) {
            this.renderedStyles[key].previous = lerp(this.renderedStyles[key].previous, this.renderedStyles[key].current, this.renderedStyles[key].amt);
        }

        this.DOM.el.style.transform = `translate3d(${this.renderedStyles['tx'].previous}px, ${this.renderedStyles['ty'].previous}px, 0) rotateX(${this.renderedStyles['rx'].previous}deg) rotateY(${this.renderedStyles['ry'].previous}deg)`;
        this.DOM.text.style.transform = `translate3d(${-this.renderedStyles['tx'].previous*0.6}px, ${-this.renderedStyles['ty'].previous*0.6}px, 0)`;

        requestAnimationFrame(() => this.render());
    }
    enter() {
        this.emit('enter');
        this.state.hover = true;
        this.DOM.el.classList.add('button--hover');
        document.body.classList.add('active');

        gsap.killTweensOf(this.DOM.textinner);
        gsap.killTweensOf(this.DOM.deco);

        gsap
        .timeline()
        .to(this.DOM.deco, 0.5, {
            ease: 'Power3.easeOut',
            startAt: {y: '75%'},
            y: '0%'
        })
        .to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '-10%'
        }, 0)
        .to(this.DOM.textinner, 0.2, {
            ease: 'Expo.easeOut',
            opacity: 1, 
            startAt: {y: '20%'}, 
            y: '0%'
        }, 0.1);
    }
    leave() {
        this.emit('leave');
        this.state.hover = false;
        this.DOM.el.classList.remove('button--hover');
        document.body.classList.remove('active');

        gsap.killTweensOf(this.DOM.textinner);
        gsap.killTweensOf(this.DOM.deco);

        gsap
        .timeline()
        .to(this.DOM.deco, 0.5, {
            ease: 'Power3.easeOut',
            y: '-75%'
        })
        .to(this.DOM.textinner, 0.1, {
            ease: 'Power3.easeOut',
            opacity: 0, 
            y: '-10%'
        }, 0)
        .to(this.DOM.textinner, 0.2, {
            ease: 'Expo.easeOut',
            opacity: 1, 
            startAt: {y: '20%'}, 
            y: '0%'
        }, 0.1);
    }
}

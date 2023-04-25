// import the required animation functions from the angular animations module
import { trigger, group, query, animate, transition, style } from '@angular/animations';
import {
    slideInRightOnEnterAnimation,
    slideInUpOnEnterAnimation,
    slideInDownOnEnterAnimation,
    slideInLeftOnEnterAnimation,
    slideOutUpOnLeaveAnimation,
    slideOutDownOnLeaveAnimation,
    slideOutLeftOnLeaveAnimation,
    slideOutRightOnLeaveAnimation
  } from 'angular-animations';

export const slideRightLeftAnimation = trigger('slideRightLeftAnimation', [  
    transition(':increment', slideRight()),
    transition(':decrement', slideLeft())      // slideTo('left')
]);

function fadeIn() {
    const optional = { optional: true };
    return [
        group([
            query(':enter', [
                style({ opacity: 0} ),
                animate('0.9s ease-in-out', style({ opacity: 1 }))
            ], { optional: true })
        ])
    ];
}

function slideTop() {
    const optional = { optional: true };
    return [
        query(':enter, :leave', style({ position: 'fixed', height: '100vh' }), optional),
        group([
            query(':enter', [
                style({transform: 'translateY(-100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateY(100%)' }))
            ], { optional: true }),
        ])
    ];
}

function slideBottom() {
    const optional = { optional: true };
    return [
        query(':enter, :leave', style({ position: 'fixed', height: '100vh' }), optional),
        group([
            query(':enter', [
                style({transform: 'translateY(100%)'}),
                animate('0.5s ease-in-out', style({transform: 'translateY(0%)'}))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateY(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateY(-100%)' }))
            ], { optional: true }),
        ])
    ];
}

function slideRight() {
    const optional = { optional: true };
    return [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), optional),
        group([
            query(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(100%)' }))
            ], { optional: true }),
        ])
    ];
}

function slideLeft() {
    const optional = { optional: true };
    return [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), optional),
        group([
            query(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true }),
            query(':leave', [
                style({ transform: 'translateX(0%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(-100%)' }))
            ], { optional: true }),
        ])
    ];
}

function slideInRight() {
    const optional = { optional: true };
    return [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), optional),
        group([
            query(':enter', [
                style({ transform: 'translateX(-100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true }),
        ])
    ];
}

function slideInLeft() {
    const optional = { optional: true };
    return [
        query(':enter, :leave', style({ position: 'fixed', width: '100%' }), optional),
        group([
            query(':enter', [
                style({ transform: 'translateX(100%)' }),
                animate('0.5s ease-in-out', style({ transform: 'translateX(0%)' }))
            ], { optional: true })
        ])
    ];
}
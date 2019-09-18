import { interval, fromEvent, Observable, merge } from "rxjs";
import { tap, mergeMap, map, take, concatMap, switchMap, exhaustMap } from 'rxjs/operators';

// Fake network request
// Note that this request basically never completes!! We use take() to "fake" completion for example's sake.
const $fakeHttp = Observable.create(obs => {
    obs.next('started');
    setTimeout(() => {
        obs.next('finished');
    } ,3000);
});

/**
 * Concatenate observables
 * concatMap()
 * @link https://blog.angular-university.io/rxjs-higher-order-mapping/
 */
const concatButton = document.querySelector('#concat');
const $clickConcat = fromEvent(concatButton, 'click');

// Concat map waits for the inner observable to complete before subscribing to a new inner observable
// I can fake obs completion with the take() operator if my observable is infinite
// In case of an infinite inner observable, the innver obs will NEVER re-subscribe upon new emission of outer obs
$clickConcat.pipe(concatMap(e => $fakeHttp.pipe(take(2)))).subscribe(console.log);

/**
 * Merging observables
 * mergeMap()
 * @link https://blog.angular-university.io/rxjs-higher-order-mapping/
 */

// Merging 2 infinite obs simple example
const $ser1 = interval(1000).pipe(map(val => val *10));
const $ser2 = interval(2000).pipe(map(val => val * 100));
const $result = merge($ser1, $ser2);
// The values are emitted in the result obs immediately as they arrive
//$result.subscribe(console.log);

const mergeButton = document.querySelector('#merge');
const $clickMerge = fromEvent(mergeButton, 'click');

// Merge map subscribes to multiple inner observables simultaenously and instant
// In the case of inifite obs that can rapidly buble up to a massive memory issue!!!
// If we wouldn't use take() here our infinite fakeHttp request would start a new subscription every time we press the button
$clickMerge.pipe(mergeMap(e => $fakeHttp.pipe(take(2)))).subscribe(console.log);

/**
 * Switching observables
 * switchMap()
 * @link https://blog.angular-university.io/rxjs-higher-order-mapping/
 */

 const switchButton = document.querySelector('#switch');
 const $clickSwitch = fromEvent(switchButton, 'click').pipe(tap(e => switchState = !switchState));
 let switchState = false;

 const $countToTen = interval(1000).pipe(map(v => v + 1), take(10), tap(y => console.log('$countToTen emission')));
 const $countToHundred = interval(1000).pipe(map(v => (v + 1) * 10), take(10), tap(y => console.log('countToHundred emission')));

 // SwitchMap can switch between multiple observables emitting values
 // Before switching to a new obs it will unsubcribe the current subscription
$clickSwitch.pipe(switchMap(e => {
    switch(switchState) {
        case true:
            return $countToTen;
        case false:
            return $countToHundred;
    }
})).subscribe(console.log);

const merge2Button = document.querySelector('#merge2');
const $clickMerge2 = fromEvent(merge2Button, 'click').pipe(tap(e => switchState = !switchState));

// Same exmple as with switchMap but using merge map illustrates the difference
// MergeMap does NOT unsubscribe to open subscriptions
$clickMerge2.pipe(mergeMap(e => {
    switch(switchState) {
        case true:
            return $countToTen;
        case false:
            return $countToHundred;
    }
})).subscribe(console.log);

/**
 * Exhaust Map
 * exhaustMap()
 * @link https://blog.angular-university.io/rxjs-higher-order-mapping/
 */

 const exhaustButton = document.querySelector('#exhaust');
 const $clickExhaust = fromEvent(exhaustButton, 'click');

 // Notice how a new counter is only started once the ongoing subscription was completed.
 // If we click multiple times it won't do everything, only after completion of the first click's observable it will trigger a new subscription
 $clickExhaust.pipe(exhaustMap(e => $countToTen)).subscribe(console.log);

 const mergeButton3 = document.querySelector('#merge3');
 const $clickMerge3 = fromEvent(mergeButton3, 'click');

 // As opposed to the exhausMap() operator the mergeMap() would not wait for an ongoing subscription to complete
 // hence this time we'd start multiple counters concurrently.
 $clickMerge3.pipe(mergeMap(e => $countToTen)).subscribe(console.log);
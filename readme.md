# Understanding RxJs map operators

This is a little playground to understand the different behaviors of the various RxJs map operators:

- concatMap()
- mergeMap()
- switchMap()
- exhaustMap()

## concatMap()

**What:** Chains observables together but waits with subscribing to a new observables until the ongoing subscription is completed. So if an observable is subscribed to while another subscription is still ongoing it will wait and only subscribe once the ongoing observable subscription was completed.

**When:** Use when the order of execution is important but you need to have all observables executed.

**As opposed to:** `exhaustMap()` which would also not subscribe to an observable if an other subscription ongoing *but* it would *not* subscribe later and instead just ignore the new subscription.

## mergeMap()

**What:** Merges the outputs of multiple observables. It can have multiple ongoing subscriptions and emits values whenever as they come in from the various subscriptions. As such, it can have multiple subscriptions sending through emissions.

**When** Use when things should happen in parallel!

**As opposed to:** `concatMap()`, `switchMap()` and `exhaustMap()` which all would either *wait* with a new subscription until an ongoing subscription was completed or in the case of `switchMap()` *unsubscribe* from the ongoing subscription first.

## switchMap()

**What:** Switches between the output of multiple observables. Before subscribing to the output of a new observable it will unsubscribe from any ongoing subscriptions. As such, it always only has 1 subscription sending through emissions.

**When** Use when we want to cancel ongoing subscriptions.

**As opposed to:** `mergeMap()` which would start a new subscription without cancelling an ongoing one, or `concatMap()` which would just wait for the ongoing subscription to complete or `exhaustMap()` which would ignore the new subscription as long as another ongoing subscription is there.

## exhaustMap()

**What:** Chains observables together but does *not* start a new subscription when there is an ongoing subscription. It always waits for subscriptions to complete before accepting to start a new one.

**When**: Use when we want to ignore observables while another one is still emitting values.

**As opposed to:** `concatMap()` which would also not subscribe to a new observable but instead of just ignoring the request to subscribe it would instead *wait* with the new subscription. `exhausMap()` on the other hand really *ignores* any new subscriptions until there is no other subscription ongoing anymore.

## More insights

Excellent blog post on the topic pro memoria: [https://blog.angular-university.io/rxjs-higher-order-mapping/](Angular University)
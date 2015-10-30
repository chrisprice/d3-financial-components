Whilst the component design overview for d3fc clearly states that simplicity is prioritised over performance, there's no point in having a chart if it has lousy performance. In this post I'll run through some of the tips and tricks for squeezing the best performance out of d3fc without compromising on its flexibility.

https://github.com/ScottLogic/d3fc/pull/636/commits

# What are we aiming for?

The holy grail of any visualisation in the browser is to achieve 60 frames per second. Without relying on exotic tricks that's around the framerate that we (humans) perceive as continuous motion, and coincidentally the maximum framerate the browser will render at.

There's 2 things to note -

* 60 fps translates to 16.66ms to render each frame. Once you subtract any layout and paiting time, that leaves approximately 10ms for your code to do its business.
* There's no point hitting the 10ms render time 90% of the time, that will just lead to perceptible jank in the rendering. If you're aiming for 60 fps you need to hit ~10ms 100% of the time.

One easy way to fix performance issues is to short-circuit code paths such that event handlers directly trigger rendering of affecting areas of the screen. Whilst this can lead to significant performance gains, it is very much at the cost of maintainability. Instead of the visualisation being a function of its model, it is now a function of its model and a sequence of delta operations.

Therefore within the allotted 10ms processing time I want to re-render the full chart from the model. If this sounds familiar, it is very much in keeping with the currently very popular Flux pattern. N.B. this will not involve completely re-creating the chart from scratch because of [d3's update pattern](http://bost.ocks.org/mike/selection/).

# Where are we now?

Using the Chrome developer tool's Timeline view, not in a very good place!

CHROME TIMELINE VIEW - LOTS OF RED

Before we go any further it's probably worth reviewing the general pattern currently being used -

```js
var data = ...;
var container = ...;
function render() {
    container.datum(data);

    var mainChart = ...;
    mainChart.on('event', render);
    container.select('.main-chart')
        .call(mainChart);

    var volumeChart = ...;
    volumeChart.on('event', render);
    container.select('.volume-chart')
        .call(volumeChart);

    var navigatorChart = ...;
    navigatorChart.on('event', render);
    container.select('.navigator-chart')
        .call(navigatorChart);
}
render();
```

Whilst this pattern has a number of disadvantages which we'll come on to, it does fulfill our requirement of fully re-rendering the chart from the model on every interaction.

# Components all the way down

The timeline is littered with GC pauses. Whilst there's not a lot you can do to directly control when GC happens, if it's happening a lot that's a hint you could be doing something more memory efficiently.

In this case we're re-creating our components (i.e. `mainChart`, `volumeChart` and `navigatorChart`) unnecessarily every time we render the chart. If we instead were to move their construction to outside the render loop and maintain references to them, we could eliminate the memory thrashing, as well as saving ourselves some processing time.


```js
var data = ...;
var container = ...;

var mainChart = ...;
mainChart.on('event', render);

var volumeChart = ...;
volumeChart.on('event', render);

var navigatorChart = ...;
navigatorChart.on('event', render);

function render() {
    container.datum(data);

    container.select('.main-chart')
        .call(mainChart);

    container.select('.volume-chart')
        .call(volumeChart);

    container.select('.navigator-chart')
        .call(navigatorChart);
}
render();
```

Moving the components outside of the render loop does make the code a bit messier though, ideally we only really want our top-level code to create a single root component. Luckily we know how to create components, so we just move the code from the top-level into it's own component.

```js
var data = ...;
var container = ...;

var chart = ...;
chart.on('event', render);

function render() {
    container.datum(data)
        .call(chart);
}
render();
```

# Optimising the series

Out of the box d3fc `fc.series.bar` and `fc.series.candlestick` components allow for `decorate`-ing each rendered data point. This is really useful if you want to add labels to your datapoints or customise them in some other bespoke way. However, the internals of how the series allows decoration means you're paying a performance penalty if you're not making use of that functionality.

As we don't need to decorate our series and as both series themselves make use of the lower-level `fc.svg.bar` and `fc.svg.candlestick`, we can quickly knock up optimised versions of them. I've previously described this in more detail here.

# Throttling with requestAnimationFrame

Now that we've managed to bring down the render time, we can see that we're actually still failing to hit 60fps because we're attempting to double render within a single frame. This is happening because we're directly responding to user events e.g. mouse movements. These event handlers are scheduled as quickly as possible by the browser, it doesn't attempt to throttle to once per frame even though that's as fast as the user will see updates.

Instead we need to apply the event deltas to the model, and then once per frame render the result. We can do this using requestAnimationFrame -

```js
function renderInternal() {
    ...;
}

var rafId = null;
function render() {
    if (rafId == null) {
        rafId = requestAnimationFrame(function() {
            rafId = null;
            renderInternal();
        });
    }
}
```

This is now exposed in the library as a utility `fc.util.render` -

```js
var render = fc.util.render(function() {
    ...;
});
```

# Avoiding browser reflows

Interlacing the reads and writes of layout-sensitive DOM properties, causes layout thrashing. In this case the `.layout()` calls within each of the charts first triggered a synchronous layout by attempting to measure the containing element (via `fc.util.innerDimensions`) and then by setting SVG attributes (`width`/`height`) triggered a layout invalidation.

OLD DOM STRUCTURE

This was fixed by moving all of the chart panels into one top-level SVG node rather than mixing DOM layout with SVG `.layout()`. The `.layout()` code was then enhanced (as [described here](sdajf)) to only measure a node if it hadn't already been assigned dimensions by a `.layout()` call to an ancestor node.

NEW DOM STRUCTURE

The code then changes slightly to perform a top-level layout -

```js
function render() {
    container.datum(data)
        .layout()
        .call(chart);
}
render();
```

# Avoiding layout calculations altogether

Whilst removing the forced synchronous layouts has sped things up, there's still a non-zero cost to the ```.layout()``` code. As layout code is not required for the vast majority of chart operations (with the exception of e.g. resizing), a flag was added for suspending it manually.

# The results

Fricking sweet!

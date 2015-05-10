# D3 Financial Components (D3FC) [![Build Status](https://travis-ci.org/ScottLogic/d3-financial-components.svg?branch=master)](https://travis-ci.org/ScottLogic/d3-financial-components)

A collection of components that make it easy to build interactive financial charts with  [D3](http://d3js.org).

## Installation

D3FC is available via npm. Simply install as follows:

    npm install d3-financial-components

Once installed, you can reference the D3FC JavaScript, CSS and dependencies within an HTML page as follows:

    <script src="node_modules/d3-financial-components/dist/d3-financial-components.js"></script>
    
    <link href="node_modules/d3-financial-components/dist/d3-financial-components.css" rel="stylesheet"/>

If you want a quick verification that everything has installed correctly, the following code will render a simple time series chart:

    <div id="chart"></div>
    <script type="text/javascript">
    var data = fc.dataGenerator()(50);

    var chart = fc.charts.linearTimeSeries()
        .xDomain(fc.utilities.extent(data, 'date'))
        .xTicks(5)
        .yDomain(fc.utilities.extent(data, ['high', 'low']))
        .yNice()
        .yTicks(5);

    var gridlines = fc.scale.gridlines();
    var candlestick = fc.series.candlestick();
    var movingAverage = fc.indicators.movingAverage();

    var multi = fc.series.multi()
        .series([gridlines, candlestick, movingAverage]);
    chart.plotArea(multi);

    d3.select("#chart")
        .append('svg')
        .style({
            height: '250px',
            width: '600px'
        })
        .datum(data)
        .call(chart);

    </script>

To find out more about the various components, visit the [project webpage](http://scottlogic.github.io/d3-financial-components/).

## Developing

[npm](https://www.npmjs.com/), the package manager for [Node.js](https://nodejs.org/), is used to manage the project's dependencies. [Grunt](http://gruntjs.com/), a JavaScript task runner, is used to test and build the project.

### Initial Setup

- Download or clone this repository locally
- Ensure [Node.js](https://nodejs.org/), which includes npm, is installed
- Ensure [Grunt](http://gruntjs.com/getting-started#installing-the-cli) is installed:

```
npm install -g grunt-cli
```

- Navigate to the root of your local copy of this project and install the dependencies:

```
npm install
```

- Perform an initial build:

```
grunt
```

### Grunt Tasks

The following Grunt tasks, found in `Gruntfile.js`, can be run from the command line. The most commonly used tasks to build and develop the project are:

- `grunt build` - generate the project's JavaScript and CSS files in the _dist_ directory (at the root of the project); build the visual tests
- `grunt dev` - run `grunt build`, then `grunt watch`
- `grunt dev:serve` - same as `grunt dev` but also starts a web server for viewing the visual tests

Other tasks include:

- `grunt check` - run JSHint and JSCS checks
- `grunt test` - run unit tests and build the visual tests
- `grunt watch` - watch the source files and rebuild when a change is saved
- `grunt serve` - start a web server for viewing the visual tests
- `grunt` - check, test and build the project

### Visual Tests

The project includes a number of unit tests, however, because these components are visual in nature, unit testing is not enough. This project contains a number of ad-hoc visual tests that are found within the `visual-tests` folder. The visual tests are compiled, via [assemble](http://assemble.io/), to create a simple website. To view this site, run `grunt serve` or a [static server](https://gist.github.com/willurd/5720255) from the `visual-tests\dist` folder.

## License

These components are licensed under the [MIT License](http://opensource.org/licenses/MIT).
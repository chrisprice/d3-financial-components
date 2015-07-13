---
layout: example
title: Basecoin example
---
<div class="row">
  <div class="col-md-12">
    <h1>Basecoin Example</h1>
  </div>
</div>

<style>@import "index.css";</style>

<div class="row">
  <div class="col-md-4">

  </div>
  <div class="col-md-8">
    <svg viewbox="0 0 1024 576">
        <defs>
            <mask id="mask">
                <rect width="1024" height="576" fill="white"/>
                <rect width="1024" height="576" fill="url(#mask-horizontal-gradient)"/>
                <rect width="1024" height="576" fill="url(#mask-vertical-gradient)"/>
                <linearGradient id="mask-horizontal-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stop-opacity="1"/>
                    <stop offset="30%" stop-opacity="0"/>
                    <stop offset="70%" stop-opacity="0"/>
                    <stop offset="100%" stop-opacity="1"/>
                </linearGradient>
                <linearGradient id="mask-vertical-gradient" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stop-opacity="1"/>
                    <stop offset="30%" stop-opacity="0"/>
                    <stop offset="70%" stop-opacity="0"/>
                    <stop offset="100%" stop-opacity="1"/>
                </linearGradient>
            </mask>
            <filter id="blur">
                <feImage xlink:href="#series" x="0" y="0" width="1024" height="576" result="image"/>
                <feGaussianBlur in="image" stdDeviation="5"/>
            </filter>
            <mask id="blur-mask">
                <rect width="1024" height="576" fill="url(#blur-mask-gradient)"/>
                <linearGradient id="blur-mask-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stop-color="white"/>
                    <stop offset="30%" stop-color="black"/>
                </linearGradient>
            </mask>
            <mask id="inverted-blur-mask">
                <rect width="1024" height="576" fill="url(#inverted-blur-mask-gradient)"/>
                <linearGradient id="inverted-blur-mask-gradient" x1="0" x2="1" y1="0" y2="0">
                    <stop offset="0%" stop-color="black"/>
                    <stop offset="30%" stop-color="white"/>
                </linearGradient>
            </mask>
        </defs>
        <g id="vertical-lines" mask="url(#mask)"/>
        <g id="gridlines" mask="url(#mask)"/>
        <g mask="url(#inverted-blur-mask)">
            <g id="series"/>
        </g>
        <g filter="url(#blur)" mask="url(#blur-mask)"/>
        <g id="labels" mask="url(#mask)"/>
    </svg>
  </div>
</div>

<script src="index.js"></script>

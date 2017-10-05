<template>
    <div>
        <vue-markdown>
## Introduction

#### What is AIDA?
AIDA - **A**notate **I**mage **D**ata by **A**ssignment - is a extensible web
application for annotating image data.

#### Getting Started
The best way to get a feel for the application is exploring the [annotation
editor example.](https://alanaberdeen.github.io/AIDA/#/editor/example) Check it out!
        </vue-markdown>


    </div>
</template>

<script>
import VueMarkdown from 'vue-markdown';

export default {
    components: {
        VueMarkdown
    }
}
</script>

<style type="text/css" scoped>
h2 {
    font-size: 2em;
    margin: 0 0 1em;
}

h4 {
    font-size: 20px;
    border-bottom: 1px solid #ddd;
    color: red;
    margin-top: 30px;
}

h5 {
    font-size: 16px;
    color: #1976D2;
    margin: 30px 0px 0px 0px;
}

p {
    line-height: 1.6em;
    padding-top: 5px;
}

tbody tr:nth-child(odd) {
    background-color: rgba(0,0,0,0.05);
}

table {
    margin-top: 20px;
    margin-bottom: 20px;
}

td {
    padding: 5px;
}

a {
    text-decoration: none;
}

</style>
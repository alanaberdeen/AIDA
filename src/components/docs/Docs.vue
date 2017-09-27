<!-- This file handles rendering the documentation for AIDA. The documentaion is
     written in Markdown and compiled via vue-markdown-loader into Vue
     components. -->
<template>
    <div>
     <header>
        <app-toolbar @toggleNav="drawer = !drawer">
        </app-toolbar>
    </header>

    <main>
       <v-container fluid id='docs-container' v-resize="onResize">
            <v-layout row>

                <!-- Documentation navigation -->
                <v-flex id="nav-col" v-show="(drawer)">

                    <h6 id="guide"> Guide </h6>

                    <v-list dense id="nav-list">
                        <v-list-group no-action v-for="item in items" :value="item.active" v-bind:key="item.title">
                            <v-list-tile slot="item" @click="" :to="item.route" exact id="nav-item">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                             </v-list-tile-content>

                            </v-list-tile>
                            <v-list-tile v-for="subItem in item.items" v-bind:key="subItem.title" @click="" id="subItem">
                            <v-list-tile-content>
                                <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                            </v-list-tile-content>
                            </v-list-tile>
                        </v-list-group>
                    </v-list>

                </v-flex>

                <v-flex id="doc-content">

                    <!-- Pass in the relevent part of the documentation -->
                    <router-view></router-view>

                </v-flex>

            </v-layout>
        </v-container>
    </main>
</div>
</template>

<script>
import Toolbar from '../header/DocsToolbar.vue';

export default {
    data () {
      return {

        drawer: true,

        // The navigation, and contents, for the documentation.
        items: [
          {
            title: 'Introduction',
            route: '/docs',
            items: [
                { title: 'What is ADIA?',
                  route: '/docs' },
                { title: 'Getting Started',
                  route: '/docs'}
            ]
          },
          {
            title: 'Editor',
            route: '/docs/editor',
            items: [
              { title: 'Configuration',
                route: '/docs/editor/Configuration' },
              { title: 'Tools',
                route: '' },
              { title: 'Layers',
                route: ''}
            ]
          },
          {
            title: 'API',
            route: '/docs/api',
            items: [
              { title: 'Saving',
                route: '' },
              { title: 'Loading',
                route: ''},
              { title: 'Authenticating',
                route: ''}
            ]
          }
        ]
      }
    },

    mounted() {
      this.onResize()
    },

    methods: {
        onResize() {
            if (window.innerWidth < 600){
                this.drawer = false;
            } else {
                this.drawer = true;
            }
        }
    },

    components: {
        'app-toolbar': Toolbar
    }
}

</script>

<!-- Un-scoped the following styles so that they can easily target the
     markdown content that will be added by Vue-router. -->
<style>
    #docs-container {
        padding: 0px;
        padding-top: 48px;
    }

    #guide {
        margin-left: 16px;
        margin-top: 20px;
        width: 150px;
    }

    #nav-list {
        background: #fafafa;
    }

    #nav-col {
        border-right: 1px solid rgba(0,0,0,0.12);
        height: calc(100vh - 48px);
        flex: 0 1 auto;
    }

    #doc-content {
        padding: 15px;
        height: calc(100vh - 48px);
        overflow-y: auto;
    }

    #subItem {
        padding-left: 35px;
        background: #fafafa;
    }

    #nav-item {
        padding: 0px 16px;
    }

    /* The following styles will be applied to the markdown content that is
       compiled by vue-loader-markdown and injected into the page via
       vue-loader
    */
     h2 {
        font-size: 2em;
        margin: 0 0 1em;
    }

    h4 {
        font-size: 20px;
        margin: 45px 0 0.8em;
        padding-bottom: 0.3em;
        border-bottom: 1px solid #ddd;
    }

    p {
        line-height: 1.6em;
        margin: 1.2em 0 -1.2em;
        padding-bottom: 1.2em;
    }

    tbody tr:nth-child(odd) {
        background-color: rgba(0,0,0,0.05);
    }

    table {
        margin-top: 20px;
        margin-bottom: 20px;
    }

    th {
        padding: 5px;
    }

    td {
        padding: 5px;
    }
</style>
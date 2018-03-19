<!-- This file handles rendering the documentation for AIDA. The documentaion is
     written in Markdown and compiled via vue-markdown-loader into Vue
     components. -->
<template>
  <div>
    <header>
      <app-toolbar @toggleNav="drawer = !drawer"/>
    </header>

    <main>
      <v-container
        v-resize="onResize"
        id="docs-container"
        fluid
      >
        <v-layout row>

          <!-- Documentation navigation -->
          <v-flex
            v-show="(drawer)"
            id="nav-col"
          >

            <h6 id="guide"> Guide </h6>

            <v-list
              id="nav-list"
              dense
            >
              <v-list-group
                v-for="item in items"
                :value="item.active"
                :key="item.title"
                no-action >
                <v-list-tile
                  id="nav-item">
                  slot="item"
                  :to="item.route"
                  exact
                  <v-list-tile-content>
                    <v-list-tile-title>{{ item.title }}</v-list-tile-title>
                  </v-list-tile-content>

                </v-list-tile>
                <v-list-tile
                  v-for="subItem in item.items"
                  id="subItem"
                  :key="subItem.title"
                >
                  <v-list-tile-content>
                    <v-list-tile-title>{{ subItem.title }}</v-list-tile-title>
                  </v-list-tile-content>
                </v-list-tile>
              </v-list-group>
            </v-list>

          </v-flex>

          <v-flex id="doc-content">

            <!-- Pass in the relevent part of the documentation -->
            <router-view/>

          </v-flex>

        </v-layout>
      </v-container>
    </main>
  </div>
</template>

<script>
import Toolbar from '../header/DocsToolbar.vue'

export default {
  components: {
    'app-toolbar': Toolbar
  },
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

  mounted () {
    this.onResize()
  },

  methods: {
    onResize () {
      if (window.innerWidth < 600) {
        this.drawer = false
      } else {
        this.drawer = true
      }
    }
  }
}

</script>

<!-- Un-scoped the following styles so that they can easily target the
 markdown content that will be added by Vue-router. -->
 <style scoped>
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
</style>

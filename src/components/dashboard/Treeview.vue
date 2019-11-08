<template>
  <v-card class="mx-auto">
    <v-sheet class="pa-3 primary lighten-2">
      <v-text-field
        v-model="search"
        label="Search for an image"
        dark
        flat
        solo-inverted
        hide-details
        clearable
        clear-icon="mdi-close-circle-outline"
      ></v-text-field>
      <v-checkbox
        v-model="caseSensitive"
        dark
        hide-details
        label="Case sensitive search"
      ></v-checkbox>
    </v-sheet>
    <v-card-text>
      <v-treeview
        v-model="tree"
        :open="open"
        :items="items"
        :search="search"
        :filter="filter"
        item-key="name"
      >
        <template v-slot:prepend="{ item, open }">
          <v-icon v-if="!item.ext">
            {{ open ? 'mdi-folder-open' : 'mdi-folder' }}
          </v-icon>
          <v-icon v-else>
            {{ files[item.ext] }}
          </v-icon>
        </template>

        <template slot="label" slot-scope="{ item }">
          <router-link
            v-if="!item.children && loadableImageTypes.includes(item.ext)"
            :to="{ name: 'loading', params: { filePath: item.path }}"
          >
            {{item.name}}
          </router-link>
          <span
            v-else-if="!item.children && !loadableImageTypes.includes(item.ext)"
            class='grey--text'
          >
            {{ item.name }}
          </span>
          <span v-else> {{ item.name }} </span>
        </template>

      </v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import { mapState } from 'vuex'

export default {
  data: () => ({
    files: {
      '.html': 'mdi-language-html5',
      '.js': 'mdi-nodejs',
      '.json': 'mdi-json',
      '.md': 'mdi-markdown',
      '.pdf': 'mdi-file-pdf',
      '.png': 'mdi-file-image',
      '.txt': 'mdi-file-document-outline',
      '.xls': 'mdi-file-excel',
      '.dzi': 'mdi-layers-triple',
      '.tif': 'mdi-layers-triple',
      '.tiff': 'mdi-layers-triple',
      '.jpg': 'mdi-file-image',
      '.jpeg': 'mdi-file-image',
      '.ndpi': 'mdi-image-off'
    },
    loadableImageTypes: ['.tif', '.tiff', '.dzi', '.png', '.jpg', '.jpeg'],
    tree: [],
    open: ['public'],
    search: null,
    caseSensitive: false
  }),

  computed: {
    filter () {
      return this.caseSensitive ? (item, search, textKey) => item[textKey].indexOf(search) > -1 : undefined
    },
    ...mapState({
      items: state => state.backend.availableImages
    })
  }
}
</script>

<style scoped>
a {
  text-decoration: none;
}
</style>

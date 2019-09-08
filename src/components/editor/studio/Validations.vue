<template lang="html">
  <div class="elevation-1">
    <v-card class="panel">

      <v-toolbar
        id="toolbar"
        dense
      >
        <v-toolbar-title class="toolBarTitle">
          Validations
        </v-toolbar-title>
      </v-toolbar>

      <v-list id="list" >

        <!-- Number of selected items -->
        <v-list-item>

          <v-list-item-content>
            <v-list-item-title class="faIcons">
              Prediction:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            {{ this.prediction }}
          </v-list-item-action>

        </v-list-item>

        <!-- Fill color -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="faIcons">
              Score:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            {{ this.score }}
          </v-list-item-action>

        </v-list-item>

        <!-- Stroke color -->
        <v-list-item>
          <v-list-item-content>
            <v-list-item-title class="faIcons">
              Weight:
            </v-list-item-title>
          </v-list-item-content>

          <v-list-item-action>
            {{ this.weight }}
          </v-list-item-action>

        </v-list-item>

          <v-list-group no-action>
            <v-list-item
              class="list-hotfix"
              slot="activator"
              no-action
            >
              <v-list-item-content>
                <v-list-item-title
                  class="faIcons">
                  Validation labels
                </v-list-item-title>
              </v-list-item-content>

            </v-list-item>

            <v-list-item
              v-for="(user, index) in users"
              :key="index"
              id="tab-item"
            >
               <v-list-item-content>
                <v-list-item-title
                  class="faIcons">

                  {{user}}

                </v-list-item-title>
              </v-list-item-content>

              <!-- <v-list-item-action>
                {{ this.userValidations[user].length }}
              </v-list-item-action> -->

            </v-list-item>

          </v-list-group>

      </v-list>

      <!-- <div id="val-container">
        <div id="validations"/>
      </div> -->

    </v-card>
  </div>
</template>

<script>
import { mapActions, mapState } from 'vuex'

export default {
  computed: {
    ...mapState({
      selected: state => state.annotation.selectedItems[0]
    }),

    prediction: function () {
      if (this.selected) {
        return this.selected.data.class
      } else {
        return ''
      }
    },

    score: function () {
      if (this.selected) {
        return Math.round(this.selected.data.data.score * 100) / 100
      } else {
        return ''
      }
    },

    weight: function () {
      if (this.selected) {
        return Math.round(this.selected.data.data.validationWeight * 100) / 100
      } else {
        return ''
      }
    },

    validations: function () {
      if (this.selected) {
        return this.selected.data.data.validations
      } else {
        return ''
      }
    },

    users: function () {
      if (this.selected) {
        let users = []
        this.selected.data.data.validations.map(validation => {
          if (!(users.indexOf(validation.user) > -1)) {
            users.push(validation.user)
          }
          return users
        })
        return users
      } else {
        return ''
      }
    },

    userValidations: function () {
      if (this.selected) {
        let userValidations = {}
        this.selected.data.data.validations.map(validation => {
          userValidations[validation.user] = validation
        })
        console.log(userValidations)
        return userValidations
      } else {
        return ''
      }
    }
  },

  methods: {
    ...mapActions({
    })
  }
}
</script>

<style lang='css' scoped>
.panel {
  margin-top: 7px;
  background-color: #eeeeee;
}

.toolBarTitle {
  color: #424242;
}

#toolbar {
  background-color: #e0e0e0;
}

#iconButton {
  color: #616161;
}

#list {
  background-color: #eeeeee;
}

#controls {
  background-color: #f5f5f5;
  border-top: 1px solid #e0e0e0;
}

#tab-items {
  background-color: #fafafa;
}

#tab-item {
  height: 74px;
  padding: 0px 16px;
  background-color: #f5f5f5;
}

#deleteButton {
  margin: 18px 0 0;
}

#val-container {
  width: 100%;
  text-align: center;
  background-color: #eeeeee;
  padding-top: 10px;
}

#validations {
  display: inline-block;
  height: 120px;
  width: 200px;
  background-color: #fafafa;
}
</style>

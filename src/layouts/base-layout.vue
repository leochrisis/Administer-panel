<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <button class="hide-on-drawer-visible" @click="$refs.leftDrawer.open()">
        <i>menu</i>
      </button>
      <q-toolbar-title :padding="1">
      Administation Panel
      </q-toolbar-title>

      <div ref="user-porpove-target" class="primary">
        <gravatar
          :email="loggedUser.email"
          :size="32"
          :circle="true"
        >
        </gravatar>

        <q-popover ref="userPopover" anchor="bottom left" self="top right">
          <div class="list item-delimiter highlight">
            <div
              class="item item-link"
              @click="$refs.userPopover.close()"
            >
              <div class="item-content">Profile</div>
            </div>

            <div
              class="item item-link"
              @click="$refs.userPopover.close()"
            >
              <div class="item-content">Settings</div>
            </div>

            <div
              class="item item-link"
              @click="$refs.userPopover.close()"
            >
              <div class="item-content" v-link="'/logout'">Logout</div>
            </div>
          </div>
        </q-popover>
      </div>
    </div>

    <q-drawer ref="leftDrawer">
      <div class="toolbar light">
        <q-toolbar-title :padding="1">
          Control options
        </q-toolbar-title>
      </div>

      <div class="list no-border platform-delimiter">
        <div class="item item-link drawer-closer" v-link="'/panel'">
          <i class="item-primary">dashboard</i>
          <div class="item-content">
            Dashboard
          </div>
        </div>

        <div class="item item-link drawer-closer" v-link="'/panel/users'">
          <i class="item-primary">face</i>
          <div class="item-content">
            Users
          </div>
        </div>

        <div class="item item-link drawer-closer" v-link="'/panel/projects'">
          <i class="item-primary">group</i>
          <div class="item-content">
            Projects
          </div>
        </div>
      </div>
    </q-drawer>

    <div>
      <router-view>
      </router-view>
    </div>
  </q-layout>
</template>

<script>
  import Gravatar from 'components/gravatar.vue'
  import {mapGetters} from 'vuex'

  export default {
    name: 'BaseLayout',

    components: {Gravatar},

    computed: {
      ...mapGetters(['loggedUser'])
    },

    data: () => ({
      organizations: [],
      users: []
    })
  }
</script>

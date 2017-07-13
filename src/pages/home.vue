<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        Administer validation
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <div class="teste">
        <button class="primary" v-link="'/panel'">
          <i>whatshot</i>
          Begin tests
        </button>
      </div>
    </div>
  </q-layout>
</template>

<style lang="sass">
  .teste
    margin: 20% auto
    text-align: center
</style>

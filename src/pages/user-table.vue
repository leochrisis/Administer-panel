<template>
  <div>
    <q-data-table
      :data="users"
      :config="config"
      :columns="columns"
      @refresh="refresh"
    >
      <template slot="col-username" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-display_name" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-email" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-contact" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-bio" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-location" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-url" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="selection" scope="props">
        <button
          class="primary clear"
          @click="$refs.userEditModal.open(edit(props))"
        >
          <i>edit</i>
        </button>

        <button
          class="negative clear"
          @click="checkIndex(props)"
        >
          <i>delete</i>
        </button>
      </template>
    </q-data-table>

    <q-modal
      ref="userEditModal"
      :content-css="{minWidth: '80vw', minHeight: '80vh'}"
    >
      <user-edit-modal
        :modal="$refs.userEditModal"
        :users="users"
        :index="selectedUserIndex"
        :form="form"
      >
      </user-edit-modal>
    </q-modal>

    <button
      class="primary circular absolute-bottom-left"
      style="margin-left: 10px; margin-bottom: 10px;"
      @click="askUserInformations"
    >
      <i>person_add</i>
    </button>
  </div>
</template>

<script src="./user-table.js"></script>

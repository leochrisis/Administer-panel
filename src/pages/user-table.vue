<template>
  <div>
    <q-data-table
      :data="users"
      :config="config"
      :columns="columns"
      @refresh="refresh"
    >
      <template slot="col-name" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-email" scope="cell">
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
      :content-css="{minWidth: '60vw', minHeight: '60vh'}"
    >
      <user-edit-modal
        :modal="$refs.userEditModal"
        :users="users"
        :index="selectedUserIndex"
        :form="form"
      >
      </user-edit-modal>
    </q-modal>
  </div>
</template>

<script src="./user-table.js"></script>

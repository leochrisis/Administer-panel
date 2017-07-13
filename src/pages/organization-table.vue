<template>
  <div>
    <q-data-table
      :data="organizations"
      :config="config"
      :columns="columns"
      @refresh="refresh"
    >
      <template slot="col-name" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-display_name" scope="cell">
        <span>{{cell.data}}</span>
      </template>

      <template slot="col-private" scope="cell">
        <span v-if="cell.data === true" class="label text-white bg-primary">
          Yes
        </span>
        <span v-else class="label text-white bg-negative">No</span>
      </template>

      <template slot="selection" scope="props">
        <button
          class="primary clear"
          @click="$refs.organizationEditModal.open(edit(props))"
        >
          <i>edit</i>
        </button>
        <button
          class="negative clear"
          @click="confirmDeleteOrganization"
        >
          <i>delete</i>
        </button>
      </template>
    </q-data-table>

    <q-modal
      ref="organizationEditModal"
      :content-css="{minWidth: '80vw', minHeight: '80vh'}"
    >
      <organization-edit-modal
        :modal="$refs.organizationEditModal"
        :organizations="organizations"
        :members="members"
        :index="selectedOrganizationIndex"
        :form="form"
      >
      </organization-edit-modal>
    </q-modal>
  </div>
</template>

<script src="./organization-table.js"></script>

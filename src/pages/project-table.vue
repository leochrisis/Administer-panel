<template>
<div>
  <div>
    <q-data-table
      :data="projects"
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
          @click="$refs.projectEditModal.open(edit(props))"
        >
          <i>edit</i>
        </button>

        <button
          class="negative clear"
          @click="confirmDeleteProject"
        >
          <i>delete</i>
        </button>
      </template>
    </q-data-table>
  </div>

  <q-modal
    ref="projectEditModal"
    :content-css="{minWidth: '80vw', minHeight: '80vh'}"
  >
    <project-edit-modal
      :modal="$refs.projectEditModal"
      :projects="projects"
      :members="members"
      :index="selectedProjectIndex"
      :form="form"
    >
    </project-edit-modal>
  </q-modal>
</div>
</template>

<script src="./project-table.js"></script>

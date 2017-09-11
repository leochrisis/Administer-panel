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

      <template slot="col-organization" scope="cell">
        <span v-if="cell.data">
          <span>{{cell.data}}</span>
        </span>
        <span v-else>Not specified</span>
      </template>

       <template slot="col-manager_id" scope="cell">
        <div v-for="user in users">
          <span v-if="user.id === cell.data">{{user.name}}</span>
        </div>
      </template>

      <template slot="col-po_id" scope="cell">
        <div v-for="user in users">
          <span v-if="user.id === cell.data">{{user.name}}</span>
        </div>
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
    @close="refresh"
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

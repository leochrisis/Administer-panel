import {Dialog, Utils, Loading, Toast} from 'quasar'
import projectEditModal from './modal/project-edit.vue'
import axios from 'utils/axios'

export default{
  name: 'ProjectTable',

  components: {projectEditModal},

  data: () => ({
    loading: false,
    selectedProjectIndex: null,
    users: [],
    projects: [],
    members: [],
    edition: false,
    form: {},
    config: {
      rowHeight: '50px',
      title: 'Projects',
      noHeader: false,
      refresh: false,
      columnPicker: true,
      leftStickyColumns: 0,
      rightStickyColumns: 0,
      bodyStyle: {
        maxHeight: '500px'
      },
      responsive: true,
      pagination: {
        rowsPerPage: 15,
        options: [5, 10, 15, 30, 50, 500]
      },
      selection: 'single',
      messages: {
        noData: '<i>warning</i> No data available to show.',
        noDataAfterFiltering: '<i>warning</i> No results. Please refine your search terms.'
      },
      labels: {
        columns: 'Display columns',
        allCols: 'Search from all',
        rows: 'Rows',
        selected: {
          singular: 'item selected.'
        },
        clear: 'Go back'
      }
    },

    columns: [
      {
        label: 'Name',
        field: 'name',
        width: '40px',
        filter: true,
        sort: true
      },

      {
        label: 'organization',
        field: 'organization',
        width: '40px',
        sort: true
      },

      {
        label: 'Manager',
        field: 'manager_id',
        width: '40px',
        filter: true,
        sort: true
      },

      {
        label: 'Product Owner',
        field: 'po_id',
        width: '40px',
        filter: true,
        sort: true
      }
    ],

    pagination: true,
    rowHeight: 50,
    bodyHeightProp: 'maxHeight',
    bodyHeight: 500
  }),

  created () {
    axios.get('/users')
    .then(this.handleUsersLoaded)
    .catch(this.handleUsersLoadError)

    axios.get('/projects')
    .then(this.handleProjectsLoaded)
    .catch(function (error) {
      console.log(error)
    })
  },

  methods: {
    refresh () {
      axios.get('admin/projects')
      .then(this.handleProjectsLoaded)
      .catch(function (error) {
        console.log(error)
      })
    },

    handleUsersLoaded (response) {
      this.users = response.data
    },

    handleUsersLoadError (error) {
      console.log(error)
    },

    handleProjectsLoaded (response) {
      this.projects = response.data
    },

    edit (props) {
      this.edition = true
      this.checkIndex(props)
    },

    checkIndex (props) {
      if (this.edition) {
        props.rows.forEach(row => {
          this.selectedProjectIndex = row.index
        })
        this.form = Object.assign({}, this.projects[this.selectedProjectIndex])

        axios.get(`admin/projects/${this.form.id}/members/`)
          .then(this.handleMembers)
          .catch(this.handleMembersFail)
      }
      else {
        props.rows.forEach(row => {
          this.selectedProjectIndex = row.index
        })
        this.confirmDeleteProject()
      }
    },

    handleMembers (response) {
      this.members = response.data
    },

    handleMembersFail () {
      Toast.create.negative('Fail on charge organization members')
    },

    confirmDeleteProject () {
      Dialog.create({
        title: 'Delete project?',
        message: "You can't undo an deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: this.deleteProject
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    deleteProject () {
      if (this.loading) {
        return
      }

      Loading.show({
        delay: 0,
        message: 'Deleting'
      })
      this.loading = true

      axios.delete(`admin/projects/${this.projects[this.selectedProjectIndex].id}`)
        .then(this.handleDeleted)
        .catch(this.handleDeleteFail)
    },

    handleDeleted () {
      Toast.create.positive('Deleted project successfully')

      this.loading = false
      Loading.hide()
      this.refresh()
    },

    handleDeleteFail () {
      Toast.create.negative('Failed to delete project')

      this.loading = false
      Loading.hide()
    },

    closeModal () {
      this.refresh()
    }
  },

  watch: {
    pagination (value) {
      if (!value) {
        this.oldPagination = Utils.clone(this.config.pagination)
        this.config.pagination = false
        return
      }
      this.config.pagination = this.oldPagination
    }
  }
}

import {Dialog, Utils, Loading, Toast} from 'quasar'
import projectEditModal from './modal/project-edit.vue'
import axios from 'utils/axios'

export default{
  name: 'UserTable',

  components: {projectEditModal},

  data: () => ({
    loading: false,
    admin: {
      email: 'leonardo.chfc@gmail.com',
      name: 'leochrisis',
      display_name: '@leochrisis'
    },
    selectedProjectIndex: null,
    projects: [],
    members: [],
    organizations: [],
    edition: false,
    form: {},
    config: {
      rowHeight: '50px',
      title: 'Projects',
      noHeader: false,
      refresh: true,
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
        label: 'Display_name',
        field: 'display_name',
        width: '40px',
        filter: true,
        sort: true
      },

      {
        label: 'Private',
        field: 'private',
        width: '60px',
        sort: true
      }
    ],

    pagination: true,
    rowHeight: 50,
    bodyHeightProp: 'maxHeight',
    bodyHeight: 500
  }),

  created () {
    axios.get('/organizations')
    .then(this.handleOrganizationsLoaded)
    .catch(this.handleOrganizationsLoadError)

    axios.get('/projects')
    .then(this.handleProjectsLoaded)
    .catch(function (error) {
      console.log(error)
    })
  },

  methods: {
    refresh () {
      axios.get('/projects')
      .then(this.handleProjectsLoaded)
      .catch(function (error) {
        console.log(error)
      })
    },

    handleOrganizationsLoaded (response) {
      this.organizations = response.data
    },

    handleOrganizationsLoadError (error) {
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

        axios.get(`/organizations/${this.form.id}/members/`)
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

      axios.delete(`/projects/${this.projects[this.selectedProjectIndex].id}`)
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

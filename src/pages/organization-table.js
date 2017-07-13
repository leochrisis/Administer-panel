import {Dialog, Utils, Loading, Toast} from 'quasar'
import organizationEditModal from './modal/organization-edit.vue'
import axios from 'utils/axios'

export default {
  name: 'OrganizationTable',

  components: {organizationEditModal},

  data: () => ({
    loading: false,
    admin: {
      email: 'leonardo.chfc@gmail.com',
      name: 'leochrisis',
      display_name: '@leochrisis'
    },
    organizations: [],
    members: [],
    selectedOrganizationIndex: null,
    edition: false,
    form: {},
    config: {
      rowHeight: '50px',
      title: 'Organizations',
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
        label: 'Display name',
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
    .then(this.handleSucess)
    .catch(this.handleFail)
  },

  methods: {
    refresh (done) {
      this.timeout = setTimeout(() => {
        done()
      }, 100)

      axios.get('/organizations')
      .then(this.handleSucess)
      .catch(this.handleFail)
    },

    handleSucess (response) {
      this.organizations = response.data
    },

    handleFail (error) {
      Loading.hide()
      Toast.create.negative(
        error.response.data.errors.name
          .map(msg => 'Name ' + msg)
          .join('\n'))
    },

    edit (props) {
      this.edition = true
      this.checkIndex(props)
    },

    checkIndex (props) {
      if (this.edition) {
        props.rows.forEach(row => {
          this.selectedOrganizationIndex = row.index
        })
        this.form = Object.assign({}, this.organizations[this.selectedOrganizationIndex])

        axios.get(`/organizations/${this.form.id}/members/`)
          .then(this.handleMembers)
          .catch(this.handleMembersFail)
      }
      else {
        props.rows.forEach(row => {
          this.selectedOrganizationIndex = row.index
        })
        this.confirmDeleteOrganization()
      }
    },

    handleMembers (response) {
      this.members = response.data
    },

    handleMembersFail () {
      Toast.create.negative('Fail on charge organization members')
    },

    confirmDeleteOrganization () {
      Dialog.create({
        title: 'Delete organization?',
        message: "You can't undo an deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: this.deleteOrganization
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    deleteOrganization () {
      if (this.loading) {
        return
      }

      Loading.show({
        delay: 0,
        message: 'Deleting'
      })
      this.loading = true

      axios.delete(`/organizations/${this.organizations[this.selectedOrganizationIndex].id}`)
        .then(this.handleDeleted)
        .catch(this.handleDeleteFail)
    },

    handleDeleted () {
      Toast.create.positive('Deleted organization successfully')

      this.loading = false
      Loading.hide()
      this.refresh()
    },

    handleDeleteFail () {
      Toast.create.negative('Failed to delete organization')

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

import {Dialog, Loading, Toast, Utils} from 'quasar'
import {mapGetters} from 'vuex'
import userEditModal from './modal/user-edit.vue'
import axios from 'utils/axios'

export default{
  name: 'UserTable',

  components: {userEditModal},

  data: () => ({
    loading: false,
    users: [],
    edition: false,
    form: {},
    selectedUserIndex: null,
    config: {
      rowHeight: '50px',
      title: 'Users',
      noHeader: false,
      columnPicker: true,
      leftStickyColumns: 1,
      rightStickyColumns: 0,
      bodyStyle: {
        maxHeight: '500px'
      },
      responsive: true,
      pagination: {
        rowsPerPage: 15,
        options: [5, 10, 15, 30, 50]
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
        sort: true,
        format (value) {
          return new Date(value).toLocaleString()
        }
      },

      {
        label: 'Email',
        field: 'email',
        width: '60px',
        filter: true,
        sort: true,
        format (value) {
          return new Date(value).toLocaleString()
        }
      }
    ],

    pagination: true,
    rowHeight: 50,
    bodyHeightProp: 'maxHeight',
    bodyHeight: 500
  }),

  computed: {
    ...mapGetters(['loggedUser'])
  },

  created () {
    Loading.show({
      message: 'Loading users data',
      delay: 0
    })

    axios.get('/users')
    .then(this.handleSucess)
    .catch(this.handleFail)

    Loading.hide()
  },

  methods: {
    refresh () {
      axios.get('/users')
      .then(this.handleSucess)
      .catch(this.handleFail)
    },

    handleSucess (response) {
      this.users = response.data
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
          this.selectedUserIndex = row.index
        })
        this.form = Object.assign({}, this.users[this.selectedUserIndex])
        this.edition = false
      }
      else {
        props.rows.forEach(row => {
          this.selectedUserIndex = row.index
        })
        this.confirmDeleteUser()
      }
    },

    confirmDeleteUser () {
      Dialog.create({
        title: 'Delete this user?',
        message: "You can't undo an deletion!",
        buttons: [
          {
            label: 'Confirm',
            classes: 'negative',
            handler: this.deleteUser
          },

          {
            label: 'Cancel',
            classes: 'positive clear'
          }
        ]
      })
    },

    deleteUser () {
      if (this.loading) {
        return
      }

      Loading.show({
        delay: 0,
        message: 'Deleting'
      })
      this.loading = true

      axios.delete(`/users/${this.users[this.selectedUserIndex].id}`)
        .then(this.handleDeleted)
        .catch(this.handleDeleteFail)
    },

    handleDeleted () {
      Toast.create.positive('Deleted user successfull')

      this.loading = false
      Loading.hide()
      this.refresh()
    },

    handleDeleteFail () {
      Toast.create.negative('Failed to delete user')

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

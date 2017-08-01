import {Dialog, Loading, Toast, Utils} from 'quasar'
import userEditModal from './modal/user-edit.vue'
import axios from 'utils/axios'

export default{
  name: 'UserTable',

  components: {userEditModal},

  data: () => ({
    loading: false,
    admin: {
      email: 'leonardo.chfc@gmail.com',
      name: 'leochrisis',
      display_name: '@leochrisis'
    },
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
        field: 'username',
        width: '40px',
        filter: true,
        sort: true,
        format (value) {
          return new Date(value).toLocaleString()
        }
      },

      {
        label: 'Display name',
        field: 'display_name',
        width: '50px',
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
      },

      {
        label: 'Contact',
        field: 'contact',
        width: '50px',
        filter: true,
        format (value) {
          return new Date(value).toLocaleString()
        }
      },

      {
        label: 'Bio',
        field: 'bio',
        width: '60px',
        filter: true,
        format (value) {
          return new Date(value).toLocaleString()
        }
      },

      {
        label: 'Location',
        field: 'location',
        width: '60px',
        filter: true,
        format (value) {
          return new Date(value).toLocaleString()
        }
      },

      {
        label: 'Url',
        field: 'url',
        width: '40px',
        filter: true,
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

    askUserInformations () {
      Dialog.create({
        title: 'Creating user',
        form: {
          username: {
            type: 'textbox',
            label: 'Username',
            model: ''
          },
          password: {
            type: 'password',
            label: 'Password',
            model: ''
          },
          password_confirmation: {
            type: 'password',
            label: 'Confirm Password',
            model: ''
          },
          email: {
            type: 'textbox',
            label: 'Email',
            model: ''
          }
        },
        buttons: [
          'Cancel',
          {
            label: 'Create',
            classes: 'positive',
            handler: this.createUser
          }
        ]
      })
    },
    createUser ({username, password, password_confirmation, email}) {
      Loading.show({
        message: 'Creating account',
        delay: 0
      })
      axios.post('/users', {data: {username, password, password_confirmation, email}})
        .then(this.handleUserCreated)
        .catch(this.handleUserCreationFail)
    },
    handleUserCreated (response) {
      Loading.hide()
      this.refresh()
      Toast.create.positive('Created user successfully')
    },
    handleUserCreationFail (error) {
      Loading.hide()
      Toast.create.negative('Check user informations and try again')
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

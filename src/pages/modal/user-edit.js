import {Loading, Toast} from 'quasar'
import axios from 'utils/axios'

export default {
  name: 'userEditModal',

  props: {
    modal: Object,
    users: Array,
    index: Number,
    form: Object
  },

  data: () => ({
    loading: false,
    errors: {
      name: [],
      email: []
    }
  }),

  computed: {
    user () {
      if (this.index === null) {
        return false
      }

      return this.users[this.index]
    }
  },

  methods: {
    update () {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Updating account',
        delay: 0
      })

      const {name, email} = this.form

      axios.put(`admin/users/${this.user.id}`, {
        data: {name, email}
      })
        .then(this.handleEdited)
        .catch(this.handleEditFail)
    },

    handleEdited (response) {
      Toast.create.positive('Updated user successfully')

      this.loading = false
      Loading.hide()

      Object.assign(this.user, response.data)
    },

    handleEditFail (error) {
      Loading.hide()
      Toast.create.negative('Failed to Upadate')

      const errors = error.response.data.errors
      this.errors = {
        display_name: errors.name || [],
        email: errors.email || []
      }
      this.loading = false
    },

    closeModal () {
      this.errors.name = []
      this.errors.email = []
    }
  }
}

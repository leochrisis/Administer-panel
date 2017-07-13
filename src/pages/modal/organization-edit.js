import {Loading, Toast} from 'quasar'
import Gravatar from 'components/gravatar.vue'
import axios from 'utils/axios'

export default {
  name: 'organizationEditModal',

  components: {Gravatar},

  props: {
    modal: Object,
    organizations: Array,
    members: Array,
    index: Number,
    form: Object
  },

  computed: {
    organization () {
      if (this.index === null) {
        return false
      }

      return this.organizations[this.index]
    }
  },

  data: () => ({
    loading: false,
    memberToAdd: '',
    errors: {
      name: [],
      display_name: []
    }
  }),

  methods: {
    edit () {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        delay: 0,
        message: 'Updating'
      })

      const {name, display_name, private: isPrivate} = this.form

      axios.put(`/organizations/${this.organization.id}`, {
        data: {name, display_name, private: isPrivate}
      })
        .then(this.handleEdited)
        .catch(this.handleEditFail)
    },

    handleEdited (response) {
      Toast.create.positive('Updated organization successfully')

      this.loading = false
      Loading.hide()

      Object.assign(this.organization, response.data)
    },

    handleEditFail (error) {
      Loading.hide()
      Toast.create.negative('Failed to Upadate')

      const errors = error.response.data.errors
      this.errors = {
        name: errors.name || [],
        display_name: errors.display_name || []
      }
      this.loading = false
    },

    closeModal () {
      this.errors.name = []
      this.errors.display_name = []
    },

    searchMembers (query, done) {
      axios.get(`/users?search[username]=${query}`)
        .then(({data}) =>
          data
          .filter(user =>
            !this.members.some(member => member.user.id === user.id)
          )
          .map(user => ({
            value: user.username,
            label: user.display_name,
            secondLabel: user.username,
            stamp: user.id
          }))
        )
        .then(done)
        .catch(() => done([]))
    },

    addMember ({stamp: id}) {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Adding member',
        delay: 0
      })

      axios.post(`/organizations/${this.organization.id}/members/`, {
        data: {user_id: id}
      })
        .then(this.handleMemberAdded)
        .catch(this.handleMemberAddFail)
    },

    handleMemberAdded (response) {
      this.loading = false
      Loading.hide()
      this.memberToAdd = ''

      Toast.create.positive('Member added')
      this.members.push(response.data)
    },

    handleMemberAddFail (error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to add member')
    },

    /* Role Update */
    updateRole (member, role) {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Updating role',
        delay: 0
      })

      axios.put(`/organizations/${this.organization.id}/members/${member.user.id}`, {
        data: {role}
      })
        .then((response) => this.handleRoleUpdated(member, response))
        .catch(this.handleRoleUpdateFail)
    },

    handleRoleUpdated (member, response) {
      this.loading = false
      Loading.hide()

      Toast.create.positive('Role updated')
      Object.assign(member, response.data)
    },

    handleRoleUpdateFail (error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to update role')
    },

    /* Member Remove */
    removeMember (member, index) {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        message: 'Removing member',
        delay: 0
      })

      axios.delete(`/organizations/${this.organization.id}/members/${member.user.id}`)
        .then(() => this.handleMemberRemoved(member.user.id))
        .catch(this.handleMemberRemoveFail)
    },

    handleMemberRemoved (userId) {
      this.loading = false
      Loading.hide()

      Toast.create.positive('Member removed')
      this.members = this.members.filter(member => member.user.id != userId)
    },

    handleMemberRemoveFail (error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to remove member')
    }
  }
}

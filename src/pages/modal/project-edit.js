import {Loading, Toast} from 'quasar'
import Gravatar from 'components/gravatar.vue'
import axios from 'utils/axios'

export default {
  name: 'projectEditModal',

  components: {Gravatar},

  props: {
    modal: Object,
    projects: Array,
    members: Array,
    index: Number,
    form: Object
  },

  computed: {
    project () {
      if (this.index === null) {
        return false
      }

      return this.projects[this.index]
    },

    hasPo () {
      return this.members
        .filter(member => member.role === 'po')
        .length
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
    update () {
      if (this.loading) {
        return
      }

      this.loading = true
      Loading.show({
        delay: 0,
        message: 'Updating'
      })

      const {name, display_name, votation_time, private: isPrivate} = this.form

      axios.put(`/projects/${this.project.id}`, {
        data: {name, display_name, votation_time, private: isPrivate}
      })
        .then(this.handleEdited)
        .catch(this.handleEditFail)
    },

    handleEdited (response) {
      Toast.create.positive('Updated project successfully')

      this.loading = false
      Loading.hide()

      Object.assign(this.project, response.data)
      this.form = response.data
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
      this.memberToAdd = ''
    },

    searchMembers (query, done) {
      axios.get(`/organizations/${this.project.organization_id}/members`)
        .then(({data}) =>
          data
          .filter(({user}) =>
            !this.members.some(member => member.user.id === user.id)
          )
          .filter(({user}) =>
            user.username.indexOf(query) !== -1 ||
            user.display_name.indexOf(query) !== -1
          )
          .map(({user}) => ({
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

      axios.post(`/projects/${this.project.id}/members/`, {
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

      axios.put(`/projects/${this.project.id}/members/${member.user.id}`, {
        data: {role}
      })
        .then((response) => this.handleRoleUpdated(member, response))
        .catch(this.handleRoleUpdateFail)
    },

    handleRoleUpdated (member, response) {
      this.loading = false
      Loading.hide()

      Toast.create.positive('Role updated')
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

      axios.delete(`/projects/${this.project.id}/members/${member.user.id}`)
        .then(() => this.handleMemberRemoved(member.user.id))
        .catch(this.handleMemberRemoveFail)
    },

    handleMemberRemoved (userId) {
      this.loading = false
      Loading.hide()

      Toast.create.positive('Member removed')
      this.members = this.members.filter(member => member.user.id !== userId)
    },

    handleMemberRemoveFail (error) {
      this.loading = false
      Loading.hide()

      Toast.create.negative('Failed to remove member')
    }
  }
}

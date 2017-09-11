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
      return !!this.project.po_id
    }
  },

  data: () => ({
    loading: false,
    memberToAdd: '',
    errors: {
      name: []
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

      const {name, organization, votation_time} = this.form

      axios.put(`admin/projects/${this.project.id}`, {
        data: {name, organization, votation_time}
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
        name: errors.name || []
      }
      this.loading = false
    },

    closeModal () {
      this.errors.name = []
      this.memberToAdd = ''
    },

    searchMembers (query, done) {
      axios.get(`/users`)
        .then(({data}) =>
          data
          .filter((user) =>
            !this.members.some(member => member.id === user.id)
          )
          .filter((user) =>
            user.name.indexOf(query) !== -1 ||
            user.email.indexOf(query) !== -1
          )
          .map((user) => ({
            value: user.id,
            label: user.name,
            secondLabel: user.email,
            stamp: user.id
          }))
        )
        .then(done)
        .catch(() => done([]))
    },

    addMember ({stamp: id}) {
      Loading.show({
        message: 'Adding member',
        delay: 0
      })

      axios.post(`admin/projects/${this.project.id}/members/`, {
        data: {user_id: id}
      })
        .then(this.handleMemberAdded)
        .catch(this.handleMemberAddFail)
    },

    handleMemberAdded ({data}) {
      Loading.hide()
      this.memberToAdd = ''
      Toast.create.positive('Member added')
      this.members.push(data)
    },

    handleMemberAddFail () {
      Loading.hide()
      Toast.create.negative('Failed to add member')
    },

    /* Role Update */
    updateRole (member, role) {
      const data = {[`${role}_id`]: member.id}

      axios.put(`admin/projects/${this.project.id}`, {data})
        .then(() => Toast.create.positive('Role updated'))
        .catch(() => Toast.create.negative('Failed to update role'))
    },

    revokeRole (member, role) {
      const data = {[`${role}_id`]: null}

      axios.put(`admin/projects/${this.project.id}`, data)
        .then(() => Toast.create.positive('Role updated'))
        .catch(() => Toast.create.negative('Failed to update role'))
    },

    /* Member Remove */
    removeMember (member) {
      Loading.show({
        message: 'Removing member',
        delay: 0
      })

      axios.delete(`admin/projects/${this.project.id}/members/${member.id}`)
        .then(() => this.handleMemberRemoved(member.id))
        .catch(this.handleMemberRemoveFail)
    },

    handleMemberRemoved (userId) {
      Loading.hide()
      Toast.create.positive('Member removed')
      this.members = this.members.filter(member => member.id !== userId)
    },

    handleMemberRemoveFail () {
      Loading.hide()
      Toast.create.negative('Failed to remove member')
    },

    isPo (member) {
      return member.id === this.project.po_id
    },

    isManager (member) {
      return member.id === this.project.manager_id
    }
  }
}

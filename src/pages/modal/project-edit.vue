<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close(closeModal)">
          <i>keyboard_arrow_left</i>
        </button>

        Editing project
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <template>
        <div ref="tab-project-edit">
          <form @submit.prevent="edit">
            <div class="list">
              <div class="item multiple-lines">
                <div class="item-content">
                  <div class="floating-label">
                    <input required autofocus class="full-width" v-model="form.name">
                    <label>Name</label>
                  </div>
                </div>
              </div>

              <hr>

              <div class="item multiple-lines">
                <div class="item-content">
                  <div class="floating-label">
                    <input required class="full-width" v-model="form.display_name">
                    <label>Display Name</label>
                  </div>
                </div>
              </div>

              <div class="item multiple-lines">
                <div class="item-content">
                  <span class="item-label">Votation time (min): </span>
                  <q-numeric
                    v-model="form.votation_time"
                    :min="1"
                    :max="100"
                  >
                  </q-numeric>
                </div>
              </div>

              <hr>

              <label class="item two-lines">
                <div class="item-content has-secondary">
                  <div>Is this project private?</div>
                  <div>Visible only to members</div>
                </div>

                <div class="item-secondary">
                  <q-toggle v-model="form.private"></q-toggle>
                </div>
              </label>

              <hr>

              <div class="item multiple-lines">
                <div class="item-content">
                  <button type="submit" class="primary" @click="update">Update</button>
                  <button type="button" class="negative">Delete</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        <div ref="tab-project-members">
          <p>
            <q-autocomplete
              v-model="memberToAdd"
              :delay="0"
              @search="searchMembers"
              @selected="addMember"
            >
              <q-search v-model="memberToAdd"></q-search>
            </q-autocomplete>
          </p>

            <div class="list">
              <div v-for="(member, index) in members" :key="`org-member-${member.user_id}`" class="item two-lines">
                <gravatar :email="member.user.email" :circle="true" :size="48" class="item-primary"></gravatar>

                <div class="item-content has-secondary">
                  <div>{{member.user.display_name}}</div>

                  <template>
                    <div v-if="member.role === 'po'">
                      <i>person</i> Product Owner
                    </div>

                    <div v-else-if="member.role === 'manager'">
                      <i>person_outline</i> Manager
                    </div>

                    <div v-else>
                      <i>group</i> Team Member
                    </div>
                  </template>
                </div>

                <div class="item-secondary">
                  <i slot="target">
                    more_vert
                    <q-popover ref="memberPopover">
                      <div class="list" @click="$refs.memberPopover[index].close()">
                        <div v-if="hasPo === 0">
                          <div
                            v-if="member.role !== 'po'"
                            class="item item-link"
                            @click="updateRole(member, 'po')"
                          >
                            <div class="item-content">Grant Product Owner</div>
                          </div>
                        </div>

                        <div
                          v-if="member.role !== 'team'"
                          class="item item-link"
                          @click="updateRole(member, 'team')"
                        >
                          <div class="item-content">Grant Team Member</div>
                        </div>

                        <div class="item item-link" @click="removeMember(member, index)">
                          <div class="item-content">Remove</div>
                        </div>
                      </div>
                    </q-popover>
                  </i>
                </div>
              </div>
            </div>
          </div>
      </template>
    </div>

    <div slot="footer" class="toolbar">
      <q-tabs
        :refs="$refs"
        default-tab="tab-project-edit"
      >
        <q-tab name="tab-project-edit" icon="edit">
          Edit
        </q-tab>
        <q-tab name="tab-project-members" icon="group">
          Members
        </q-tab>
      </q-tabs>
    </div>
  </q-layout>
</template>

<script src="./project-edit.js"></script>

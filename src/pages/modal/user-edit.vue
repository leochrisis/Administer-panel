<template>
  <q-layout>
    <div slot="header" class="toolbar">
      <q-toolbar-title :padding="1">
        <button @click="modal.close(closeModal)">
          <i>keyboard_arrow_left</i>
        </button>

        Editing user
      </q-toolbar-title>
    </div>

    <div class="layout-view">
      <form>
        <div class="list">
          <div class="item multiple-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input required autofocus class="full-width" v-model="form.display_name">
                <label>Username</label>
              </div>
              <ul>
                <li v-for="error in errors.display_name" class="text-negative">
                  {{error}}
                </li>
              </ul>
            </div>
          </div>

          <hr/>

          <div class="item multiple-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input required autofocus class="full-width" v-model="form.email">
                <label>Email</label>
              </div>
              <ul>
                <li v-for="error in errors.email" class="text-negative">
                  {{error}}
                </li>
              </ul>
            </div>
          </div>

          <div class="item multiple-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input class="full-width" v-model="form.bio">
                <label>Bio</label>
              </div>
            </div>
          </div>

          <div class="item multiple-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input class="full-width" v-model="form.contact">
                <label>Contact</label>
              </div>
            </div>
          </div>

          <div class="item multiple-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input class="full-width" v-model="form.location">
                <label>Locate</label>
              </div>
            </div>
          </div>

          <div class="item multiple-lines">
            <div class="item-content">
              <div class="stacked-label">
                <input class="full-width" v-model="form.url">
                <label>Url</label>
              </div>
            </div>
          </div>

          <div class="item multiple-lines">
            <div class="item-content">
              <button type="submit" class="primary" @click="update">Update</button>
              <button type="button" @click="modal.close(closeModal)">Cancel</button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </q-layout>
</template>

<script src="./user-edit.js"></script>

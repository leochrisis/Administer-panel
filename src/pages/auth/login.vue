<template>
  <one-box-layout>
    <span slot="title">Admin validation</span>

    <form @submit.prevent="login">
      <p>
        <div class="floating-label">
          <input required class="full-width" v-model="email">
          <label>Email</label>
        </div>
      </p>

      <p>
        <div class="floating-label">
          <input type="password" required class="full-width" v-model="password">
          <label>Password</label>
        </div>
      </p>

      <p>
        <div class="flex">
          <button type="submit" class="primary" @click="login">
            Login
          </button>

          <button>
            Cancel
          </button>
        </div>
      </p>
    </form>
  </one-box-layout>
</template>

<script src="./login.js"></script>

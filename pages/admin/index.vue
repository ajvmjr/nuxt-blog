<template>
  <div class="admin-page">
    <section class="new-post">
      <AppButton @click="$router.push('/admin/new-post')"
        >Create post</AppButton
      >
      <AppButton style="margin-left: 10px" @click="onLogout">Logout</AppButton>
    </section>
    <section class="existing-posts">
      <h1>Existing post</h1>
      <PostList isAdmin :posts="loadedPosts" />
    </section>
  </div>
</template>

<script>
export default {
  middleware: ['check-auth', 'auth'],
  layout: 'admin',
  computed: {
    loadedPosts() {
      return this.$store.getters.loadedPosts
    },
  },
  methods: {
    onLogout() {
      this.$store.dispatch('logout')
      this.$router.push('/admin/auth')
    },
  },
}
</script>

<style scoped>
.admin-page {
  padding: 20px;
}

.new-post {
  text-align: center;
  border-bottom: 2px solid #ccc;
  padding-bottom: 10px;
}

.existing-posts h1 {
  text-align: center;
}
</style>

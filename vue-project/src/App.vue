<template>
  <TolgeeProvider>
    <template v-slot:fallback>
      <div style="display: flex; justify-content: center; align-items: center; height: 100vh;">
        <div>Loading translations...</div>
      </div>
    </template>
    <router-view />
  </TolgeeProvider>
</template>

<script>
import { TolgeeProvider } from '@tolgee/vue'

export default {
  name: 'App',
  components: {
    TolgeeProvider
  }
}
</script>

<style>
#app {
  min-height: 100vh;
}
</style>
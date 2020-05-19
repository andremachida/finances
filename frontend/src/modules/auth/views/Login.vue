<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm6>
        <v-card class="elevation-12">
          <v-toolbar color="primary" dark>
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                prepend-icon="email"
                name="email"
                label="Email"
                type="email" />
              <v-text-field
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password" />
            </v-form>
            <v-btn block depressed>
              Create Account
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" large>
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
export default {
  name: 'Login'
}
</script>

<style lang="scss" scoped>

</style>

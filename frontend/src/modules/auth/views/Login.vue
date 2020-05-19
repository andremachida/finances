<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm6>
        <v-card class="elevation-12">
          <v-toolbar color="primary">
            <v-toolbar-title>Login</v-toolbar-title>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-model.trim="$v.user.email.$model"
                prepend-icon="email"
                name="email"
                label="Email"
                type="email"
                :error-messages="emailErrors"
                :success="!$v.user.email.$invalid" />
              <v-text-field
                v-model="$v.user.password.$model"
                prepend-icon="lock"
                name="password"
                label="Password"
                type="password"
                :error-messages="passwordErrors"
                :success="!$v.user.password.$invalid" />
            </v-form>
            <v-btn block depressed>
              Create Account
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="$v.$invalid"
              color="primary"
              large
              @click="submit">
              Login
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
export default {
  name: 'Login',
  computed: {
    emailErrors () {
      const errors = []
      const email = this.$v.user.email

      if (!email.$dirty) {
        return errors
      }

      !email.required && errors.push('Email Required.')
      !email.email && errors.push('Email Invalid.')

      return errors
    },
    passwordErrors () {
      const errors = []
      const password = this.$v.user.password

      if (!password.$dirty) {
        return errors
      }

      !password.required && errors.push('Password Required.')
      !password.minLength && errors.push(`Insert at Least ${password.$params.minLength.min} Characters`)

      return errors
    }
  },
  data () {
    return {
      user: {
        email: '',
        password: ''
      }
    }
  },
  validations: {
    user: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(3)
      }
    }
  },
  methods: {
    submit () {
      console.log(this.user)
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

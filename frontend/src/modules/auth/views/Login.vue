<template>
  <v-container fill-height>
    <v-layout justify-center align-center>
      <v-flex xs12 sm6>
        <v-card class="elevation-12">
          <v-toolbar color="primary">
            <v-toolbar-title>{{ texts.toolbar }}</v-toolbar-title>
            <v-spacer></v-spacer>
            <v-progress-circular indeterminate
              v-show="isLoading"
              color="white"
              width="2"></v-progress-circular>
          </v-toolbar>
          <v-card-text>
            <v-form>
              <v-text-field
                v-if="!isLogin"
                v-model.trim="$v.user.name.$model"
                prepend-icon="person"
                name="name"
                label="Name"
                type="text"
                :error-messages="nameErrors"
                :success="!$v.user.name.$invalid" />
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
            <v-btn block depressed
              @click="isLogin = !isLogin">
              {{ texts.button }}
            </v-btn>
          </v-card-text>
          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn
              :disabled="$v.$invalid"
              color="primary"
              large
              @click="submit">
              {{ texts.toolbar }}
            </v-btn>
          </v-card-actions>
        </v-card>
      </v-flex>
    </v-layout>
  </v-container>
</template>

<script>
import { required, email, minLength } from 'vuelidate/lib/validators'
import AuthService from '../services/auth-service.js'

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
    },
    nameErrors () {
      const errors = []
      const name = this.$v.user.name

      if (!name.$dirty) {
        return errors
      }

      !name.required && errors.push('Name Required.')
      !name.minLength && errors.push(`Insert at Least ${name.$params.minLength.min} Characters`)

      return errors
    },
    texts () {
      return this.isLogin ? { toolbar: 'Login', button: 'Create Account' }
        : { toolbar: 'Create Account', button: 'Already Registered' }
    }
  },
  data () {
    return {
      user: {
        name: '',
        email: '',
        password: ''
      },
      isLogin: true,
      isLoading: false
    }
  },
  validations () {
    const validations = {
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
    }

    if (this.isLogin) {
      return validations
    }

    return {
      user: {
        ...validations.user,
        name: {
          required,
          minLength: minLength(3)
        }
      }
    }
  },
  methods: {
    async submit () {
      this.isLoading = true

      try {
        await new Promise(resolve => setTimeout(resolve, 3000))
        this.isLogin ? await AuthService.login(this.user)
          : await AuthService.signup(this.user)
      } catch (error) {
        console.log(error)
      } finally {
        this.isLoading = false
      }
    }
  }
}
</script>

<style lang="scss" scoped>

</style>

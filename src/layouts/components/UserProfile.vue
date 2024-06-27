<script setup lang="ts">
import useLogin from '../../pages/auth/login/useLogin'
import avatar from '@images/svg/user.svg'
import type { IUser } from '@/pages/users/types'

const { logout } = useLogin()

const user = useLocalStorage<IUser>('userData', {} as IUser).value
const loggedUser = user ?? JSON.parse(user)
</script>

<template>
  <VBadge
    dot
    location="bottom right"
    offset-x="3"
    offset-y="3"
    bordered
    color="success"
  >
    <VAvatar
      class="cursor-pointer"
      color="primary"
    >
      <VImg
        v-if="loggedUser?.foto"
        :src="loggedUser?.foto ? loggedUser?.foto : avatar"
      />

      <span
        v-else
        class="text-xs"
      >{{ avatarText(loggedUser?.name) }}</span>

      <!-- SECTION Menu -->
      <VMenu
        activator="parent"
        width="230"
        location="bottom end"
        offset="14px"
      >
        <VList>
          <!-- 👉 User Avatar & Name -->
          <VListItem>
            <template #prepend>
              <VListItemAction start>
                <VBadge
                  dot
                  location="bottom right"
                  offset-x="3"
                  offset-y="3"
                  color="success"
                >
                  <VAvatar
                    :size="32"
                    color="primary"
                  >
                    <VImg
                      v-if="loggedUser?.foto"
                      :src="loggedUser?.foto ? loggedUser?.foto : avatar"
                    />

                    <span
                      v-else
                      class="text-xs"
                    >{{ avatarText(loggedUser?.name) }}</span>
                  </VAvatar>
                </VBadge>
              </VListItemAction>
            </template>

            <VListItemTitle class="font-weight-semibold">
              {{ loggedUser?.name }}
            </VListItemTitle>
            <VListItemSubtitle>{{ loggedUser?.role?.title }}</VListItemSubtitle>
          </VListItem>

          <VDivider class="my-2" />

          <!-- 👉 Profile -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-user"
                size="22"
              />
            </template>

            <VListItemTitle>Perfil</VListItemTitle>
          </VListItem>

          <!-- 👉 Settings -->
          <VListItem link>
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-settings"
                size="22"
              />
            </template>

            <VListItemTitle>Configurações</VListItemTitle>
          </VListItem>

          <!-- Divider -->
          <VDivider class="my-2" />

          <!-- 👉 Logout -->
          <VListItem @click="logout">
            <template #prepend>
              <VIcon
                class="me-2"
                icon="tabler-logout"
                size="22"
              />
            </template>

            <VListItemTitle>Sair</VListItemTitle>
          </VListItem>
        </VList>
      </VMenu>
      <!-- !SECTION -->
    </VAvatar>
  </VBadge>
</template>

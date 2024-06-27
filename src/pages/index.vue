<script setup lang="ts">
import { useApartamentoStore } from '@/pages/apartamento/store/useApartamentoStore'
import { echo } from '@/plugins/websocket'
import type { IApartamento, IApartamentoStore } from '@/pages/apartamento/types'
import { getLabel, getStatusApartamentoIcon, getStatusColor } from '@/enums/StatusApartamentoEnum'
import ContextMenu from '@/components/CDF/ContextMenu.vue'
import {IUser} from "@/pages/users/types";

definePage({
  meta: {
    action: 'read',
    subject: 'Auth',
  },
})

const store = useApartamentoStore()
const router = useRouter()

const {
  apartamentosCheckins,
} = storeToRefs(store)

const {
  apartamentosCheckin,
  interditarApartamento,
  liberarApartamento,
} = store

onMounted(() => {
  apartamentosCheckin()
})

echo.channel('checkin')
  .listen('.apartamentoUpdate', (e: IApartamentoStore) => {
    const index = apartamentosCheckins.value.findIndex(apartment => apartment.id === e.apartamento.id)
    if (index !== -1)
      apartamentosCheckins.value[index] = e.apartamento
  })

const getMenuItems = (apartment: IApartamento) => {
  const data = [{
    title: 'Ver Apartamento',
    click: () => {
      router.push(`/apartamento/editar/${apartment.id}`)
    },
  }]

  if (apartment.status === '3') {
    data.push({
      title: 'Liberar Apartamento',
      click: () => {
        liberarApartamento(apartment.id)
      },
    })
  }
  else {
    data.push({
      title: 'Interditar Apartamento',
      click: () => {
        interditarApartamento(apartment.id)
      },
    })
  }

  if (apartment.ultimo_checkin) {
    data.push({
      title: 'Ver Cliente',
      click: () => {
        router.push(`/cliente/editar/${apartment.ultimo_checkin?.cliente_id}`)
      },
    },
    {
      title: 'Ver CheckIn',
      click: () => {
        router.push(`/checkin/editar/${apartment.ultimo_checkin?.id}`)
      },
    })
  }

  return data
}
</script>

<template>
  <VCard>
    <VCardText>
      <VRow>
        <VCol
          v-for="apartment in apartamentosCheckins"
          :key="apartment.id"
          cols="6"
          md="2"
          @click="`${apartment.status === '0' ? router.replace(`/checkin/cadastrar?apt=${apartment.id}`) : null}`"
        >
          <ContextMenu :items="getMenuItems(apartment)">
            <div class="card position-relative">
              <VImg
                :src="getStatusApartamentoIcon(apartment?.status ?? '0')"
                cover
              />
              <VSheet
                class="card-title"
                :color="getStatusColor(apartment?.status ?? '0')"
              >
                <span>{{ apartment.codigo }}</span>
              </VSheet>
              <VTooltip activator="parent">
                <p class="ma-0 text-center">
                  {{ apartment.nome }}
                </p>
                <p class="ma-0 text-center">
                  {{ getLabel(apartment?.status ?? '0') }}
                </p>
              </VTooltip>
            </div>
          </ContextMenu>
        </VCol>
      </VRow>
    </VCardText>
  </VCard>
</template>

<style scoped lang="scss">
.card{
  cursor: pointer;

  .card-title{
    position: absolute;
    z-index: 100;
    bottom: 10px;
    border-radius: 10px;
    width: calc(100% - 20px);
    display: flex;
    flex-direction: column;
    align-items: center;
    left: 50%;
    transform: translate(-50%, 0);
  }

  &:hover{
    .card-title{
      background-color: rgba(255, 255, 255, 0.9);
    }
  }
}

.card-disabled {
  pointer-events: none;
  cursor: not-allowed;
}
</style>

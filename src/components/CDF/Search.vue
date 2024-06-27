<script setup lang="ts">
import { defineEmits, defineProps } from 'vue'

interface Props {
  campos: array
  endpoint: string
  labelCheckbox?: string
  showAppendCheckbox?: boolean
}
const props = defineProps<Props>()

const emit = defineEmits(['limpar_mensagem', 'result_search', 'emitirEvento'])

const campoSelecionado = ref('Listar Todos')
const campoDePesquisar = ref('')
const valorPesquisa = ref('')
const temRelacionamento = ref('no')
const podePesquisar = ref(false)
const fieldName = ref('')
const carregandoPesquisa = ref(false)
const alertaDialog = ref(false)
const fieldNotFound = ref('')
const campoComMascara = ref(false)
const modalErro = ref(false)
const mascara = ref('')
const regras = ref([])
let pesquisado: number = 0

const checkboxValue = ref(false)

const emitir = () => {
  emit('emitirEvento', checkboxValue)
}

const limparMensagem = () => {
  emit('limpar_mensagem', pesquisado)
}

function listarTodos() {
  campoDePesquisar.value = ''
  if (campoSelecionado.value === 'Listar Todos') {
    podePesquisar.value = true
    todos()
  }
  if (checkboxValue.value)
    emitir()
}

function todos() {
  $api(`${props.endpoint}`).then(response => {
    emit('result_search', response.data)
  })
}

async function verifyEnumValid(campo: any) {
  const enumExportName = campo.enumExportName

  podePesquisar.value = false

  const path = `../../${campo.pathToEnum}.ts`
  const enumFile = await import(path)
  for (const enumValue of enumFile[enumExportName]) {
    if (enumValue.nome.toLowerCase() === campoDePesquisar.value.toLowerCase()) {
      valorPesquisa.value = enumValue.codigo
      podePesquisar.value = true
    }
  }
}

async function verifyRelationship(relationship: any) {
  podePesquisar.value = false
  valorPesquisa.value = ''
  for (const relationshipValue of relationship.value) {
    const relationshipValueLower = relationshipValue[
      relationshipValue.relationship_search
    ].toLowerCase()

    if (relationshipValueLower.match(campoDePesquisar.value.toLowerCase())) {
      valorPesquisa.value = `${valorPesquisa.value}$$${relationshipValue.id}`
      temRelacionamento.value = 'yes'
      podePesquisar.value = true
    }
  }
}

async function sendSearch() {
  if (podePesquisar.value) {
    const value = valorPesquisa.value.replace('/', 'B')

    $api(`${props.endpoint}/pesquisarpor/${campoSelecionado.value}/${value}`)
      .then(res => {
        if (res.data.data)
          emit('result_search', res.data.data)
        else emit('result_search', res.data)

        carregandoPesquisa.value = false
        pesquisado++
      })
      .catch(() => {
        carregandoPesquisa.value = false
        modalErro.value = true
      })
  }
  else {
    carregandoPesquisa.value = false
    fieldNotFound.value = `Informe o valor de ${fieldName.value} corretamente`
    alertaDialog.value = true
  }
}

async function verifyField(campo: any) {
  fieldName.value = campo.title
  let estaVerificando = false
  if (Object.keys(campo.relationships).length > 0) {
    estaVerificando = true
    await verifyRelationship(campo.relationships[campo.value])
  }
  if (campo.pathToEnum !== '' && campo.enumExportName !== '') {
    estaVerificando = true
    await verifyEnumValid(campo)
  }
  if (!estaVerificando)
    podePesquisar.value = true
}
async function doSearch() {
  carregandoPesquisa.value = true
  valorPesquisa.value = campoDePesquisar.value
  temRelacionamento.value = 'no'
  podePesquisar.value = false
  for (const campo of props.campos) {
    if (campo.value === campoSelecionado.value)
      await verifyField(campo)
  }

  sendSearch()
}

async function Pesquisar(value: any) {
  if (campoDePesquisar.value !== '' && campoSelecionado.value !== 'Listar Todos')
    doSearch()
}

watch(campoSelecionado, novoValor => {
  if (novoValor === 'insc_federal' || novoValor === 'cnpj' || novoValor === 'cpf') {
    campoComMascara.value = true
    mascara.value = novoValor === 'cnpj' || novoValor === 'insc_federal' ? '##.###.###/####-##' : '###.###.###-##'
  }
  else {
    campoComMascara.value = false
  }
})
</script>

<template>
  <VDialog
    v-model="alertaDialog"
    max-width="500"
  >
    <DialogCloseBtn @click="alertaDialog = !alertaDialog" />

    <VCard class="text-center px-10 py-6">
      <VCardText>
        <VBtn
          icon
          variant="outlined"
          color="warning"
          class="mb-4"
          style="block-size: 88px; inline-size: 88px; pointer-events: none"
        >
          <span class="text-5xl">!</span>
        </VBtn>

        <h6 class="text-lg font-weight-medium">
          <ul>
            <VAlert
              v-if="fieldNotFound"
              color="warning"
            >
              {{ fieldNotFound }}
            </VAlert>
          </ul>
        </h6>
      </VCardText>
    </VCard>
  </VDialog>

  <AlertDialog
    v-model:is-dialog-visible="modalErro"
    title="Erro ao pesquisar"
    description="Ocorreu um erro ao pesquisar. Por favor, tente novamente mais tarde."
  />

  <VCol
    sm="12"
    md="3"
    lg="3"
  >
    <VSelect
      v-model="campoSelecionado"
      label="Escolher campo para Pesquisar"
      :items="campos"
      @update:model="Pesquisar"
      @update:model-value="listarTodos"
    >
      <template
        v-if="props.showAppendCheckbox"
        #append-item
      >
        <VDivider />
        <VListItem>
          <template #prepend>
            <VCheckbox
              v-model="checkboxValue"
              :label="props.labelCheckbox"
              @update:model-value="emitir"
            />
          </template>
        </VListItem>
      </template>
    </VSelect>
  </VCol>

  <VCol
    cols="12"
    sm="12"
    md="6"
    lg="5"
  >
    <VTextField
      v-if="!campoComMascara"
      v-model="campoDePesquisar"
      clearable
      type="text"
      color="primary"
      clear-icon="tabler-circle-x"
      append-inner-icon="tabler-search"
      @click:clear="limparMensagem"
      @click:append-inner="Pesquisar"
      @keyup.enter="Pesquisar"
    >
      <template #label>
        Pesquisar...
      </template>
    </VTextField>

    <VTextField
      v-if="campoComMascara"
      v-model="campoDePesquisar"
      v-mask="mascara"
      clearable
      type="text"
      color="primary"
      clear-icon="tabler-circle-x"
      append-inner-icon="tabler-search"
      @click:clear="limparMensagem"
      @click:append-inner="Pesquisar"
      @keyup.enter="Pesquisar"
    >
      <template #label>
        Pesquisar...
      </template>
    </VTextField>
    <VProgressLinear
      v-if="carregandoPesquisa"
      indeterminate
      height="5"
    />
  </VCol>
</template>

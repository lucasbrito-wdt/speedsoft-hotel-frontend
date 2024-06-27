<script setup lang="ts">
import { computed } from 'vue'
import { CurrencyDisplay, useCurrencyInput } from 'vue-currency-input'

defineOptions({
  name: 'InputDinheiro',
  inheritAttrs: false,
})

const props = withDefaults(defineProps<{
  modelValue: number
  maxValue?: number
  precision?: number
  hideCurrencySymbolOnFocus?: boolean
  hideGroupingSeparatorOnFocus?: boolean
  hideNegligibleDecimalDigitsOnFocus?: boolean
  autoDecimalDigits?: boolean
  useGrouping?: boolean
  accountingSign?: boolean
}>(), {
  maxValue: 9999999999999.99,
  precision: 2,
  hideCurrencySymbolOnFocus: true,
  hideGroupingSeparatorOnFocus: false,
  hideNegligibleDecimalDigitsOnFocus: false,
  autoDecimalDigits: true,
  useGrouping: true,
  accountingSign: false,
})

const emit = defineEmits<{
  (e: 'update:modelValue', value: number): void
}>()

const modelValue = toRef(props, 'modelValue', 0)
const maxValue = toRef(props, 'maxValue')
const precision = toRef(props, 'precision')
const hideCurrencySymbolOnFocus = toRef(props, 'hideCurrencySymbolOnFocus')
const hideGroupingSeparatorOnFocus = toRef(props, 'hideGroupingSeparatorOnFocus')
const hideNegligibleDecimalDigitsOnFocus = toRef(props, 'hideNegligibleDecimalDigitsOnFocus')
const autoDecimalDigits = toRef(props, 'autoDecimalDigits')
const useGrouping = toRef(props, 'useGrouping')
const accountingSign = toRef(props, 'accountingSign')

const {
  inputRef,
  formattedValue,
  numberValue,
  setValue,
} = useCurrencyInput({
  locale: 'pt-BR',
  currency: 'BRL',
  currencyDisplay: CurrencyDisplay.hidden,
  valueRange: {
    max: maxValue.value,
  },
  precision: precision.value,
  hideCurrencySymbolOnFocus: hideCurrencySymbolOnFocus.value,
  hideGroupingSeparatorOnFocus: hideGroupingSeparatorOnFocus.value,
  hideNegligibleDecimalDigitsOnFocus: hideNegligibleDecimalDigitsOnFocus.value,
  autoDecimalDigits: autoDecimalDigits.value,
  useGrouping: useGrouping.value,
  accountingSign: accountingSign.value,
})

const newValue = computed(() => {
  setValue(maxValue.value > 0 && modelValue.value >= maxValue.value ? maxValue.value : modelValue.value)
  emit('update:modelValue', numberValue.value ?? 0)

  return formattedValue.value
})
</script>

<template>
  <AppTextField
    v-bind="{
      ...$attrs,
    }"
    ref="inputRef"
    v-model="newValue"
  />
</template>

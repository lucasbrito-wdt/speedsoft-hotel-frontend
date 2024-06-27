import Limpo from '@/assets/icons/Limpo.png'
import Sujo from '@/assets/icons/Sujo.png'
import Sair from '@/assets/icons/Sair.png'
import Interditado from '@/assets/icons/Interditado.png'
import Ocupado from '@/assets/icons/Ocupado.png'

export enum StatusApartamentoEnum {
  Limpo = '0',
  Sujo = '1',
  Sair = '2',
  Interditado = '3',
  Ocupado = '4',
}

export const getLabel = (status: any) => {
  switch (status) {
    case StatusApartamentoEnum.Limpo:
      return 'Limpo'
    case StatusApartamentoEnum.Sujo:
      return 'Sujo'
    case StatusApartamentoEnum.Sair:
      return 'Sair'
    case StatusApartamentoEnum.Interditado:
      return 'Interditado'
    case StatusApartamentoEnum.Ocupado:
      return 'Ocupado'
  }
}
export const getStatusApartamentoIcon = (status: any) => {
  switch (status) {
    case StatusApartamentoEnum.Limpo:
      return Limpo
    case StatusApartamentoEnum.Sujo:
      return Sujo
    case StatusApartamentoEnum.Sair:
      return Sair
    case StatusApartamentoEnum.Interditado:
      return Interditado
    case StatusApartamentoEnum.Ocupado:
      return Ocupado
  }
}
export const getStatusColor = (status: any) => {
  switch (status) {
    case StatusApartamentoEnum.Limpo:
      return '#FFF'
    case StatusApartamentoEnum.Sujo:
      return 'error'
    case StatusApartamentoEnum.Sair:
      return 'success'
    case StatusApartamentoEnum.Interditado:
      return '#000'
    case StatusApartamentoEnum.Ocupado:
      return 'info'
  }
}

import type { Ref } from 'vue'
import type * as vue from 'vue'
import type { StateHandler } from 'v3-infinite-loading/lib/types'
import type { ISearch, ITerm } from '@/components/CDF/SearchBar.vue'

type HeaderCellProps = Record<string, any> | ((data: Pick<ItemKeySlot<any>, 'index' | 'item' | 'internalItem' | 'value'>) => Record<string, any>)
type SelectItemKey<T = Record<string, any>> = boolean | null | undefined | string | readonly (string | number)[] | ((item: T, fallback?: any) => any)

interface GroupableItem<T = any> {
  type: 'item'
  raw: T
}
interface SelectableItem {
  value: any
  selectable: boolean
}
interface DataTableItem<T = any> extends InternalItem<T>, GroupableItem<T>, SelectableItem {
  key: any
  index: number
  columns: {
    [key: string]: any
  }
}
interface ExpandProps {
  expandOnClick: boolean
  expanded: readonly string[]
  'onUpdate:expanded': ((value: any[]) => void) | undefined
}
declare function provideExpanded(props: ExpandProps): {
  expand: (item: DataTableItem, value: boolean) => void
  expanded: Ref<Set<string>> & {
    readonly externalValue: readonly string[]
  }
  expandOnClick: Ref<boolean>
  isExpanded: (item: DataTableItem) => boolean
  toggleExpand: (item: DataTableItem) => void
}

interface DataTableItemProps {
  items: any[]
  itemValue: SelectItemKey
  itemSelectable: SelectItemKey
  returnObject: boolean
}
declare function deepEqual(a: any, b: any): boolean
type EventProp<T extends any[] = any[], F = (...args: T) => void> = F
type SelectionProps = Pick<DataTableItemProps, 'itemValue'> & {
  modelValue: readonly any[]
  selectStrategy: 'single' | 'page' | 'all'
  valueComparator: typeof deepEqual
  'onUpdate:modelValue': EventProp<[any[]]> | undefined
}
declare function provideSelection(props: SelectionProps, { allItems, currentPage }: {
  allItems: Ref<SelectableItem[]>
  currentPage: Ref<SelectableItem[]>
}): {
  toggleSelect: (item: SelectableItem) => void
  select: (items: SelectableItem[], value: boolean) => void
  selectAll: (value: boolean) => void
  isSelected: (items: SelectableItem | SelectableItem[]) => boolean
  isSomeSelected: (items: SelectableItem | SelectableItem[]) => boolean
  someSelected: vue.ComputedRef<boolean>
  allSelected: vue.ComputedRef<boolean>
  showSelectAll: boolean
}

interface ItemSlotBase<T> {
  index: number
  item: T
  internalItem: DataTableItem<T>
  isExpanded: ReturnType<typeof provideExpanded>['isExpanded']
  toggleExpand: ReturnType<typeof provideExpanded>['toggleExpand']
  isSelected: ReturnType<typeof provideSelection>['isSelected']
  toggleSelect: ReturnType<typeof provideSelection>['toggleSelect']
}
interface DataTableHeader {
  key?: 'data-table-group' | 'data-table-select' | 'data-table-expand' | (string & {})
  value?: SelectItemKey
  title?: string
  fixed?: boolean
  align?: 'start' | 'end' | 'center'
  width?: number | string
  minWidth?: string
  maxWidth?: string
  headerProps?: Record<string, any>
  cellProps?: HeaderCellProps
  sortable?: boolean
  sort?: DataTableCompareFunction
  sortRaw?: DataTableCompareFunction
  filter?: FilterFunction
  children?: DataTableHeader[]
}
type InternalDataTableHeader = Omit<DataTableHeader, 'key' | 'value' | 'children'> & {
  key: string | null
  value: SelectItemKey | null
  sortable: boolean
  fixedOffset?: number
  lastFixed?: boolean
  colspan?: number
  rowspan?: number
  children?: InternalDataTableHeader[]
}
type ItemKeySlot<T> = ItemSlotBase<T> & {
  value: any
  column: InternalDataTableHeader
}
type DataTableCompareFunction<T = any> = (a: T, b: T) => number
type FilterFunction = (value: string, query: string, item?: InternalItem) => FilterMatch
interface InternalItem<T = any> {
  value: any
  raw: T
}
type FilterMatch = boolean | number | [number, number] | [number, number][]

export interface ILayoutTable {
  title: string
  newItem?: string
  newItemText?: string

  headers: IHeader[]
  actions: ITableAction[]
  items: any[]
  loading?: boolean
  loadingDestroy: boolean
  itemsPerPage?: string | number
  loadMore?: (...args: any[]) => void
  onOrderBy: (state: StateHandler, value: IOrderBy[]) => void
  isActionsTop?: boolean

  confirmDestroyItem?: boolean
  destroy: () => void

  termsSearch?: ITerm[]
  search?: ISearch
  onSearch?: (...args: any[]) => void
  onSearchAgain?: (...args: any[]) => void
  onReset?: (...args: any[]) => void
  isSearching?: boolean
}

export interface IHeader {
  key?: (string & {}) | 'data-table-group' | 'data-table-select' | 'data-table-expand' | undefined
  value?: SelectItemKey
  title?: string | undefined
  fixed?: boolean | undefined
  align?: 'center' | 'end' | 'start' | undefined
  width?: string | number | undefined
  minWidth?: string | undefined
  maxWidth?: string | undefined
  headerProps?: {
    readonly [x: string]: any
  } | undefined
  cellProps?: ((data: Pick<ItemKeySlot<any>, 'index' | 'item' | 'value' | 'internalItem'>) => Record<string, any>) | {
    readonly [x: string]: any
  } | undefined
  sortable?: boolean | undefined
  sort?: DataTableCompareFunction<any> | undefined
  sortRaw?: DataTableCompareFunction<any> | undefined
  filter?: FilterFunction | undefined
  children?: readonly any[] | undefined
}

export interface IOrderBy {
  key: string
  order: 'asc' | 'desc'
}

export interface ITableAction {
  title?: string
  icon?: string
  color?: 'primary' | 'success' | 'error' | 'warning' | 'info' | 'secondary'
  can?: {
    action: string
    subject: string
  }
  to?: (item: any) => void | string
  onClick?: (item: any) => Promise<void> | void | string
}

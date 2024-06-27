import utils from './utils'
import users from './users'

// This function returns an array of objects, each representing a navigation item.
// Each object has properties like title, to, and icon.
// The title is the text displayed for the navigation item.
// The to property is an object that contains the name of the route.
// The icon property is an object that contains the name of the icon.
export default [
  {
    title: 'Home',
    to: { name: 'root' },
    icon: { icon: 'tabler-smart-home' },
  },
  { heading: 'Principal' },
  ...users,
  { heading: 'Administrar' },
  {
    title: 'Checkin',
    icon: { icon: 'tabler-user-dollar' },
    children: [
      {
        title: 'Criar',
        to: 'checkin-cadastrar',
        action: 'create',
        subject: 'checkin',
      },
      {
        title: 'Pesquisar',
        to: 'checkin',
        action: 'list',
        subject: 'checkin',
      },
    ],
  },
  { heading: 'Cadastros' },
  {
    title: 'Clientes',
    icon: { icon: 'tabler-users' },
    children: [
      {
        title: 'Criar',
        to: 'cliente-cadastrar',
        action: 'create',
        subject: 'cliente',
      },
      {
        title: 'Pesquisar',
        to: 'cliente',
        action: 'list',
        subject: 'cliente',
      },
    ],
  },
  {
    title: 'Empresas',
    icon: { icon: 'tabler-building' },
    children: [
      {
        title: 'Criar',
        to: 'empresa-cadastrar',
        action: 'create',
        subject: 'empresa',
      },
      {
        title: 'Pesquisar',
        to: 'empresa',
        action: 'list',
        subject: 'empresa',
      },
    ],
  },
  {
    title: 'Apartamentos',
    icon: { icon: 'tabler-building-community' },
    children: [
      {
        title: 'Criar',
        to: 'apartamento-cadastrar',
        action: 'create',
        subject: 'apartamento',
      },
      {
        title: 'Pesquisar',
        to: 'apartamento',
        action: 'list',
        subject: 'apartamento',
      },
    ],
  },
  ...utils,
  {
    title: 'Sobre',
    to: { name: 'update' },
    icon: { icon: 'tabler-help' },
  },
]

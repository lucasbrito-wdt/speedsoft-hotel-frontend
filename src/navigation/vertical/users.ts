export default [
  {
    title: 'Usuários',
    icon: { icon: 'tabler-users-group' },
    children: [
      {
        title: 'Criar',
        to: 'users-cadastrar',
        action: 'create',
        subject: 'user',
      },
      {
        title: 'Pesquisar',
        to: 'users',
        action: 'list',
        subject: 'user',
      },
    ],
  },
]
